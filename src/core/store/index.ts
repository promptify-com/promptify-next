import { Action, ConfigureStoreOptions, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

import { baseApi } from "../api/api";
import { templatesSlice } from "./templatesSlice";
import filterSlice from "./filtersSlice";
import sidebarSlice from "./sidebarSlice";
import profileSlice from "./profileSlice";
import userSlice from "./userSlice";
import executionsSlice from "./executionsSlice";
import chatSlice from "./chatSlice";

export interface State {
  tick: string;
}

export const store = (options?: ConfigureStoreOptions["preloadedState"] | undefined) =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      template: templatesSlice.reducer,
      filters: filterSlice,
      sidebar: sidebarSlice,
      profile: profileSlice,
      user: userSlice,
      executions: executionsSlice,
      chat: chatSlice,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(baseApi.middleware),
    ...options,
  });

type Store = ReturnType<typeof store>;

export type AppDispatch = Store["dispatch"];
export type RootState = ReturnType<Store["getState"]>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const wrapper = createWrapper(store);
