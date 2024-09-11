import { combineReducers } from "@reduxjs/toolkit";
//
import sidebarReducer, { ISidebarSliceState } from "./sidebar";
import searchReducer, { ISearchSliceState } from "./search";

// Types
export interface ILayoutSliceState {
  sidebar: ISidebarSliceState;
  search: ISearchSliceState;
}

export default combineReducers({
  sidebar: sidebarReducer,
  search: searchReducer,
});
