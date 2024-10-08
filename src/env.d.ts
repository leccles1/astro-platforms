/// <reference path="../.astro/types.d.ts" />
declare namespace App {
  interface Locals {
    session: import("lucia").Session | null;
    user: import("lucia").User | null;
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_ROOT_DOMAIN: string;
  readonly AUTH_DOMAIN: string;
  readonly DB_REMOTE_URL: string;
  readonly DB_APP_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
