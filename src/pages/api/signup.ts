import type { APIContext, APIRoute } from "astro";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { lucia } from "../../lib/auth";
import { db, User } from "astro:db";
export const POST: APIRoute = async (context: APIContext) => {
  try {
    const data = await context.request.formData();
    const email = (data.get("username") as string).trim();
    const password = data.get("password");

    if (
      typeof password !== "string" ||
      password.length < 6 ||
      password.length > 255
    ) {
      return new Response("Invalid password", {
        status: 400,
      });
    }

    const userId = generateId(15);
    const hashedPassword = await new Argon2id().hash(password);

    await db.insert(User).values({
      id: userId,
      email: email.toLowerCase(),
      hashed_password: hashedPassword,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return context.redirect(
      `${context.url.protocol}//${import.meta.env.AUTH_DOMAIN}`
    );
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
  }
  return new Response(null, { status: 400 });
};
