/// <reference types="vite/client" />

/**
 * Vite Environment Variables
 *
 * This file tells TypeScript about the environment variables
 * available through import.meta.env in Vite projects.
 *
 * Variables must be prefixed with VITE_ to be exposed to the browser.
 */
interface ImportMetaEnv {
  // Supabase credentials
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;

  // Add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
