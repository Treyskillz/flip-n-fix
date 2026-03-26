import { getDb } from "../db";
import { emailDripQueue, emailDripLog } from "../../drizzle/schema";
import { eq, lte, and } from "drizzle-orm";
import { sendEmail } from "./resend";
import { getSequenceByKey, DripSequence } from "./drip-sequences";

/**
 * Enqueue an entire drip sequence for a recipient.
 * Called when a purchase or signup event occurs.
 */
export async function enqueueDripSequence(params: {
  recipientEmail: string;
  recipientName?: string;
  sequenceKey: string;
  appUrl: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  const { recipientEmail, recipientName, sequenceKey, appUrl, metadata } = params;
  const sequence = getSequenceByKey(sequenceKey);

  if (!sequence) {
    console.error(`[Drip] Unknown sequence: ${sequenceKey}`);
    return;
  }

  const db = await getDb();
  if (!db) {
    console.error("[Drip] Database not available");
    return;
  }

  const now = new Date();
  const metadataStr = JSON.stringify({ appUrl, ...metadata });

  // Insert all steps into the queue
  for (let i = 0; i < sequence.steps.length; i++) {
    const step = sequence.steps[i];
    const scheduledAt = new Date(now.getTime() + step.delayHours * 60 * 60 * 1000);

    await db.insert(emailDripQueue).values({
      recipientEmail,
      recipientName: recipientName || null,
      sequenceKey,
      stepIndex: i,
      stepName: step.stepName,
      scheduledAt,
      status: "pending",
      metadata: metadataStr,
    });
  }

  console.log(
    `[Drip] Enqueued ${sequence.steps.length} emails for ${recipientEmail} (sequence: ${sequenceKey})`
  );
}

/**
 * Cancel all pending emails for a recipient in a specific sequence.
 * Useful when a user upgrades or cancels.
 */
export async function cancelDripSequence(
  recipientEmail: string,
  sequenceKey: string
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db
    .update(emailDripQueue)
    .set({ status: "cancelled" })
    .where(
      and(
        eq(emailDripQueue.recipientEmail, recipientEmail),
        eq(emailDripQueue.sequenceKey, sequenceKey),
        eq(emailDripQueue.status, "pending")
      )
    );

  console.log(`[Drip] Cancelled pending emails for ${recipientEmail} (sequence: ${sequenceKey})`);
}

/**
 * Process the drip queue — send all emails that are due.
 * This should be called on a regular interval (e.g., every 5 minutes).
 */
export async function processDripQueue(): Promise<{ sent: number; failed: number }> {
  const db = await getDb();
  if (!db) {
    console.error("[Drip] Database not available");
    return { sent: 0, failed: 0 };
  }

  const now = new Date();
  let sent = 0;
  let failed = 0;

  // Get all pending emails that are due
  const dueEmails = await db
    .select()
    .from(emailDripQueue)
    .where(
      and(
        eq(emailDripQueue.status, "pending"),
        lte(emailDripQueue.scheduledAt, now)
      )
    )
    .limit(50); // Process in batches of 50

  if (dueEmails.length === 0) {
    return { sent: 0, failed: 0 };
  }

  console.log(`[Drip] Processing ${dueEmails.length} due emails`);

  for (const queueItem of dueEmails) {
    try {
      const sequence = getSequenceByKey(queueItem.sequenceKey);
      if (!sequence) {
        console.error(`[Drip] Unknown sequence: ${queueItem.sequenceKey}`);
        await db
          .update(emailDripQueue)
          .set({ status: "failed", errorMessage: "Unknown sequence" })
          .where(eq(emailDripQueue.id, queueItem.id));
        failed++;
        continue;
      }

      const step = sequence.steps[queueItem.stepIndex];
      if (!step) {
        console.error(`[Drip] Invalid step index: ${queueItem.stepIndex}`);
        await db
          .update(emailDripQueue)
          .set({ status: "failed", errorMessage: "Invalid step index" })
          .where(eq(emailDripQueue.id, queueItem.id));
        failed++;
        continue;
      }

      // Parse metadata for appUrl
      const metadata = queueItem.metadata ? JSON.parse(queueItem.metadata) : {};
      const appUrl = metadata.appUrl || "https://freedom1realsystem.com";
      const recipientName = queueItem.recipientName || "Investor";

      // Generate the email HTML
      const html = step.generateHtml(recipientName, appUrl, metadata);

      // Replace template variables in subject
      let subject = step.subject.replace("${name}", recipientName);

      // Send the email
      const success = await sendEmail({
        to: queueItem.recipientEmail,
        subject,
        html,
      });

      if (success) {
        // Mark as sent
        await db
          .update(emailDripQueue)
          .set({ status: "sent", sentAt: now })
          .where(eq(emailDripQueue.id, queueItem.id));

        // Log the sent email
        await db.insert(emailDripLog).values({
          recipientEmail: queueItem.recipientEmail,
          subject,
          sequenceKey: queueItem.sequenceKey,
          stepIndex: queueItem.stepIndex,
          status: "sent",
        });

        sent++;
        console.log(
          `[Drip] Sent: "${subject}" to ${queueItem.recipientEmail}`
        );
      } else {
        await db
          .update(emailDripQueue)
          .set({ status: "failed", errorMessage: "Send failed" })
          .where(eq(emailDripQueue.id, queueItem.id));

        await db.insert(emailDripLog).values({
          recipientEmail: queueItem.recipientEmail,
          subject,
          sequenceKey: queueItem.sequenceKey,
          stepIndex: queueItem.stepIndex,
          status: "failed",
        });

        failed++;
      }

      // Small delay between sends to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (err) {
      console.error(`[Drip] Error processing queue item ${queueItem.id}:`, err);
      await db
        .update(emailDripQueue)
        .set({
          status: "failed",
          errorMessage: err instanceof Error ? err.message : "Unknown error",
        })
        .where(eq(emailDripQueue.id, queueItem.id));
      failed++;
    }
  }

  console.log(`[Drip] Queue processed: ${sent} sent, ${failed} failed`);
  return { sent, failed };
}

// ─── Drip Queue Interval Timer ──────────────────────────────
let dripInterval: NodeJS.Timeout | null = null;

/** Start the drip queue processor (runs every 5 minutes) */
export function startDripProcessor(): void {
  if (dripInterval) {
    console.log("[Drip] Processor already running");
    return;
  }

  console.log("[Drip] Starting queue processor (every 5 minutes)");

  // Process immediately on start
  processDripQueue().catch((err) =>
    console.error("[Drip] Initial processing error:", err)
  );

  // Then every 5 minutes
  dripInterval = setInterval(() => {
    processDripQueue().catch((err) =>
      console.error("[Drip] Processing error:", err)
    );
  }, 5 * 60 * 1000);
}

/** Stop the drip queue processor */
export function stopDripProcessor(): void {
  if (dripInterval) {
    clearInterval(dripInterval);
    dripInterval = null;
    console.log("[Drip] Processor stopped");
  }
}
