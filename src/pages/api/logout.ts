import type { APIRoute, APIContext } from "astro";
import { lucia } from "../../lib/auth";

export const GET: APIRoute = async (context: APIContext) => {
  if (context.locals.session) {
    await lucia.invalidateSession(context.locals.session.id);
  }
  return context.redirect("/");
};
