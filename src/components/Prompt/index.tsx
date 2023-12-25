import { Dispatch, SetStateAction } from "react";

import TempalteLayout from "@/components/Prompt/TemplateLayout";
import type { Templates } from "@/core/api/dto/templates";
import useVariant from "./Hooks/useVariant";

interface Props {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  questionPrefixContent: string;
}

function TemplatePage({ template, setErrorMessage, questionPrefixContent }: Props) {
  const { variant } = useVariant();

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
