import Stripe from "stripe";
import {
  sendEmail,
  bibWelcomeEmail,
  oto1PurchaseEmail,
  oto2PurchaseEmail,
} from "./resend";
import { notifyOwner } from "../_core/notification";
import { BIB_PRODUCTS, BibProductKey } from "../stripe/bib-products";
import { enqueueDripSequence } from "./drip-scheduler";

/**
 * Handle BIB purchase email automation.
 * Called from the Stripe webhook when a checkout.session.completed event
 * has bib_product metadata.
 * 
 * Sends an immediate confirmation email AND enqueues the drip sequence.
 */
export async function handleBibPurchaseEmail(
  session: Stripe.Checkout.Session
): Promise<void> {
  const productKey = session.metadata?.bib_product as BibProductKey | undefined;
  const customerEmail = session.customer_details?.email || session.metadata?.customer_email;
  const customerName = session.customer_details?.name || session.metadata?.customer_name || "";
  const origin = extractOriginFromUrls(session.success_url || "");

  if (!productKey || !customerEmail) {
    console.warn("[BIB Email] Missing product key or email, skipping automation");
    return;
  }

  console.log(`[BIB Email] Processing ${productKey} purchase for ${customerEmail}`);

  try {
    // Send immediate confirmation email based on product
    switch (productKey) {
      case "main": {
        const email = bibWelcomeEmail(customerName, origin);
        email.to = customerEmail;
        await sendEmail(email);

        // Enqueue the full BIB drip sequence (Day 2, Day 5, Day 14, Day 30)
        // Step 0 (welcome) is already sent above, so the drip starts from step 1
        await enqueueDripSequence({
          recipientEmail: customerEmail,
          recipientName: customerName,
          sequenceKey: "bib_purchase",
          appUrl: origin,
          metadata: { productKey, sessionId: session.id },
        });
        break;
      }
      case "oto1": {
        const email = oto1PurchaseEmail(customerName, origin, true);
        email.to = customerEmail;
        await sendEmail(email);

        // Also enqueue app welcome drip since they now have app access
        await enqueueDripSequence({
          recipientEmail: customerEmail,
          recipientName: customerName,
          sequenceKey: "app_welcome",
          appUrl: origin,
          metadata: { productKey, accessType: "lifetime", sessionId: session.id },
        });
        break;
      }
      case "oto1Down": {
        const email = oto1PurchaseEmail(customerName, origin, false);
        email.to = customerEmail;
        await sendEmail(email);

        // Enqueue app welcome drip for 1-year access
        await enqueueDripSequence({
          recipientEmail: customerEmail,
          recipientName: customerName,
          sequenceKey: "app_welcome",
          appUrl: origin,
          metadata: { productKey, accessType: "1-year", sessionId: session.id },
        });
        break;
      }
      case "oto2": {
        const email = oto2PurchaseEmail(customerName, origin, true);
        email.to = customerEmail;
        await sendEmail(email);
        break;
      }
      case "oto2Down": {
        const email = oto2PurchaseEmail(customerName, origin, false);
        email.to = customerEmail;
        await sendEmail(email);
        break;
      }
    }

    // Notify the owner about the purchase
    const product = BIB_PRODUCTS[productKey];
    const priceFormatted = `$${(product.price / 100).toLocaleString()}`;
    await notifyOwner({
      title: `New BIB Purchase: ${product.name}`,
      content: `${customerName || "A customer"} (${customerEmail}) just purchased "${product.name}" for ${priceFormatted}.\n\nProduct: ${productKey}\nSession ID: ${session.id}`,
    });

    console.log(`[BIB Email] Successfully processed ${productKey} for ${customerEmail}`);
  } catch (err) {
    console.error(`[BIB Email] Error processing ${productKey} email:`, err);
  }
}

/**
 * Handle app subscription email automation.
 * Called from the Stripe webhook when a subscription checkout completes.
 */
export async function handleAppSubscriptionEmail(
  session: Stripe.Checkout.Session
): Promise<void> {
  const customerEmail = session.customer_details?.email || session.metadata?.customer_email;
  const customerName = session.customer_details?.name || session.metadata?.customer_name || "";
  const origin = extractOriginFromUrls(session.success_url || "");
  const plan = session.metadata?.plan || "pro";

  if (!customerEmail) {
    console.warn("[App Email] Missing email, skipping automation");
    return;
  }

  try {
    // Enqueue app welcome drip
    await enqueueDripSequence({
      recipientEmail: customerEmail,
      recipientName: customerName,
      sequenceKey: "app_welcome",
      appUrl: origin,
      metadata: { plan, sessionId: session.id },
    });

    // Notify owner
    await notifyOwner({
      title: `New App Subscriber: ${plan.toUpperCase()}`,
      content: `${customerName || "A customer"} (${customerEmail}) just subscribed to the ${plan} plan.\n\nSession ID: ${session.id}`,
    });

    console.log(`[App Email] Enqueued welcome drip for ${customerEmail} (${plan})`);
  } catch (err) {
    console.error("[App Email] Error:", err);
  }
}

/** Extract the origin (protocol + host) from a full URL */
function extractOriginFromUrls(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return "https://freedom1realsystem.com";
  }
}
