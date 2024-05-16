import { combineReducers, configureStore } from "@reduxjs/toolkit";
import type { Action, ConfigureStoreOptions, Middleware, Reducer, ThunkAction } from "@reduxjs/toolkit";
// import { createWrapper } from "next-redux-wrapper";

import { baseApi } from "@/core/api/api";
import userSlice from "./userSlice";
import sidebarSlice from "./sidebarSlice";
import toastSlice, { setToast } from "./toastSlice";
// import templatesSlice from "./templatesSlice";
// import filterSlice from "./filtersSlice";
// import profileSlice from "./profileSlice";
// import executionsSlice from "./executionsSlice";
// import chatSlice from "./chatSlice";
// import builderSlice from "./builderSlice";
// import documentsSlice from "./documentsSlice";

import type {
  IBuilderSliceState,
  IChatSliceState,
  IDocumentSliceState,
  IExecutionsSliceState,
  IFilterSliceState,
  IProfileSliceState,
  ISidebarSliceState,
  ITemplateSliceState,
  IToastSliceState,
  IUserSliceState,
} from "./types";

export type RootState = {
  builder?: IBuilderSliceState;
  chat?: IChatSliceState;
  documents?: IDocumentSliceState;
  executions?: IExecutionsSliceState;
  filters?: IFilterSliceState;
  profile?: IProfileSliceState;
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
  [baseApi.reducerPath]: Reducer;
  // [key in SlicesKeys]?: Reducer;
};

const staticReducers: StaticReducers = {
  user: userSlice,
  sidebar: sidebarSlice,
  toast: toastSlice,
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
// export const store = (options?: ConfigureStoreOptions["preloadedState"] | undefined) => {
const store = configureStore({
  reducer: createRootReducer(),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware, apiResponseMiddleware),
});

type StoreWithAsyncReducers = typeof store & {
  asyncReducers: AsyncReducers;
  injectReducer: (key: SlicesKeys, asyncReducer: Reducer) => void;
  injectReducers: (asyncReducers: { key: SlicesKeys; asyncReducer: Reducer }[]) => void;
};

(store as StoreWithAsyncReducers).asyncReducers = {};

(store as StoreWithAsyncReducers).injectReducer = (key: SlicesKeys, asyncReducer: Reducer) => {
  (store as StoreWithAsyncReducers).asyncReducers[key] = asyncReducer;

  store.replaceReducer(createRootReducer((store as StoreWithAsyncReducers).asyncReducers));
};

(store as StoreWithAsyncReducers).injectReducers = (asyncReducers: { key: SlicesKeys; asyncReducer: Reducer }[]) => {
  asyncReducers.forEach(({ key, asyncReducer }) => {
    (store as StoreWithAsyncReducers).asyncReducers[key] = asyncReducer;
  });

  store.replaceReducer(createRootReducer((store as StoreWithAsyncReducers).asyncReducers));
};

const finalStore = store as StoreWithAsyncReducers;
// }

// export type AppDispatch = typeof finalStore.dispatch;

// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// type Store = ReturnType<typeof store>;
// type StoreWithAsyncReducers = Store & {
//   asyncReducers: AsyncReducers;
//   injectReducer: (key: SlicesKeys, asyncReducer: Reducer) => void;
// };

export type AppDispatch = StoreWithAsyncReducers["dispatch"];

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export default finalStore;
// export const wrapper = createWrapper(store);
