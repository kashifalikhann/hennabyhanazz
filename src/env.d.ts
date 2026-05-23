/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  readonly PUBLIC_STRIPE_KEY: string;
  readonly STRIPE_SECRET_KEY: string;
  readonly STRIPE_WEBHOOK_SECRET: string;
  readonly PUBLIC_GTM_ID?: string;
  readonly PUBLIC_FB_PIXEL_ID?: string;
  readonly CONTACT_EMAIL: string;
  readonly SITE_URL: string;
  readonly PUBLIC_SITE_URL: string;
  readonly RESEND_API_KEY: string;
  readonly FROM_EMAIL: string;
  readonly INSTAGRAM_ACCESS_TOKEN: string;
  readonly INSTAGRAM_USER_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
