import { Dispatch, SetStateAction, useEffect, useState } from "react";
import TemplateVariantB from "./VariantB";
import type { Templates } from "@/core/api/dto/templates";
import TemplateVariantA from "./VariantA";
import { useRouter } from "next/router";

import { getCookie, setCookie } from "@/common/helpers/cookies";

interface Props {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  questionPrefixContent: string;
}

function TemplatePage({ template, setErrorMessage, questionPrefixContent }: Props) {
  const router = useRouter();
  const [activeVariant, setActiveVariant] = useState<string>("");

  useEffect(() => {
    let variant = router.query.variant ?? (getCookie("variant") as string);
    if (!variant) {
      variant = Math.random() < 0.5 ? "a" : ("b" as string);
    }

    setActiveVariant(variant as string);
    setCookie("variant", variant as string, 30);

    if (router.query.variant !== variant) {
      router.replace({ pathname: router.pathname, query: { ...router.query, variant } }, undefined, { shallow: true });
    }
  }, [router]);

  return activeVariant === "b" ? (
    <TemplateVariantB
      template={template}
      setErrorMessage={setErrorMessage}
      questionPrefixContent={questionPrefixContent}
    />
  ) : (
    <TemplateVariantA
      template={template}
      questionPrefixContent={questionPrefixContent}
      setErrorMessage={setErrorMessage}
    />
  );
}

export default TemplatePage;
