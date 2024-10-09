import { drizzle } from "drizzle-orm/connect";

export const db = await drizzle("turso", {
  connection: {
    url: import.meta.env.DB_REMOTE_URL,
    authToken: import.meta.env.DB_APP_TOKEN,
  },
});
