import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

export const libSqlClient = createClient({
  url: import.meta.env.DB_REMOTE_URL,
  authToken: import.meta.env.DB_APP_TOKEN,
});

export const db = drizzle(libSqlClient);
