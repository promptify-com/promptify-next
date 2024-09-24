import { combineReducers } from "@reduxjs/toolkit";
//
import remove_dialog_Reducer, { IRemoveDialogSliceState } from "./RemoveDialogSlice";

export interface ILayoutSliceState {
  remove_dialog: IRemoveDialogSliceState;
}

export default combineReducers({
  remove_dialog: remove_dialog_Reducer,
});
