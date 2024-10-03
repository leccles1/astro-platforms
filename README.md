<p align="center">
  <br/>
  <a href="https://astro.build">Astro</a> platforms is Saas starter powered by Astro &mdash;
  <br/>
  Multi tenancy & authentication implemented via <a href="https://lucia-auth.com/">Lucia</a><br />
  Obviously inspired by the vercel platforms NextJS starter.
  <br/><br/>
</p>

<div align="center">

</div>

## Todo

- ~~Custom Middleware that handles rewrites for `app.<domain>` and subdomains~~
- Setup Drizzle, and Turso...
- ~~Implement auth via Lucia~~
  - ~~Protect `app.<domain>` behind auth~~
- Ensure deployed target works out the box..
- Provide proper dashboard at `app.<domain>.com`
- Enable true multi tenancy, with a db per tenant...

## Install

The **recommended** way to install the latest version of Astro is by running the command below:

```bash
pnpm create astro@latest --template leccles1/astro-platforms
```

Create a `.env` file, use `./env.example` to see required environment vars. `src/env.d.ts` is also setup to provide intelisense for `import.meta.env` calls

## Run

```bash
pnpm start
```
Will start up a local development version, using an in memory SQLite database.
## Build

```bash
pnpm build
```

## Documentation

Coming Soon

## Support

Having trouble? Raise an issue in this repo.

## Contributing

**New contributors welcome!**
