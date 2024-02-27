import AccordionSummary from "@mui/material/AccordionSummary";

import HeaderForm from "@/components/common/AccordionMessage/Header/HeaderForm";
import HeaderCreds from "@/components/common/AccordionMessage/Header/HeaderCreds";
import HeaderSpark from "@/components/common/AccordionMessage/Header/HeaderSpark";
import useVariant from "@/components/Prompt/Hooks/useVariant";
import type { Templates } from "@/core/api/dto/templates";
import type { IMessage, MessageType } from "@/components/Prompt/Types/chat";

interface Props {
  template: Templates;
  isExpanded: boolean;
  onCancel?: () => void;
  type: MessageType;
  messages?: IMessage[];
}

function AccordionMessageHeader({ template, type, isExpanded, onCancel, messages = [] }: Props) {
  const { isAutomationPage } = useVariant();

  const RenderAccordionSummary = () => {
    switch (type) {
      case "credentials":
        return (
          <HeaderCreds
            title="New Credentials"
            isExpanded={isExpanded}
          />
        );
      case "spark":
        return (
          <HeaderSpark
            template={template}
            isExpanded={isExpanded}
            onCancel={onCancel}
            messages={messages}
          />
        );

      default:
        return (
          <HeaderForm
            title={isAutomationPage ? "New Execution" : "New Prompt"}
            type={type}
            isExpanded={isExpanded}
          />
        );
    }
  };

  return (
    <AccordionSummary
      sx={{
        bgcolor: "surface.2",
        p: { xs: "0px 8px", md: "0px 16px" },
        borderRadius: "0px 16px 16px 16px",
      }}
    >
      <RenderAccordionSummary />
    </AccordionSummary>
  );
}

export default AccordionMessageHeader;
