# Stripe setup guide

This app includes a $9 one-time payment flow for the full AI Visibility Report.
Currently running in **demo mode** (no real payments). Follow these steps to enable real Stripe payments.

## How it works

1. User scans a URL (free)
2. Sees basic results (score, categories, individual checks)
3. Below the free results, an upgrade gate offers "Unlock full report" for $9
4. Clicking the button creates a Stripe Checkout session and redirects the user
5. After payment, the user returns with `?checkout_session=...` in the URL
6. The app marks them as paid (localStorage) and shows all premium features

## Steps to enable Stripe

### 1. Create a Stripe account

Sign up at [stripe.com](https://stripe.com) if you haven't already.

### 2. Create a product and price

In the Stripe Dashboard:

- Go to **Products** and click **Add product**
- Name: "AI Visibility Full Report"
- Price: $9.00 USD (one-time)
- Copy the **Price ID** (starts with `price_`)

### 3. Get your API keys

From [Stripe Dashboard > Developers > API keys](https://dashboard.stripe.com/apikeys):

- **Publishable key** (starts with `pk_test_` or `pk_live_`)
- **Secret key** (starts with `sk_test_` or `sk_live_`)

### 4. Set environment variables

For local development, create a `.env` file:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PRICE_ID=price_your_price_id_here
```

For Vercel deployment, add these in **Settings > Environment Variables**.

### 5. Create the checkout API route

Create `api/checkout.ts`:

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { returnUrl } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      price: process.env.STRIPE_PRICE_ID!,
      quantity: 1,
    }],
    success_url: `${returnUrl}?checkout_session={CHECKOUT_SESSION_ID}`,
    cancel_url: returnUrl,
  });

  return Response.json({ url: session.url });
}
```

### 6. Install Stripe SDK

```bash
pnpm add stripe
```

### 7. Test with Stripe test mode

Use test API keys (`pk_test_...` / `sk_test_...`) and the test card number `4242 4242 4242 4242` (any future expiry, any CVC).

### 8. Go live

Replace test keys with live keys. Done!

## Demo mode behavior

When `VITE_STRIPE_PUBLISHABLE_KEY` is not set:

- The "Unlock full report" button enables demo mode instead of redirecting to Stripe
- A "Preview paid features" button is shown below the purchase button
- A demo banner appears at the top when demo mode is active
- The "Exit demo" button clears the demo state

All paid features work identically in demo mode. The only difference is no real payment occurs.

## Architecture notes

- Payment state is stored in `localStorage` (`aiv_paid_unlocked` for real payments, `aiv_demo_mode` for demo)
- The `paidState.ts` module handles all payment logic
- The `UpgradeGate` component renders the upgrade CTA
- All paid feature components check `hasFullAccess()` to determine visibility
- Swapping from demo to real Stripe requires: env vars + api/checkout.ts + `pnpm add stripe`
