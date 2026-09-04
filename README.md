# mf-demo

Microfrontend **Demo** del backoffice (host: `digital/web-digital-atbo`).

Repositorio independiente: su propio ciclo de vida, su propio despliegue y su
propia versión. El host solo reserva la ruta `/demo/*` y carga este
`remoteEntry.js` en runtime. El modelo completo está documentado en
`MICROFRONTENDS.md` del host.

| | |
| --- | --- |
| `remoteName` | `mfDemo` (debe coincidir con el registro del host) |
| Ruta en el host | `/demo` |
| Puerto dev | `5174` |
| Módulo expuesto | `./module` |

## Requisitos

`@atbo/mf-kit` se instala del Package Registry de GitLab, así que hace falta un
token con scope `read_api`:

```bash
export NPM_TOKEN=<token>   # local (el .npmrc lo lee del entorno)
pnpm install
```

En Vercel, la misma variable se define en *Settings → Environment Variables*.

## Desarrollo

```bash
pnpm dev    # http://localhost:5174/demo
```

**Necesita un host alcanzable**: el core (store, UI, layout, sesión) se consume
por federación desde el host, también en standalone. Por defecto `:5173`; para no
levantarlo en local, apunta a un entorno desplegado:

```bash
VITE_HOST_ENTRY=https://dev-web-bo.apuestatotal.dev/remoteEntry.js pnpm dev
```

## Build y despliegue

```bash
pnpm build:prod   # -> dist/ (incluye dist/remoteEntry.js)
```

`dist/` se publica en cualquier hosting estático. Dos cabeceras que **no son
opcionales** — ya están en `vercel.json`:

- **CORS**: el host carga este `remoteEntry.js` desde otro origen. Sin
  `Access-Control-Allow-Origin`, el navegador bloquea el módulo.
- **Cache**: `remoteEntry.js` es el manifiesto y apunta a los assets con hash.
  Si se cachea, tras cada despliegue el host sigue sirviendo la versión
  anterior. `remoteEntry.js` → `no-cache`; `assets/*` → `immutable`.

El host apunta aquí sin recompilarse, desde su `public/mf-remotes.js`:

```js
window.__MF_REMOTES__ = { DEMO: "https://mf-demo-eta.vercel.app/remoteEntry.js" };
```

## Estructura

```
src/module.tsx        contrato con el host: routes + register (único punto de entrada)
src/standalone.tsx    modo solitario, sólo desarrollo
src/pages/            vistas del módulo
src/store/            slice y API propias, inyectadas en el store del host
src/styles.css        tokens de @atbo/mf-kit + utilidades sin preflight
```

## Al tocar el contrato

`contractVersion` se sella en `module.tsx` con `CONTRACT_VERSION` del kit. Si el
host espera otra versión, corta al cargar con un error explícito en su
`ErrorBoundary` en vez de fallar por dentro: hay que subir `@atbo/mf-kit` aquí y
volver a desplegar.
