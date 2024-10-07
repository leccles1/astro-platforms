/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "astro-platforms",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const siteDomain = process.env.ROOT_DOMAIN;
    const authDomain = process.env.AUTH_DOMAIN;
    const remoteDbUrl = process.env.DB_REMOTE_URL;
    const dbAppToken = process.env.DB_APP_TOKEN;

    if (siteDomain && authDomain && remoteDbUrl && dbAppToken) {
      new sst.aws.Astro("astro-platforms", {
        server: {
          install: ["@node-rs/argon2", "@node-rs/bcrypt", "@libsql/client"],
        },
        domain: {
          name: siteDomain,
          aliases: [`*.${siteDomain}`],
        },
        environment: {
          PUBLIC_ROOT_DOMAIN:
            $app.stage === "dev" ? siteDomain : "localhost:4321",
          PUBLIC_ROOT_AUTH_DOMAIN:
            $app.stage === "dev" ? authDomain : "app.localhost:4321",
          ASTRO_DB_REMOTE_URL: remoteDbUrl,
          ASTRO_DB_APP_TOKEN: dbAppToken,
        },
      });

      return;
    }

    throw new Error(
      "Environment is misconfigured. Please ensure all required environment variables are set."
    );
  },
});
