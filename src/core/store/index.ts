import {
  Action,
  ConfigureStoreOptions,
  ThunkAction,
  configureStore,
} from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

import { templatesSlice } from "./templatesSlice";
import filterSlice from "./filtersSlice";
import sidebarSlice from "./sidebarSlice";
import { globalApi } from "../api/api";

export interface State {
  tick: string;
}

export const store = (
  options?: ConfigureStoreOptions["preloadedState"] | undefined
) =>
  configureStore({
    reducer: {
      [globalApi.reducerPath]: globalApi.reducer,

      template: templatesSlice.reducer,
      filters: filterSlice,
      sidebar: sidebarSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(globalApi.middleware),
    ...options,
  });

type Store = ReturnType<typeof store>;

export type AppDispatch = Store["dispatch"];
export type RootState = ReturnType<Store["getState"]>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper(store);
