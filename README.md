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

## SST Deploy
This branch is the SST deployment of the Astro Platforms starter.

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
pnpm create astro@latest --template leccles1/astro-platforms#sst-deploy
```

Configure a `.env` file with the below values
```
#Root domain of your site
ROOT_DOMAIN=example-domain.xyz
AUTH_DOMAIN=app.example-domain.xyz

#Databse configuration (libsql by default)
DB_REMOTE_URL=libsql://<libsql db url>
DB_APP_TOKEN=<libsql token>
```


## Run

```bash
sst dev
```
Will start up a local development version, using an in memory SQLite database. accessible at `localhost:4321`

## Build & deploy

set a stage name like `production`

```bash
sst deploy --stage production
```

## Documentation

Coming Soon

## Support

Having trouble? Raise an issue in this repo.

## Contributing

**New contributors welcome!**
