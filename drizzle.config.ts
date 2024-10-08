import { defineConfig } from "drizzle-kit";

// import.meta not available here so env must be loaded
import { config } from "dotenv";
config({ path: ".env" });

export default defineConfig({
  dialect: "turso",
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dbCredentials: {
    url: process.env.DB_REMOTE_URL!,
    authToken: process.env.DB_APP_TOKEN!,
  },
});
