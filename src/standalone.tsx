import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, useRoutes } from "react-router";
import { Provider } from "react-redux";

import { injectApi, injectReducer, store } from "host/store";

/**
 * La hoja de estilos del shell. Los componentes del host (`host/layout`,
 * `host/ui`) llegan por federación como JS: las clases de Tailwind que los
 * pintan se generan al compilar el host, no este repositorio, así que sin esto
 * el layout, las Card y la Table salen en crudo. Embebido no hace falta — el
 * host ya la cargó —, por eso vive aquí y no en `module.tsx`.
 */
import "host/styles";

import mfDemoModule from "./module";
import "./standalone.css";

/**
 * MODO STANDALONE — sólo desarrollo.
 *
 * Levanta este microfrontend en solitario en http://localhost:5176/demo.
 * Necesita un host alcanzable (por defecto :5173, o el que indique
 * VITE_HOST_ENTRY), porque el core se consume por federación: es el store real
 * del host, no uno de mentira, así que lo que funciona aquí funciona embebido.
 */
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
