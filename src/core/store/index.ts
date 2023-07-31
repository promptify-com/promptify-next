import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { promptsApi } from "../api/prompts";
import { explorerApi } from "../api/explorer";
import { userApi } from "../api/user";
import { templatesSlice } from "./templatesSlice";
import filterSlice from "./filtersSlice";
import { CategoriesApi } from "../api/categories";
import sidebarSlice from "./sidebarSlice";
import { sparksApi } from "../api/sparks";
import { createWrapper } from "next-redux-wrapper";

export interface State {
  tick: string;
}

export const store = () =>
  configureStore({
    reducer: {
      [promptsApi.reducerPath]: promptsApi.reducer,
      [sparksApi.reducerPath]: sparksApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [explorerApi.reducerPath]: explorerApi.reducer,
      [CategoriesApi.reducerPath]: CategoriesApi.reducer,
      template: templatesSlice.reducer,
      filters: filterSlice,
      sidebar: sidebarSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        promptsApi.middleware,
        sparksApi.middleware,
        CategoriesApi.middleware,
        userApi.middleware,
        explorerApi.middleware
      ),
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
