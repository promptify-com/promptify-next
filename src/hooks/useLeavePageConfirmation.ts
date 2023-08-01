import { useEffect } from "react";
import SingletonRouter, { Router } from "next/router";

const defaultConfirmationDialog = async (msg?: string) => window.confirm(msg);

export const useLeavePageConfirmation = (
  shouldPreventLeaving: boolean,
  message: string = "Changes you made may not be saved.",
  confirmationDialog: (
    msg?: string
  ) => Promise<boolean> = defaultConfirmationDialog
) => {
  useEffect(() => {
    // @ts-ignore
    if (!SingletonRouter.router?.change) {
      return;
    }

    // @ts-ignore
    const originalChangeFunction = SingletonRouter.router.change;
    const originalOnBeforeUnloadFunction = window.onbeforeunload;

    if (shouldPreventLeaving) {
      window.onbeforeunload = () => "";
    } else {
      window.onbeforeunload = originalOnBeforeUnloadFunction;
    }
    if (shouldPreventLeaving) {
      // @ts-ignore
      SingletonRouter.router.change = async (...args) => {
        const [historyMethod, , as] = args;
        // @ts-ignore because "state" is private in Next.js
        const currentUrl = SingletonRouter.router?.state.asPath.split("?")[0];
        const changedUrl = as.split("?")[0];
        const hasNavigatedAwayFromPage = currentUrl !== changedUrl;
        const wasBackOrForwardBrowserButtonClicked =
          historyMethod === "replaceState";
        let confirmed = false;

        if (hasNavigatedAwayFromPage) {
          confirmed = await confirmationDialog(message);
        }

        if (confirmed) {
          // @ts-ignore
          Router.prototype.change.apply(SingletonRouter.router, args);
        } else if (
          wasBackOrForwardBrowserButtonClicked &&
          hasNavigatedAwayFromPage
        ) {
          // @ts-ignore because "state" is private in Next.js
          await SingletonRouter.router?.push(
            // @ts-ignore
            SingletonRouter.router?.state.asPath
          );

          const browserDirection = "back";

          browserDirection === "back"
            ? history.go(1) 
            : history.go(-1);
        }
      };
    }
    return () => {
      // @ts-ignore
      SingletonRouter.router.change = originalChangeFunction;
      window.onbeforeunload = originalOnBeforeUnloadFunction;
    };
  }, [shouldPreventLeaving, message, confirmationDialog]);
};