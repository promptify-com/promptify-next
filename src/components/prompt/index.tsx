import { Dispatch, SetStateAction } from "react";
import TemplateVariantB from "./VariantB";
import type { Templates } from "@/core/api/dto/templates";

interface Props {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  questionPrefixContent: string;
}

function TemplatePage({ template, setErrorMessage, questionPrefixContent }: Props) {
  const activeVariant: string = "b";
  return activeVariant === "b" ? (
    <TemplateVariantB
      template={template}
      setErrorMessage={setErrorMessage}
      questionPrefixContent={questionPrefixContent}
    />
  ) : null;
}

export default TemplatePage;
