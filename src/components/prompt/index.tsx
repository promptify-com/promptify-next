import { Dispatch, SetStateAction } from "react";
import type { Templates } from "@/core/api/dto/templates";
import TemplateVariantB from "./variant_b";

interface Props {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  questionPrefixContent: string;
}

function TemplatePage({ template, setErrorMessage, questionPrefixContent }: Props) {
  const activeVariant: "a" | "b" = "b";
  return activeVariant === "b" ? (
    <TemplateVariantB
      template={template}
      setErrorMessage={setErrorMessage}
      questionPrefixContent={questionPrefixContent}
    />
  ) : null;
}

export default TemplatePage;
