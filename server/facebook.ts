/**
 * Facebook Graph API integration for auto-posting blog content to a Facebook Page.
 *
 * Requires two environment variables:
 *   FACEBOOK_PAGE_ID          – numeric Page ID
 *   FACEBOOK_PAGE_ACCESS_TOKEN – long-lived Page Access Token with pages_manage_posts
 *
 * When credentials are missing the helpers return a descriptive "not_configured" result
 * instead of throwing, so the rest of the app keeps working.
 */

const GRAPH_API_VERSION = "v25.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

// ─── Helpers ──────────────────────────────────────────────────

function getCredentials(): { pageId: string; accessToken: string } | null {
  const pageId = process.env.FACEBOOK_PAGE_ID?.trim();
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
  if (!pageId || !accessToken) return null;
  return { pageId, accessToken };
}

export function isFacebookConfigured(): boolean {
  return getCredentials() !== null;
}

// ─── Types ────────────────────────────────────────────────────

export interface FacebookPostResult {
  success: boolean;
  postId?: string;
  postUrl?: string;
  error?: string;
  status: "posted" | "not_configured" | "failed";
}

export interface FacebookConnectionStatus {
  connected: boolean;
  pageId?: string;
  pageName?: string;
  error?: string;
}

// ─── Post to Facebook Page ────────────────────────────────────

/**
 * Publish a link post to the configured Facebook Page.
 *
 * @param message  – text body of the post
 * @param link     – URL to share (typically the blog post URL)
 */
export async function postToFacebook(
  message: string,
  link?: string,
): Promise<FacebookPostResult> {
  const creds = getCredentials();
  if (!creds) {
    return {
      success: false,
      status: "not_configured",
      error: "Facebook credentials not configured. Add FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN in Settings → Secrets.",
    };
  }

  try {
    const body: Record<string, string> = {
      message,
      access_token: creds.accessToken,
    };
    if (link) body.link = link;

    const res = await fetch(`${GRAPH_BASE}/${creds.pageId}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      const errMsg = data?.error?.message || `HTTP ${res.status}`;
      console.error("[Facebook] Post failed:", errMsg);
      return { success: false, status: "failed", error: errMsg };
    }

    const postId = data.id as string;
    // Facebook post URL format: https://www.facebook.com/{post_id}
    const postUrl = `https://www.facebook.com/${postId}`;

    console.log("[Facebook] Post published:", postId);
    return { success: true, status: "posted", postId, postUrl };
  } catch (err: any) {
    console.error("[Facebook] Network error:", err.message);
    return { success: false, status: "failed", error: err.message };
  }
}

// ─── Post a photo with message ────────────────────────────────

/**
 * Publish a photo post to the configured Facebook Page.
 *
 * @param message  – text body of the post
 * @param imageUrl – publicly accessible URL of the image
 */
export async function postPhotoToFacebook(
  message: string,
  imageUrl: string,
): Promise<FacebookPostResult> {
  const creds = getCredentials();
  if (!creds) {
    return {
      success: false,
      status: "not_configured",
      error: "Facebook credentials not configured.",
    };
  }

  try {
    const body = {
      message,
      url: imageUrl,
      access_token: creds.accessToken,
    };

    const res = await fetch(`${GRAPH_BASE}/${creds.pageId}/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      const errMsg = data?.error?.message || `HTTP ${res.status}`;
      console.error("[Facebook] Photo post failed:", errMsg);
      return { success: false, status: "failed", error: errMsg };
    }

    const postId = data.post_id || data.id;
    const postUrl = `https://www.facebook.com/${postId}`;

    console.log("[Facebook] Photo published:", postId);
    return { success: true, status: "posted", postId, postUrl };
  } catch (err: any) {
    console.error("[Facebook] Network error:", err.message);
    return { success: false, status: "failed", error: err.message };
  }
}

// ─── Verify Connection ────────────────────────────────────────

/**
 * Test the Facebook connection by fetching the Page name.
 */
export async function verifyFacebookConnection(): Promise<FacebookConnectionStatus> {
  const creds = getCredentials();
  if (!creds) {
    return {
      connected: false,
      error: "Facebook credentials not configured. Add FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN in Settings → Secrets.",
    };
  }

  try {
    const res = await fetch(
      `${GRAPH_BASE}/${creds.pageId}?fields=name,id&access_token=${creds.accessToken}`,
    );
    const data = await res.json();

    if (!res.ok) {
      const errMsg = data?.error?.message || `HTTP ${res.status}`;
      return { connected: false, pageId: creds.pageId, error: errMsg };
    }

    return {
      connected: true,
      pageId: data.id,
      pageName: data.name,
    };
  } catch (err: any) {
    return { connected: false, pageId: creds.pageId, error: err.message };
  }
}

// ─── Build a share URL (no token needed) ──────────────────────

/**
 * Generate a Facebook share dialog URL that works without any API credentials.
 * Users can click this to share a blog post manually via the Facebook share dialog.
 */
export function buildFacebookShareUrl(postUrl: string, quote?: string): string {
  const params = new URLSearchParams({
    u: postUrl,
  });
  if (quote) params.set("quote", quote);
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}
