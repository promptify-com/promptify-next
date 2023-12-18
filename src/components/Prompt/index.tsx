import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";

import TempalteLayout from "@/components/Prompt/TemplateLayout";
import type { Templates } from "@/core/api/dto/templates";
import Cookie from "@/common/helpers/cookies";

interface Props {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  questionPrefixContent: string;
}

function TemplatePage({ template, setErrorMessage, questionPrefixContent }: Props) {
  const router = useRouter();

  const [activeVariant, setActiveVariant] = useState<string>("");

  useEffect(() => {
    let variant = (router.query.variant as string) ?? Cookie.get("variant");
    if (!variant) {
      variant = Math.random() < 0.5 ? "a" : ("b" as string);
    }

    setActiveVariant(variant);
    Cookie.set("variant", variant, 30);

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
