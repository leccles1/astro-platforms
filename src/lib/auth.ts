import { Lucia } from "lucia";
import { LibSQLAdapter } from "@lucia-auth/adapter-sqlite";

import { libSqlClient } from "../db";

const adapter = new LibSQLAdapter(libSqlClient, {
  user: "User",
  session: "Session",
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
}
