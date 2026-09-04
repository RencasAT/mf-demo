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

/** Lo que aporta quien crea el registro; el resto lo pone el endpoint. */
export type NewDemoItem = Pick<DemoItem, "title" | "description">;

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

let nextId = ITEMS.length + 1;

/** Mismo formato que trae `ITEMS`, para que el listado se vea homogéneo. */
const now = () => {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
};

export const demoApi = createApi({
  reducerPath: "mfDemoApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["DemoItem"],
  endpoints: (builder) => ({
    getDemoItems: builder.query<DemoItem[], void>({
      // Copia, no la referencia: al mutar ITEMS en sitio, un mismo array no
      // dispararía el re-render de quien lee la query.
      queryFn: async () => ({ data: [...ITEMS] }),
      providesTags: ["DemoItem"],
    }),
    getDemoItem: builder.query<DemoItem | undefined, string>({
      queryFn: async (id) => ({ data: ITEMS.find((item) => item.id === id) }),
      providesTags: (_result, _error, id) => [{ type: "DemoItem", id }],
    }),
    createDemoItem: builder.mutation<DemoItem, NewDemoItem>({
      queryFn: async ({ title, description }) => {
        const item: DemoItem = {
          id: `demo-${nextId++}`,
          title,
          description,
          updatedAt: now(),
        };

        ITEMS.unshift(item);

        return { data: item };
      },
      // Invalida el listado: al volver a /demo el registro nuevo ya está.
      invalidatesTags: ["DemoItem"],
    }),
  }),
});

export const { useGetDemoItemsQuery, useGetDemoItemQuery, useCreateDemoItemMutation } = demoApi;
