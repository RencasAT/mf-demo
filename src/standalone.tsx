/**
 * MODO STANDALONE — sólo desarrollo.
 *
 * Levanta este microfrontend en solitario en http://localhost:5174/demo: monta
 * el router, el Provider de Redux y llama al `register()` del módulo, que es
 * justo lo que hace el host al embeberlo.
 *
 * Necesita un host alcanzable (por defecto :5173, o el que indique
 * VITE_HOST_ENTRY), porque el core se consume por federación: el store es el
 * real del host, no uno simulado, así que lo que funciona aquí funciona
 * embebido.
 */
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, useRoutes } from "react-router";
import { Provider } from "react-redux";

import mfDemoModule from "./module";
import "./standalone.css";

/**
 * Los `host/*` se piden con `await import()`, nunca con `import` estático.
 *
 * Con import estático, @module-federation/vite no emite un import: deja las
 * bindings apuntando a un proxy diferido y las rellena en un `.then()` posterior,
 * cuando el remote acaba de cargar. El cuerpo del módulo no espera a ese
 * `.then()`, así que `register()` recibiría `injectReducer: undefined` y
 * reventaría con "injectReducer is not a function". El import dinámico espera al
 * módulo real antes de seguir.
 */
const { injectApi, injectReducer, store } = await import("host/store");

/**
 * La hoja de estilos del shell. Los componentes del host (`host/layout`,
 * `host/ui`) llegan por federación como JS: las clases de Tailwind que los
 * pintan se generan al compilar el host, no este repositorio, así que sin esto
 * el layout, las Card y la Table salen en crudo. Embebido no hace falta — el
 * host ya la cargó —, por eso vive aquí y no en `module.tsx`.
 *
 * También con await: un `import "host/styles"` por efecto secundario no llega a
 * leer ninguna propiedad del proxy, y el proxy sólo arranca la descarga cuando
 * alguien lo lee, así que la hoja no se pediría nunca. El orden de inyección da
 * igual: la cascada la fija el `@layer` de `styles.css`.
 */
await import("host/styles");

await mfDemoModule.register?.({
  store,
  injectReducer,
  injectApi,
  basePath: "/demo",
  getState: () => store.getState(),
});

const StandaloneRoutes = () =>
  useRoutes([
    { path: "/", element: <Navigate to="/demo" replace /> },
    { path: "/demo", children: mfDemoModule.routes },
  ]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <StandaloneRoutes />
    </BrowserRouter>
  </Provider>
);
