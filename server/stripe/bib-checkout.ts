import Stripe from "stripe";
import { BIB_PRODUCTS, BibProductKey } from "./bib-products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil" as any,
});

export interface CreateBibCheckoutParams {
  userId?: number;
  userEmail?: string;
  userName?: string;
  productKey: BibProductKey;
  origin: string;
}

export async function createBibCheckoutSession(params: CreateBibCheckoutParams) {
  const { userId, userEmail, userName, productKey, origin } = params;

  const product = BIB_PRODUCTS[productKey];
  if (!product) {
    throw new Error(`Invalid BIB product: ${productKey}`);
  }

  // Determine the next step after purchase based on product
  let successUrl: string;
  switch (productKey) {
    case "main":
      // After main purchase, show OTO 1
      successUrl = `${origin}/bib/oto1?purchased=main`;
      break;
    case "oto1":
      // After OTO 1 purchase, show OTO 2
      successUrl = `${origin}/bib/oto2?purchased=oto1`;
      break;
    case "oto1Down":
      // After OTO 1 downsell purchase, show OTO 2
      successUrl = `${origin}/bib/oto2?purchased=oto1down`;
      break;
    case "oto2":
      // After OTO 2 purchase, show thank you
      successUrl = `${origin}/bib/thank-you?purchased=oto2`;
      break;
    case "oto2Down":
      // After OTO 2 downsell purchase, show thank you
      successUrl = `${origin}/bib/thank-you?purchased=oto2down`;
      break;
    default:
      successUrl = `${origin}/bib/thank-you`;
  }

  // Cancel URL goes to the downsell or skips
  let cancelUrl: string;
  switch (productKey) {
    case "main":
      cancelUrl = `${origin}/business-in-a-box?canceled=true`;
      break;
    case "oto1":
      // Declined OTO 1 → show downsell
      cancelUrl = `${origin}/bib/oto1-down?declined=oto1`;
      break;
    case "oto1Down":
      // Declined downsell → skip to OTO 2
      cancelUrl = `${origin}/bib/oto2?skipped=oto1`;
      break;
    case "oto2":
      // Declined OTO 2 → show downsell
      cancelUrl = `${origin}/bib/oto2-down?declined=oto2`;
      break;
    case "oto2Down":
      // Declined downsell → thank you
      cancelUrl = `${origin}/bib/thank-you?skipped=oto2`;
      break;
    default:
      cancelUrl = `${origin}/business-in-a-box`;
  }

  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    payment_method_types: ["card"],
    allow_promotion_codes: true,
    metadata: {
      bib_product: productKey,
      user_id: userId?.toString() || "",
      customer_email: userEmail || "",
      customer_name: userName || "",
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.price,
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  };

  if (userEmail) {
    sessionConfig.customer_email = userEmail;
  }
  if (userId) {
    sessionConfig.client_reference_id = userId.toString();
  }

  const session = await stripe.checkout.sessions.create(sessionConfig);

  return { url: session.url, sessionId: session.id };
}
