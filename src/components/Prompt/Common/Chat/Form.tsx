import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppSelector } from "@/hooks/useStore";
import FormParam from "@/components/Prompt/Common/Chat/FormParam";
import FormInput from "@/components/Prompt/Common/Chat/FormInput";
import FormInputPlaceholder from "@/components/placeholders/FormInputPlaceholder";
import type { IPromptInput } from "@/common/types/prompt";
import type { MessageType } from "@/components/Prompt/Types/chat";
import type { Templates } from "@/core/api/dto/templates";
import { initialState as initialChatState } from "@/core/store/chatSlice";

interface FormProps {
  messageType?: MessageType;
  template?: Templates;
  onScrollToBottom?: () => void;
}

interface FormLayoutProps {
  template?: Templates;
  messageType?: MessageType;
}

function FormFields({ messageType, template }: FormLayoutProps) {
  const { params, inputs, credentialsInput } = useAppSelector(state => state.chat ?? initialChatState);
  const [localInputs, setLocalInputs] = useState<IPromptInput[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const transformedInputs: IPromptInput[] = credentialsInput.map(credential => ({
        name: credential.name,
        fullName: credential.displayName,
        type: "credentials",
        required: true,
      }));

      setLocalInputs(messageType === "credentials" ? transformedInputs : inputs);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [credentialsInput, inputs, messageType]);

  if (isLoading) {
    return <FormInputPlaceholder />;
  }

  let lastPromptId: number;

  return (
    <Stack
      gap={1}
      py={"8px"}
    >
      {localInputs.map((input, index) => {
        const currentPrompt = template?.prompts.find(prompt => prompt.id === input.prompt);
        const shouldDisplayTitleAndEngine = lastPromptId !== input.prompt;
        lastPromptId = input.prompt!;
        return (
          <Stack key={index}>
            {shouldDisplayTitleAndEngine && (
              <Stack
                px={{ xs: "16px", md: "24px" }}
                py={"16px"}
                direction={"row"}
                gap={1}
              >
                <Typography
                  fontSize={16}
                  lineHeight={"22px"}
                >
                  {currentPrompt?.title}
                </Typography>
                <Typography color={"text.secondary"}>{currentPrompt?.engine.name}</Typography>
              </Stack>
            )}

            <FormInput input={input} />
          </Stack>
        );
      })}
      {!!params.length && (
        <Stack
          px={{ xs: "16px", md: "24px" }}
          py={"16px"}
          direction={"column"}
          gap={1}
        >
          <Typography
            fontSize={16}
            lineHeight={"22px"}
          >
            Contextual parameters:
          </Typography>
        </Stack>
      )}

      {params?.map(param => (
        <FormParam
          key={param.parameter.id}
          param={param}
          variant="slider"
        />
      ))}
    </Stack>
  );
}

function Form({ messageType, template }: FormProps) {
  return (
    <Stack>
      <FormFields
        messageType={messageType}
        template={template}
      />
    </Stack>
  );
}

export default Form;
