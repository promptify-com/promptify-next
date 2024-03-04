import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";

import { useAppSelector } from "@/hooks/useStore";
import FormParam from "@/components/Prompt/Common/Chat/FormParams";
import FormInput from "@/components/Prompt/Common/Chat/FormInput";
import FormInputPlaceholder from "@/components/placeholders/FormInputPlaceholder";
import type { IPromptInput } from "@/common/types/prompt";
import type { MessageType } from "@/components/Prompt/Types/chat";

interface FormProps {
  messageType?: MessageType;
}

interface FormLayoutProps {
  messageType?: MessageType;
}

function FormFields({ messageType }: FormLayoutProps) {
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

  if (isLoading) {
    return <FormInputPlaceholder />;
  }

  return (
    <Stack gap={1}>
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

function Form({ messageType }: FormProps) {
  return (
    <Stack>
      <FormFields messageType={messageType} />
    </Stack>
  );
}

export default Form;
