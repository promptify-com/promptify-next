import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";

import TempalteLayout from "@/components/Prompt/TemplateLayout";
import type { Templates } from "@/core/api/dto/templates";
import Cookie from "@/common/helpers/cookies";
import { useAppDispatch } from "@/hooks/useStore";
import { setActiveToolbarLink } from "@/core/store/templatesSlice";
import { setAnswers } from "@/core/store/chatSlice";
import { setGeneratedExecution, setSelectedExecution } from "@/core/store/executionsSlice";

interface Props {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  questionPrefixContent: string;
}

function TemplatePage({ template, setErrorMessage, questionPrefixContent }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [activeVariant, setActiveVariant] = useState<string>("");

  const clearStoredStates = () => {
    dispatch(setActiveToolbarLink(null));
    dispatch(setAnswers([]));
    dispatch(setSelectedExecution(null));
    dispatch(setGeneratedExecution(null));
  };

  useEffect(() => {
    let variant = (router.query.variant as string) ?? Cookie.get("variant");
    if (!variant) {
      variant = Math.random() < 0.5 ? "a" : ("b" as string);
    }

    setActiveVariant(variant);
    Cookie.set("variant", variant, 30);
    clearStoredStates();

    if (router.query.variant !== variant) {
      router.replace({ pathname: router.pathname, query: { ...router.query, variant } }, undefined, { shallow: true });
    }
  }, [router]);

  return (
    <TempalteLayout
      variant={activeVariant}
      template={template}
      questionPrefixContent={questionPrefixContent}
      setErrorMessage={setErrorMessage}
    />
  );
}

export default TemplatePage;
