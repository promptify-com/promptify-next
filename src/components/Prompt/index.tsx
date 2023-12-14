import { Dispatch, SetStateAction, useEffect } from "react";
import { useRouter } from "next/router";

import { getCookie, setCookie } from "@/common/helpers/cookies";
import TempalteLayout from "@/components/Prompt/TemplateLayout";
import type { Templates } from "@/core/api/dto/templates";

interface Props {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  questionPrefixContent: string;
}

function TemplatePage({ template, setErrorMessage, questionPrefixContent }: Props) {
  const router = useRouter();

  let variant = (router.query.variant as string) ?? getCookie("variant");
  if (!variant) {
    variant = Math.random() < 0.5 ? "a" : "b";
  }

  useEffect(() => {
    setCookie("variant", variant, 30);

    if (router.query.variant !== variant) {
      router.replace({ pathname: router.pathname, query: { ...router.query, variant } }, undefined, { shallow: true });
    }
  }, [variant, router]);

  return (
    <TempalteLayout
      variant={variant}
      template={template}
      questionPrefixContent={questionPrefixContent}
      setErrorMessage={setErrorMessage}
    />
  );
}

export default TemplatePage;
