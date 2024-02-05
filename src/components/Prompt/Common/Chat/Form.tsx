import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Fade from "@mui/material/Fade";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";
import FormParam from "@/components/Prompt/Common/Chat/FormParams";
import FormInput from "@/components/Prompt/Common/Chat/FormInput";
import useVariant from "@/components/Prompt/Hooks/useVariant";
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
  const { params, inputs, credentials } = useAppSelector(state => state.chat);

  const [localInputs, setLocalInputs] = useState<IPromptInput[]>([]);

  useEffect(() => {
    const transformedInputs: IPromptInput[] = credentials.map(credential => ({
      name: credential.name,
      fullName: credential.displayName,
      type: "credentials",
      required: true,
    }));

    setLocalInputs(messageType === "credentials" ? transformedInputs : inputs);
  }, []);

  return (
    <Stack gap={variant === "b" ? 1 : 2}>
      {localInputs.map((input, index) => {
        return (
          <FormInput
            key={index}
            input={input}
          />
        );
      })}

      {params?.map(param => {
        return (
          <FormParam
            key={param.parameter.id}
            param={param}
          />
        );
      })}
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
