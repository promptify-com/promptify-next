import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";

import TempalteLayout from "@/components/Prompt/TemplateLayout";
import Cookie from "@/common/helpers/cookies";
import type { Templates } from "@/core/api/dto/templates";

interface Props {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  questionPrefixContent: string;
}

declare global {
  var gtag: (arg1: string, arg2: string, arg3: Record<string, string>) => void;
}

function TemplatePage({ template, setErrorMessage, questionPrefixContent }: Props) {
  const router = useRouter();

  const [activeVariant, setActiveVariant] = useState<string>("");

  useEffect(() => {
    const cookieVariant = Cookie.get("variant");
    let variant = cookieVariant ?? (router.query.variant as string);

    if (!variant) {
      variant = Math.random() < 0.5 ? "a" : "b";
    }

    setActiveVariant(variant);

    if (!cookieVariant) {
      sendPageViewEvent();

      Cookie.set("variant", variant, 30);
    }

    if (router.query.variant !== variant) {
      router.replace({ pathname: router.pathname, query: { ...router.query, variant } }, undefined, { shallow: true });
    }

    function sendPageViewEvent() {
      if (typeof window.gtag === "undefined") {
        const intervalID = setInterval(() => {
          if (typeof window.gtag === "function") {
            window.gtag("event", "pageview", { Branch: `staging-${variant}` });
            clearInterval(intervalID);
          }
        }, 1000);
      } else {
        window.gtag("event", "pageview", { Branch: `staging-${variant}` });
      }
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
