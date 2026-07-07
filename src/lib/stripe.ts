import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY 尚未設定。請在 .env.local 加上 Stripe test mode key。"
    );
  }
  stripeInstance = new Stripe(key, {
    typescript: true,
  });
  return stripeInstance;
}