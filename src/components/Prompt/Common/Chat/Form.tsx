import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Fade from "@mui/material/Fade";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";
import FormParam from "@/components/Prompt/Common/Chat/FormParams";
import FormInput from "@/components/Prompt/Common/Chat/FormInput";
import useVariant from "@/components/Prompt/Hooks/useVariant";
import FormInputPlaceholder from "@/components/placeholders/FormInputPlaceholder";
import type { IPromptInput } from "@/common/types/prompt";
import type { MessageType } from "@/components/Prompt/Types/chat";

interface FormProps {
  onScrollToBottom?: () => void;
  messageType?: MessageType;
}

interface FormLayoutProps {
  messageType?: MessageType;
  variant: "a" | "b";
}

function FormFields({ variant, messageType }: FormLayoutProps) {
  const { params, inputs, credentialsInput } = useAppSelector(state => state.chat);
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

  if (isLoading && variant === "b") {
    return <FormInputPlaceholder />;
  }

  return (
    <Stack gap={variant === "b" ? 1 : 2}>
      {localInputs.map((input, index) => (
        <FormInput
          key={index}
          input={input}
        />
      ))}
      {params?.map(param => (
        <FormParam
          key={param.parameter.id}
          param={param}
        />
      ))}
    </Stack>
  );
}

function Form({ onScrollToBottom, messageType }: FormProps) {
  const dispatch = useAppDispatch();
  const { isVariantB } = useVariant();

  return (
    <Stack>
      {isVariantB ? (
        <FormFields
          variant={"b"}
          messageType={messageType}
        />
      ) : (
        <Fade
          in={true}
          onTransitionEnd={() => dispatch(setIsSimulationStreaming(false))}
          addEndListener={onScrollToBottom}
        >
          <Stack>
            <FormFields
              variant={"a"}
              messageType={messageType}
            />
          </Stack>
        </Fade>
      )}
    </Stack>
  );
}

export default Form;
