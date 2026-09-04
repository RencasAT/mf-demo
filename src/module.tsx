import type { RouteObject } from "react-router";
import { Navigate } from "react-router";
import { CONTRACT_VERSION } from "@atbo/mf-kit/contract";
import type { MicrofrontendModule } from "@atbo/mf-kit/contract";

import { DemoHomePage } from "./pages/DemoHomePage";
import { DemoDetailPage } from "./pages/DemoDetailPage";
import { DemoNewPage } from "./pages/DemoNewPage";
import { demoApi } from "./store/demoApi";
import { DEMO_REDUCER_PATH, demoSlice } from "./store/demoSlice";

import "./styles.css";

/**
 * Rutas RELATIVAS al basePath que el host reservó para este microfrontend
 * (`/demo`). El host las monta con `useRoutes()` dentro de
 * `<Route path="demo/*">`.
 */
const routes: RouteObject[] = [
  { index: true, element: <DemoHomePage /> },
  { path: "nuevo", element: <DemoNewPage /> },
  { path: "detalle/:id", element: <DemoDetailPage /> },
  { path: "*", element: <Navigate to="." replace /> },
];

/**
 * Contrato con el host (`@atbo/mf-kit/contract`).
 * `register()` corre una sola vez, antes del primer render de las rutas.
 */
const module: MicrofrontendModule = {
  // Sella la versión del kit con la que se compiló: el host la valida al cargar
  // el módulo y corta con un error claro si host y remote se desincronizan.
  contractVersion: CONTRACT_VERSION,
  routes,
  register: ({ injectReducer, injectApi }) => {
    injectReducer(DEMO_REDUCER_PATH, demoSlice.reducer);
    injectApi(demoApi);
  },
};

export default module;
