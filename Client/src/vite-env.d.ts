/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_ANALYTICS_ID?: string;
  readonly VITE_ENV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
