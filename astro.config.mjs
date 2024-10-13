// @ts-check
import { defineConfig } from "astro/config";
import aws from "astro-sst";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "server",
  experimental: {
    serverIslands: true,
  },
  site: import.meta.env.PROD
    ? `https://${import.meta.env.PUBLIC_ROOT_DOMAIN}/`
    : "http://localhost:4321",
  adapter: aws({
    serverRoutes: ["api/*", "app/login", "/sites"],
  }),
  redirects: {
    "favicon.ico": "/favicon.svg",
  },
  security: {
    checkOrigin: true,
  },
  integrations: [tailwind(), icon(), react()],
});
