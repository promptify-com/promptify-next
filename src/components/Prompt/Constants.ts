import type { ToastState } from "@/core/store/toastSlice";

export const EXECUTE_ERROR_TOAST: Omit<ToastState, "open"> = {
  message: "Something went wrong, we could not generate what you asked, please try again.",
  severity: "error",
  duration: 6000,
  position: { vertical: "bottom", horizontal: "right" },
};
