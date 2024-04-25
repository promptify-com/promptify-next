import { Action, ConfigureStoreOptions, Middleware, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { baseApi } from "@/core/api/api";
import { templatesSlice } from "./templatesSlice";
import filterSlice from "./filtersSlice";
import sidebarSlice from "./sidebarSlice";
import profileSlice from "./profileSlice";
import userSlice from "./userSlice";
import executionsSlice from "./executionsSlice";
import chatSlice from "./chatSlice";
import builderSlice from "./builderSlice";
import toastSlice, { setToast } from "./toastSlice";
import documentsSlice from "./documentsSlice";

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
      builder: builderSlice,
      toast: toastSlice,
      documents: documentsSlice,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(baseApi.middleware, apiResponseMiddleware),
    ...options,
  });

const apiResponseMiddleware: Middleware =
  ({ dispatch }) =>
  next =>
  action => {
    const errorPayload = action.payload;
    if (errorPayload?.data?.retryRequestError) {
      dispatch(
        setToast({
          message: errorPayload.data.message,
          severity: "error",
          position: { vertical: "bottom", horizontal: "right" },
          duration: 1000,
        }),
      );
    }

    return next(action);
  };

type Store = ReturnType<typeof store>;

export type AppDispatch = Store["dispatch"];
export type RootState = ReturnType<Store["getState"]>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const wrapper = createWrapper(store);
