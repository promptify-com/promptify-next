import { useRouter } from "next/router";

import Cookie from "@/common/helpers/cookies";
import { setAnswers } from "@/core/store/chatSlice";
import { setGeneratedExecution, setSelectedExecution } from "@/core/store/executionsSlice";
import { setActiveToolbarLink } from "@/core/store/templatesSlice";
import { useAppDispatch } from "@/hooks/useStore";

const useVariant = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const variant = router.query.variant;

  const isVariantB = variant === "b";
  const isVariantA = variant === "a";

  const clearStoredStates = () => {
    dispatch(setActiveToolbarLink(null));
    dispatch(setAnswers([]));
    dispatch(setSelectedExecution(null));
    dispatch(setGeneratedExecution(null));
  };

  const switchVariant = () => {
    const newVariant = variant === "a" ? "b" : "a";
    Cookie.set("variant", newVariant, 30);

    clearStoredStates();

    router.replace({ pathname: router.pathname, query: { ...router.query, variant: newVariant } }, undefined, {
      shallow: true,
    });
  };
  return { switchVariant, variant, isVariantA, isVariantB };
};

export default useVariant;
