import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * API de RTK Query propia del microfrontend.
 *
 * Se registra en el store del host desde `register()` (reducer + middleware).
 * Arranca con `fakeBaseQuery` y datos en memoria para que el esqueleto no
 * dependa de red; al conectar el backend real, sustituye por:
 *
 *   baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_DEMO_API_BASE })
 *
 * y cambia `queryFn` por `query`.
 */
export interface DemoItem {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
}

const ITEMS: DemoItem[] = [
  {
    id: "demo-1",
    title: "Primer registro",
    description: "Dato de ejemplo servido por el propio microfrontend, sin pasar por el host.",
    updatedAt: "2026-09-03 10:12",
  },
  {
    id: "demo-2",
    title: "Segundo registro",
    description: "Sustituye ITEMS por una llamada real cuando el módulo tenga backend.",
    updatedAt: "2026-09-02 17:45",
  },
];

export const demoApi = createApi({
  reducerPath: "mfDemoApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getDemoItems: builder.query<DemoItem[], void>({
      queryFn: async () => ({ data: ITEMS }),
    }),
    getDemoItem: builder.query<DemoItem | undefined, string>({
      queryFn: async (id) => ({ data: ITEMS.find((item) => item.id === id) }),
    }),
  }),
});

export const { useGetDemoItemsQuery, useGetDemoItemQuery } = demoApi;
