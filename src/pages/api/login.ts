import { lucia } from "@/lib/auth";
import { Argon2id } from "oslo/password";
import { db } from "@/db/index";
import { User } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { APIContext } from "astro";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const email = (formData.get("email") as string).trim();

  const password = formData.get("password");

  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return new Response("Invalid password", {
      status: 400,
    });
  }

  const existingUser = await db
    .select()
    .from(User)
    .where(eq(User.email, email.toLowerCase()))
    .get();

  if (!existingUser) {
    return new Response("Incorrect username or password", {
      status: 400,
    });
  }

  const validPassword = await new Argon2id().verify(
    existingUser.hashed_password!,
    password
  );

  if (!validPassword) {
    return new Response("Incorrect username or password", {
      status: 400,
    });
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  console.error(sessionCookie);
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return context.redirect(
    `${context.url.protocol}//${import.meta.env.PUBLIC_ROOT_AUTH_DOMAIN}`
  );
}
