import type { APIContext, APIRoute } from "astro";
import { Argon2id } from "oslo/password";
import { lucia } from "@/lib/auth";
import { db } from "@/db";
import { User } from "@/db/schema";

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

    // const userId = generateId(15);
    const hashedPassword = await new Argon2id().hash(password);

    const [user] = await db
      .insert(User)
      .values({
        // id: userId,
        email: email.toLowerCase(),
        hashed_password: hashedPassword,
      })
      .returning({ id: User.id });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return context.redirect(
      `${context.url.protocol}//${import.meta.env.PUBLIC_ROOT_AUTH_DOMAIN}`
    );
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
  }
  return new Response(null, { status: 400 });
};
