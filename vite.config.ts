import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { federation } from "@module-federation/vite";

import { MF_BUILD_TARGET, sharedDependencies } from "@atbo/mf-kit/shared";

const PORT = 5176;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  /**
   * URL del host del que se consume el core.
   *
   * En local: el host en :5173.
   * En CI o si no quieres levantar el host: apunta a un entorno desplegado.
   *   VITE_HOST_ENTRY=https://dev-web-bo.apuestatotal.dev/remoteEntry.js pnpm dev
   */
  const hostEntry = env.VITE_HOST_ENTRY || "http://localhost:5173/remoteEntry.js";

  return {
    plugins: [
      federation({
        // Debe coincidir con `remoteName` en el registro del host.
        name: "mfDemo",
        filename: "remoteEntry.js",
        // Único contrato con el host: routes + register.
        exposes: {
          "./module": "./src/module.tsx",
        },
        // El host publica el core (store, UI, layout, sesión).
        remotes: {
          host: {
            type: "module",
            name: "host",
            entry: hostEntry,
            entryGlobalName: "host",
            shareScope: "default",
          },
        },
        // Viene de @atbo/mf-kit: host y remotes DEBEN declarar lo mismo.
        shared: sharedDependencies,
        // Adjunta el CSS del remote a los módulos expuestos: sin esto, en build
        // de producción el módulo se cargaría en el host sin sus estilos.
        bundleAllCSS: true,
        dts: false,
      }),
      react(),
      tailwindcss(),
    ],
    build: {
      target: MF_BUILD_TARGET,
    },
    server: {
      port: PORT,
      // El host carga /remoteEntry.js desde otro origen.
      cors: true,
      // En dev el manifiesto referencia los chunks de ESTE servidor: sin un
      // origen absoluto, el host los pediría a su propio dominio y fallarían.
      origin: `http://localhost:${PORT}`,
    },
    preview: {
      port: PORT,
      cors: true,
    },
  };
});
