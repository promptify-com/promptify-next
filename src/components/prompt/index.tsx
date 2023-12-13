import { Dispatch, SetStateAction } from "react";
import TemplateVariantB from "./VariantB";
import type { Templates } from "@/core/api/dto/templates";
import TemplateVariantA from "./VariantA";

interface Props {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  questionPrefixContent: string;
}

function TemplatePage({ template, setErrorMessage, questionPrefixContent }: Props) {
  const activeVariant: string = "a";
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
