/// <reference types="vite/client" />

// Extend ImportMetaEnv with our expected variable
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  // more env vars...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
