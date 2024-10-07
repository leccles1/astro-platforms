import { defineMiddleware, sequence } from "astro/middleware";
import { lucia } from "./lib/auth";

/*
Some default pass through URLS, so middleware isn't ran
  1. api/ routes
  3. filename or custom domains like example.com.
*/
const passThroughUrls = new RegExp("(api/|chunks|[\\w-]+\\.\\w+).*");

export const domainHandler = defineMiddleware(async (context, next) => {
  const siteUrl = context.site?.toString();

  // Pass through on rewrite or excluded url.

  if (
    context.request.headers.get("X-Astro-Rewrite") ||
    passThroughUrls.exec(context.url.pathname)
  ) {
    return next();
  }
  // Get hostname of request (e.g. demo.localhost:3000)
  const hostname = context.url.host;
  const searchParams = context.url.searchParams.toString();
  const path = `${context.url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;
  //rewrite for app pages
  if (hostname === `${import.meta.env.PUBLIC_ROOT_AUTH_DOMAIN}`) {
    // Check session...
    const session = context.locals.session;
    if (!session && path !== "/login") {
      return context.redirect("/login");
    } else if (session && path === "/login") {
      return context.redirect("/");
    }

    const appUrl = new URL(`/app${path === "/" ? "" : path}`, siteUrl);
    // Default cache behaviour example - /app paths are authed routes so mark as so.
    context.request.headers.set(
      "Cache-Control",
      "private, no-cache, no-store, max-age=0, must-revalidate"
    );
    context.request.headers.set("X-Astro-Rewrite", "true");
    return next(appUrl);
  }

  // Check if Requested URL is base domain.
  if (
    context.url.toString() ===
    `${context.url.protocol}//${import.meta.env.PUBLIC_ROOT_DOMAIN}/`
  ) {
    const homeUrl = new URL(`/home${path === "/" ? "" : path}`, siteUrl);
    context.request.headers.set("X-Astro-Rewrite", "true");
    return next(homeUrl);
  }

  // rewrite everything else to `/[domain]/[slug] dynamic route
  const domainUrl = new URL(`/${hostname}${path === "/" ? "" : path}`, siteUrl);

  context.request.headers.set("X-Astro-Rewrite", "true");
  return next(domainUrl);
});

const authHandler = defineMiddleware(async (context, next) => {
  const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    context.locals.user = null;
    context.locals.session = null;
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  }
  context.locals.session = session;
  context.locals.user = user;
  return next();
});

export const onRequest = sequence(authHandler, domainHandler);
