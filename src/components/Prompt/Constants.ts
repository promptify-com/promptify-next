import type { IToastSliceState } from "@/core/store/types";

export const EXECUTE_ERROR_TOAST: Omit<IToastSliceState, "open"> = {
  message: "Something went wrong, we could not generate what you asked, please try again.",
  severity: "error",
  duration: 6000,
  position: { vertical: "bottom", horizontal: "right" },
};
