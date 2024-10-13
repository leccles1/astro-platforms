import { db } from "@/db";
import { User } from "@/db/schema";
import { lucia } from "@/lib/auth";
import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";

export const user = {
  signInWithEmail: defineAction({
    accept: "form",
    input: z.object({
      email: z.string(),
      password: z.string().min(6).max(255),
    }),
    handler: async (input, context) => {
      try {
        const { password, email } = input;
        console.error("Got user: ", email);
        const existingUser = await db
          .select()
          .from(User)
          .where(eq(User.email, email.toLowerCase()))
          .get();

        if (!existingUser) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Valid user not found.",
          });
        }

        const validPassword = await new Argon2id().verify(
          existingUser.hashed_password!,
          password
        );

        if (!validPassword) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Invalid password.",
          });
        }
        console.warn("setting session...");
        const session = await lucia.createSession(existingUser.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        console.error(sessionCookie);
        context.cookies.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message);
        }
      }
    },
  }),
};
