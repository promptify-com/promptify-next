import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import type { IPromptInput } from "@/common/types/prompt";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import { IWorkflow } from "@/components/Automation/types";
import Credentials from "@/components/Prompt/Common/Chat/Inputs/Credentials";

interface Props {
  workflow: IWorkflow;
}

function CredentialsContainer({ workflow }: Props) {
  const [localInputs, setLocalInputs] = useState<IPromptInput[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { extractCredentialsInputFromNodes } = useCredentials();

  const prepareCredential = async () => {
    const credentialsInput = await extractCredentialsInputFromNodes(workflow.data.nodes);

    const timer = setTimeout(() => {
      const credentialsInputs: IPromptInput[] = credentialsInput.map(credential => ({
        name: credential.name,
        fullName: credential.displayName,
        type: "credentials",
        required: true,
      }));

      setLocalInputs(credentialsInputs);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    prepareCredential();
  }, [workflow]);

  return (
    <Stack
      gap={1}
      py={"8px"}
    >
      {localInputs.map(input => (
        <Stack key={input.name}>
          <Credentials input={input} />
        </Stack>
      ))}
    </Stack>
  );
}

export default CredentialsContainer;
