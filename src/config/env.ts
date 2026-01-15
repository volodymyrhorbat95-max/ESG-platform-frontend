// Frontend environment configuration
// All environment variables must be prefixed with VITE_ to be accessible in the browser

interface FrontendEnvConfig {
  apiUrl: string;
  stripePublishableKey: string;
  adminSku: string;
}

const validateFrontendEnv = (): FrontendEnvConfig => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const adminSku = import.meta.env.VITE_ADMIN_SKU;

  if (!apiUrl) {
    throw new Error('Missing required environment variable: VITE_API_URL');
  }

  if (!stripePublishableKey) {
    throw new Error('Missing required environment variable: VITE_STRIPE_PUBLISHABLE_KEY');
  }

  if (!adminSku) {
    throw new Error('Missing required environment variable: VITE_ADMIN_SKU');
  }

  return {
    apiUrl,
    stripePublishableKey,
    adminSku,
  };
};

export const env = validateFrontendEnv();
