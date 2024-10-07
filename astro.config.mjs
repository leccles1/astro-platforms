// @ts-check
import { defineConfig } from "astro/config";
import db from "@astrojs/db";
import aws from "astro-sst";

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: import.meta.env.PROD
    ? `https://${import.meta.env.PUBLIC_ROOT_DOMAIN}/`
    : "http://localhost:4321",
  adapter: aws({
    serverRoutes: ["api/*", "app/login"],
  }),
  redirects: {
    "favicon.ico": "/favicon.svg",
  },
  security: {
    checkOrigin: true,
  },
  integrations: [db()],
  vite: {
    optimizeDeps: {
      exclude: ["astro:db"],
    },
  },
});
