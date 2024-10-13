import { defineConfig } from "drizzle-kit";

// import.meta not available here so env must be loaded
import { config } from "dotenv";
config({ path: ".env" });

export default defineConfig({
  dialect: "turso",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: process.env.DB_REMOTE_URL!,
    authToken: process.env.DB_APP_TOKEN!,
  },
  casing: "snake_case",
});
