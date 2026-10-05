# Admin App

A minimal Angular 22.2.1 application generated with Angular CLI 22.2.1. It uses
standalone components, Angular Router, SCSS, strict TypeScript and template checking,
server-side rendering, client hydration, and Vitest. No UI libraries or feature
components have been added.

## Prerequisites and installation

Node 22.23.3 is recorded in `.nvmrc`; npm 10.9.9 was used to install dependencies.
Angular requires Node `^22.22.3 || ^24.15.0 || >=26.0.0`.

From this directory:

```bash
nvm install
nvm use
npm ci
```

## Development

```bash
npm start
```

Open http://localhost:4200/. The page contains only the heading “Admin App” and
“Angular application is running.” Unknown application paths redirect to `/`.

## Build and run production SSR

```bash
npm run build -- --configuration production
npm run serve:ssr:admin-app
```

The production server listens on http://localhost:4000/ by default. Set `PORT` to
choose another port. Deploy the server output together with the browser output;
serving only the browser files does not provide SSR.

The SSR host allowlist in `angular.json` permits `localhost`, `127.0.0.1`, and
`[::1]`. Add the deployment hostname to `security.allowedHosts` before building
for a hosted environment.

`src/app/app.routes.server.ts` uses `RenderMode.Server` for the `**` fallback, so
application pages render on the server for each request. `angular.json` uses
`outputMode: "server"`. The server configuration registers the routes through
`provideServerRendering(withRoutes(serverRoutes))`; the browser configuration
uses `provideClientHydration()`.

To inspect the server-rendered response without running client JavaScript:

```bash
curl -fsS http://localhost:4000/
```

The HTML response includes `<h1>Admin App</h1>` and the running message inside
`<app-root>`, along with Angular hydration metadata.

## Tests

```bash
npm test -- --watch=false
```

The CLI's Vitest setup tests component creation, starter content, root navigation,
and fallback redirects.

## Project structure

- `src/app/app.component.*`: standalone root component, minimal template, SCSS, and tests.
- `src/app/app.config.ts`: application providers, Router, and hydration.
- `src/app/app.config.server.ts`: merged server configuration and SSR providers.
- `src/app/app.routes.ts`: root route and fallback redirect.
- `src/app/app.routes.server.ts`: server rendering policy for application routes.
- `src/main.ts` / `src/main.server.ts`: browser and server bootstrap entry points.
- `src/server.ts`: generated Express server using `AngularNodeAppEngine`.
- `src/index.html` / `src/styles.scss`: HTML document and global SCSS.
- `angular.json` / `tsconfig*.json`: build, serve, test, and strict compiler configuration.
- `public/`: static assets.

## Creation command

```bash
npx --yes @angular/cli@latest new admin-app \
  --routing --style=scss --ssr --strict --standalone \
  --package-manager=npm --test-runner=vitest \
  --file-name-style-guide=2016 --interactive=false \
  --ai-config=none --skip-git
```

The filename option preserves the requested `app.component.*` structure. The
CLI-generated prerender fallback was changed to `RenderMode.Server` after creation.
