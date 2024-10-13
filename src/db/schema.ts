import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { generateId } from "lucia";

export const User = sqliteTable("User", {
  id: text()
    .primaryKey()
    .$defaultFn(() => generateId(15)),
  email: text().unique(),
  hashed_password: text(),
});

export const Session = sqliteTable("Session", {
  id: text().primaryKey(),
  expiresAt: integer().notNull(),
  userId: text()
    .notNull()
    .references(() => User.id),
});

export const Site = sqliteTable("Site", {
  id: text()
    .primaryKey()
    .$defaultFn(() => generateId(15)),
  name: text().notNull(),
  description: text().notNull(),
  subdomain: text().notNull().unique(),
  customDomain: text().unique(),
  createdAt: integer(),
  updatedAt: integer(),
});

export type Site = typeof Site.$inferSelect;
