import { Middleware } from "@reduxjs/toolkit";
// Api Utils
import RetryRequestError from "@/core/api/errors/RetryRequestError";
import { setToast } from "@/core/store/toastSlice";
import { baseApi } from "@/core/api/api";

// Middleware
export const apiResponseMiddleware: Middleware =
  ({ dispatch }) =>
  next =>
  action => {
    const errorPayload = (action as { payload: { data: { retryRequestError: RetryRequestError; message: string } } })
      .payload;
    if (errorPayload?.data?.retryRequestError) {
      dispatch(
        setToast({
          message: errorPayload.data.message,
          severity: "error",
          position: { vertical: "bottom", horizontal: "right" },
          duration: 1000,
        }),
      );
    }

    return next(action);
  };

export { baseApi };
