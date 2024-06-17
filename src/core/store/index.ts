import { combineReducers, configureStore } from "@reduxjs/toolkit";
import type { Action, Middleware, Reducer, ThunkAction } from "@reduxjs/toolkit";
import { baseApi } from "@/core/api/api";
import userSlice from "./userSlice";
import sidebarSlice from "./sidebarSlice";
import toastSlice, { setToast } from "./toastSlice";
import chatSlice from "./chatSlice";

import type {
  IBuilderSliceState,
  IChatSliceState,
  IDocumentSliceState,
  IExecutionsSliceState,
  ISidebarSliceState,
  ITemplateSliceState,
  IToastSliceState,
  IUserSliceState,
} from "./types";
import RetryRequestError from "../api/errors/RetryRequestError";

export type RootState = {
  builder?: IBuilderSliceState;
  chat?: IChatSliceState;
  documents?: IDocumentSliceState;
  executions?: IExecutionsSliceState;
  templates?: ITemplateSliceState;
  sidebar: ISidebarSliceState;
  toast: IToastSliceState;
  user: IUserSliceState;
  [baseApi.reducerPath]: ReturnType<typeof baseApi.reducer>;
};

type SlicesKeys = keyof RootState;

type AsyncReducers = {
  [key in SlicesKeys]?: Reducer;
};

type StaticReducers = {
  user: Reducer<IUserSliceState>;
  toast: Reducer<IToastSliceState>;
  sidebar: Reducer<ISidebarSliceState>;
  chat: Reducer<IChatSliceState>;
  [baseApi.reducerPath]: Reducer;
};

const staticReducers: StaticReducers = {
  user: userSlice,
  sidebar: sidebarSlice,
  toast: toastSlice,
  chat: chatSlice,
  [baseApi.reducerPath]: baseApi.reducer,
};

const createRootReducer = (asyncReducers: AsyncReducers = {}) =>
  combineReducers({
    ...staticReducers,
    ...asyncReducers,
  }) as Reducer<RootState>;

const apiResponseMiddleware: Middleware =
  ({ dispatch }) =>
  next =>
  action => {
    const errorPayload = (action as { payload: { data: { retryRequestError: RetryRequestError; message: string } } })
      .payload;
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

const store = configureStore({
  reducer: createRootReducer(),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware, apiResponseMiddleware),
});

type StoreWithAsyncReducers = typeof store & {
  asyncReducers: AsyncReducers;
  injectReducers: (asyncReducers: { key: SlicesKeys; asyncReducer: Reducer }[]) => void;
};

(store as StoreWithAsyncReducers).asyncReducers = {};

(store as StoreWithAsyncReducers).injectReducers = (asyncReducers: { key: SlicesKeys; asyncReducer: Reducer }[]) => {
  let reducersInserted = false;

  asyncReducers.forEach(({ key, asyncReducer }) => {
    if ((store as StoreWithAsyncReducers).asyncReducers[key]) {
      return;
    }

    (store as StoreWithAsyncReducers).asyncReducers[key] = asyncReducer;
    reducersInserted = true;
  });

  if (!reducersInserted) {
    return;
  }

  store.replaceReducer(createRootReducer((store as StoreWithAsyncReducers).asyncReducers));
};

const finalStore = store as StoreWithAsyncReducers;

export type AppDispatch = StoreWithAsyncReducers["dispatch"];

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export default finalStore;
