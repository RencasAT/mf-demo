import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * Estado propio del microfrontend.
 *
 * El host no lo conoce en build-time: se inyecta en `register()` bajo la clave
 * `mfDemo`, y no existe en el árbol si el módulo nunca se abre.
 */
export const DEMO_REDUCER_PATH = "mfDemo";

interface DemoState {
  search: string;
}

const initialState: DemoState = {
  search: "",
};

export const demoSlice = createSlice({
  name: DEMO_REDUCER_PATH,
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const demoActions = demoSlice.actions;

/** Selector defensivo: el slice puede no estar inyectado todavía. */
export const selectDemoState = (state: unknown): DemoState =>
  (state as Record<string, DemoState>)?.[DEMO_REDUCER_PATH] ?? initialState;
