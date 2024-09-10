import { combineReducers } from "@reduxjs/toolkit";
//
import sidebarReducer, { ISidebarSliceState } from "./sidebar";

// Types
export interface ILayoutSliceState {
  sidebar: ISidebarSliceState;
}

export default combineReducers({
  sidebar: sidebarReducer,
});
