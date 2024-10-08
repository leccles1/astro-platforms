import { defineMiddleware, sequence } from "astro/middleware";
import { lucia } from "./lib/auth";

/*
Some default pass through URLS, so middleware isn't ran
  1. api/ routes
  2. /login
  3. filename or custom domains like example.com.
*/
const passThroughUrls = new RegExp("(api/|chunks|[\\w-]+\\.\\w+).*");

export const domainHandler = defineMiddleware(async (context, next) => {
  const siteUrl = `${context.url.protocol}//${
    import.meta.env.PUBLIC_ROOT_DOMAIN
  }`;
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
    console.log(context.locals.user);
    if (!session && path !== "/login") {
      return context.redirect("/login");
    } else if (session && path === "/login") {
      return context.redirect("/");
    }

    const appUrl = new URL(`/app${path === "/" ? "" : path}`, siteUrl);
    return next(
      new Request(appUrl, {
        headers: {
          "X-Astro-Rewrite": "true",
        },
      })
    );
  }

  // Check if Requested URL is base domain.
  if (
    context.url.toString() ===
    `${context.url.protocol}//${import.meta.env.PUBLIC_ROOT_DOMAIN}/`
  ) {
    const homeUrl = new URL(`/home${path === "/" ? "" : path}`, siteUrl);
    return next(
      new Request(homeUrl, {
        headers: {
          "X-Astro-Rewrite": "true",
        },
      })
    );
  }

  // rewrite everything else to `/[domain]/[slug] dynamic route
  const domainUrl = new URL(`/${hostname}${path === "/" ? "" : path}`, siteUrl);
  return next(
    new Request(domainUrl, {
      headers: {
        "X-Astro-Rewrite": "true",
      },
    })
  );
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
