import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
export interface IToastSliceState {
  open: boolean;
  message: string;
  severity: "error" | "warning" | "info" | "success";
  duration?: number;
  position?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
}
//
const initialState: IToastSliceState = {
  open: false,
  message: "",
  severity: "info",
  duration: 6000,
  position: {
    vertical: "top",
    horizontal: "center",
  },
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    setToast: (state, action: PayloadAction<Omit<IToastSliceState, "open">>) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
      state.duration = action.payload.duration ?? initialState.duration;
      state.position = action.payload.position ?? initialState.position;
    },
    clearToast: state => {
      state.open = false;
    },
  },
});

export const { setToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;
