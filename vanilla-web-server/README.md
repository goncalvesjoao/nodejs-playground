# vanilla web server

Example on how to organize a vanilla `node:http` server by individual files or namespaces.

## Scripts

- `npm run dev` starts the server directly from TypeScript using `tsx`
- `npm run build` compiles the server into `dist/`
- `npm start` runs the compiled server
- `npm test` runs all tests
- `npm test -- test/web-server.test.ts` runs a specific test file

## Getting started

```bash
npm install
npm run dev
```

The server listens on `http://localhost:3000` by default.

Server-rendered pages load browser assets through Vite:

- CSS is served as a regular static file from `public/assets/styles.css` to avoid flicker between page navigations
- in development, templates point to the Vite dev server entry for JavaScript only
- in production, the server reads `dist/public/manifest.json` to inject the built JavaScript files

## Environment configuration

The backend and Vite both read `VITE_DEV_SERVER_ORIGIN`.

You can define it per environment with env files such as:

```bash
.env.development
VITE_DEV_SERVER_ORIGIN=http://localhost:5173

.env.staging
VITE_DEV_SERVER_ORIGIN=https://staging-assets.example.com
```

Runtime env loading follows this order:

- `.env`
- `.env.local`
- `.env.{mode}`
- `.env.{mode}.local`

`process.env` values still take precedence over env files.

The backend runtime mode is resolved from `APP_ENV`, then `NODE_ENV`, and otherwise defaults to:

- `development` when running from source
- `production` when running from `dist/`
