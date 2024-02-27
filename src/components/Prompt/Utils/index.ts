import { ToastState } from "@/core/store/toastSlice";

export const isImageOutput = (output: string, engineType: "TEXT" | "IMAGE"): boolean => {
  try {
    const imgURL = new URL(output);
    const IsImage = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"].some(extension =>
      imgURL.pathname.endsWith(extension),
    );

    return IsImage || engineType === "IMAGE";
  } catch {
    return false;
  }
};

export const executeErrorToast: Omit<ToastState, "open"> = {
  message: "Something went wrong, we could not generate what you asked, please try again.",
  severity: "error",
  duration: 6000,
  position: { vertical: "bottom", horizontal: "right" },
};
