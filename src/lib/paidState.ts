const PAID_KEY = 'aiv_paid_unlocked';
const DEMO_KEY = 'aiv_demo_mode';

export function isPaidUnlocked(): boolean {
  return localStorage.getItem(PAID_KEY) === 'true';
}

export function isDemoMode(): boolean {
  return localStorage.getItem(DEMO_KEY) === 'true';
}

export function hasFullAccess(): boolean {
  return isPaidUnlocked() || isDemoMode();
}

export function setPaidUnlocked(value: boolean): void {
  if (value) {
    localStorage.setItem(PAID_KEY, 'true');
  } else {
    localStorage.removeItem(PAID_KEY);
  }
}

export function setDemoMode(value: boolean): void {
  if (value) {
    localStorage.setItem(DEMO_KEY, 'true');
  } else {
    localStorage.removeItem(DEMO_KEY);
  }
}

export function clearAllAccess(): void {
  localStorage.removeItem(PAID_KEY);
  localStorage.removeItem(DEMO_KEY);
}

/**
 * Redirect to Stripe Checkout for payment.
 * In demo mode, this just enables demo access.
 * When real Stripe is configured, this creates a checkout session via /api/checkout.
 */
export async function initiateCheckout(): Promise<void> {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  if (!stripeKey) {
    // No Stripe configured: enable demo mode
    setDemoMode(true);
    window.dispatchEvent(new Event('aiv-access-changed'));
    return;
  }

  // Real Stripe flow
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        returnUrl: window.location.href,
      }),
    });

    if (!res.ok) throw new Error('Checkout failed');
    const { url } = await res.json();
    window.location.href = url;
  } catch {
    // Fallback to demo mode if Stripe fails
    setDemoMode(true);
    window.dispatchEvent(new Event('aiv-access-changed'));
  }
}

/**
 * Handle return from Stripe Checkout.
 * Call this on app load to check for successful payment.
 */
export function handleCheckoutReturn(): boolean {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('checkout_session');

  if (sessionId) {
    setPaidUnlocked(true);
    // Clean the URL
    const url = new URL(window.location.href);
    url.searchParams.delete('checkout_session');
    window.history.replaceState({}, '', url.toString());
    return true;
  }

  return false;
}
