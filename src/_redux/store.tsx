import { configureStore, Reducer } from "@reduxjs/toolkit";
// Reducers
import createRootReducer, { AsyncReducers } from "./reducers";
// Query
import { apiResponseMiddleware, baseApi } from "./query";

// Define an extended store type with `asyncReducers` and `injectReducer`
interface AppStoreWithReducers extends ReturnType<typeof configureStore> {
  asyncReducers: AsyncReducers;
  injectReducer: (key: keyof AsyncReducers, asyncReducer: Reducer) => void;
}

// Store configuration
export const makeStore = (): AppStoreWithReducers => {
  const asyncReducers: AsyncReducers = {};

  const store = configureStore({
    reducer: createRootReducer(asyncReducers),
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(baseApi.middleware, apiResponseMiddleware),
  }) as AppStoreWithReducers;

  // Add the asyncReducers and injectReducer methods to the store
  store.asyncReducers = asyncReducers;

  store.injectReducer = (key: keyof AsyncReducers, asyncReducer: Reducer) => {
    if (!store.asyncReducers[key]) {
      store.asyncReducers[key] = asyncReducer;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      store.replaceReducer(createRootReducer(store.asyncReducers));
    }
  };

  return store;
};

// Infer the type of makeStore
export const store = makeStore();

// Get the type of our store variable
export type AppStore = typeof store;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];
