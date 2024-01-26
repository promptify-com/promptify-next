import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ToastState {
  open: boolean;
  message: string;
  severity: "error" | "warning" | "info" | "success";
}

const initialState: ToastState = {
  open: false,
  message: "",
  severity: "info",
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    setToast: (state, action: PayloadAction<Omit<ToastState, "open">>) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
    clearToast: state => {
      state.open = false;
      state.message = "";
      state.severity = "info";
    },
  },
});

export const { setToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;
