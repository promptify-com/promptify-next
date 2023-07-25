import { configureStore } from "@reduxjs/toolkit";
import { promptsApi } from "../api/prompts";
import { explorerApi } from "../api/explorer";
import { userApi } from "../api/user";
import { templatesSlice } from "./templatesSlice";
import filterSlice from "./filtersSlice";
import { CategoriesApi } from "../api/categories";

export const store = configureStore({
  reducer: {
    [promptsApi.reducerPath]: promptsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [explorerApi.reducerPath]: explorerApi.reducer,
    [CategoriesApi.reducerPath]: CategoriesApi.reducer,
    template: templatesSlice.reducer,
    filters: filterSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      promptsApi.middleware,
      CategoriesApi.middleware,
      userApi.middleware,
      explorerApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
