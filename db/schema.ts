import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { generateId } from "lucia";

export const User = sqliteTable("User", {
  id: text("id").primaryKey().default(generateId(15)),
  email: text("email").unique(),
  hashed_password: text(),
});

export const Session = sqliteTable("Session", {
  id: text().primaryKey(),
  expiresAt: integer("expires_at").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => User.id),
});

export const Site = sqliteTable("Site", {
  id: text().primaryKey().default(generateId(15)),
  name: text().notNull(),
  description: text().notNull(),
  subdomain: text().notNull().unique(),
  customDomain: text().unique(),
  createdAt: integer(),
  updatedAt: integer(),
});
