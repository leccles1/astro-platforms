import { defineMiddleware, sequence } from "astro/middleware";
import htmlMinifier from "html-minifier";

/*
Some default pass through URLS, so middleware isn't ran
  1. api/ routes
  2. /login
  3. filename or custom domains like example.com.
*/
const passThroughUrls = new RegExp("(api/|/login|[\\w-]+\\.\\w+).*");

export const minifier = defineMiddleware(async (_context, next) => {
  const response = await next();
  // check if the response is returning some HTML
  if (response.headers.get("content-type") === "text/html") {
    let headers = response.headers;
    let html = await response.text();
    let newHtml = htmlMinifier.minify(html, {
      removeAttributeQuotes: true,
      collapseWhitespace: true,
    });
    return new Response(newHtml, {
      status: 200,
      headers,
    });
  }
  return response;
});

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
  if (hostname === `app.${import.meta.env.PUBLIC_ROOT_DOMAIN}`) {
    // Check session...
    const session = true;
    if (!session && path !== "/login") {
      return context.redirect("/login");
    } else if (session && path === "/login") {
      return context.redirect("/");
    }

    const appUrl = new URL(`/app${path === "/" ? "" : path}`, siteUrl);

    return context.rewrite(
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
    return context.rewrite(
      new Request(homeUrl, {
        headers: {
          "X-Astro-Rewrite": "true",
        },
      })
    );
  }

  // rewrite everything else to `/[domain]/[slug] dynamic route
  const domainUrl = new URL(`/${hostname}${path === "/" ? "" : path}`, siteUrl);
  return context.rewrite(
    new Request(domainUrl, {
      headers: {
        "X-Astro-Rewrite": "true",
      },
    })
  );
});

export const onRequest = sequence(domainHandler, minifier);
