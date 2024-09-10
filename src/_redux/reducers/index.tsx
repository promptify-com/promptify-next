import { combineReducers, Reducer } from "@reduxjs/toolkit";
// Reducers
import layout_reducers, { ILayoutSliceState } from "./layout";
import userSlice, { IUserSliceState } from "./userSlice";
import sidebarSlice, { ISidebarSliceState } from "./sidebarSlice";
import toastSlice, { IToastSliceState } from "./toastSlice";
import builderSlice, { IBuilderSliceState } from "./builderSlice";
import chatSlice, { IChatSliceState } from "./chatSlice";
import documentsSlice, { IDocumentSliceState } from "./documentsSlice";
import executionsSlice, { IExecutionsSliceState } from "./executionsSlice";
import templatesSlice, { ITemplateSliceState } from "./templatesSlice";
import { baseApi } from "@/core/api/api";

// Static Types
export interface RootState {
  layout: ILayoutSliceState;
  builder?: IBuilderSliceState;
  chat?: IChatSliceState;
  documents?: IDocumentSliceState;
  executions?: IExecutionsSliceState;
  templates?: ITemplateSliceState;
  sidebar: ISidebarSliceState;
  toast: IToastSliceState;
  user: IUserSliceState;
  [baseApi.reducerPath]: ReturnType<typeof baseApi.reducer>;
}
export type AsyncReducers = Record<string, Reducer>;
export interface StaticReducers {
  layout: Reducer<ILayoutSliceState>;
  user: Reducer<IUserSliceState>;
  toast: Reducer<IToastSliceState>;
  sidebar: Reducer<ISidebarSliceState>;
  [baseApi.reducerPath]: Reducer;
}

const reducers: StaticReducers = {
  layout: layout_reducers,
  user: userSlice,
  sidebar: sidebarSlice,
  toast: toastSlice,
  [baseApi.reducerPath]: baseApi.reducer,
};

// Root Reducer
const createRootReducer = (asyncReducers: AsyncReducers = {}) =>
  combineReducers({
    ...reducers,
    ...asyncReducers,
  }) as Reducer<RootState>;

export default createRootReducer;
