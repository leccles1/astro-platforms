import { defineMiddleware, sequence } from "astro/middleware";
import { lucia } from "./lib/auth";
import type { APIContext } from "astro";

/*
Some default pass through URLS, so middleware isn't ran
  1. api/ routes
  3. filename or custom domains like example.com.
*/
const passThroughUrls = new RegExp("(api/|chunks|_image|[\\w-]+\\.\\w+).*");

export const domainHandler = defineMiddleware(
  async (context: APIContext, next) => {
    console.warn("Incoming URL is: ", context.url.toString());
    const siteUrl = context.site?.toString();

    const hostname = context.url.host;
    const searchParams = context.url.searchParams.toString();
    const path = `${context.url.pathname}${
      searchParams.length > 0 ? `?${searchParams}` : ""
    }`;

    // Pass through on rewrite or excluded url.
    if (
      context.locals.rewriteProcessed ||
      passThroughUrls.exec(context.url.pathname)
    ) {
      console.warn("Pass through hit: ", context.url.toString());
      return next();
    }
    // Url will be re-written after this point regardless
    context.locals.rewriteProcessed = true;
    // Get hostname of request (e.g. demo.localhost:3000)

    //rewrite for app pages
    if (hostname === `${import.meta.env.PUBLIC_ROOT_AUTH_DOMAIN}`) {
      // Check session...
      const session = context.locals.session;
      console.error("Got session: ", session);
      const isPost = context.request.method === "POST";
      if (!session && path !== "/login" && !isPost) {
        return context.redirect("/login");
      } else if (session && path === "/login" && !isPost) {
        return context.redirect("/");
      }
      console.warn("Path before is: ", path);
      const appPath = path.startsWith("/app")
        ? path
        : `/app${path === "/" ? "" : path}`;

      const appUrl = new URL(`${appPath}`, siteUrl);
      // Default cache behaviour example - /app paths are authed routes so mark as so.
      context.request.headers.set(
        "Cache-Control",
        "private, no-cache, no-store, max-age=0, must-revalidate"
      );
      console.warn("App url to next: ", appUrl.toString());
      return next(appUrl);
    }

    // Check if Requested URL is base domain.
    if (
      context.url.toString() ===
      `${context.url.protocol}//${import.meta.env.PUBLIC_ROOT_DOMAIN}/`
    ) {
      const homeUrl = new URL(`/home${path === "/" ? "" : path}`, siteUrl);
      console.warn("Home url to next:", homeUrl.toString());
      return next(homeUrl);
    }

    // rewrite everything else to `/[domain]/[slug] dynamic route
    const domainUrl = new URL(
      `/${hostname}${path === "/" ? "" : path}`,
      siteUrl
    );
    console.warn("Domain url to next: ", domainUrl.toString());
    return next(domainUrl);
  }
);

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
