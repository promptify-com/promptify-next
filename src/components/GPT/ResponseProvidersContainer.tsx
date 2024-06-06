import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { PROMPTIFY_NODE_TYPE, PROVIDERS } from "./Constants";
import ResponseProvider from "./ResponseProvider";
import type { ITemplateWorkflow, IWorkflowCreateResponse } from "@/components/Automation/types";
import type { ProviderType } from "./Types";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import { useAppSelector } from "@/hooks/useStore";

interface Props {
  message: string;
  workflow: ITemplateWorkflow;
  prepareWorkflow(provider: ProviderType, workflow: IWorkflowCreateResponse): void;
  removeProvider(provider: ProviderType): IWorkflowCreateResponse;
}

function ResponseProvidersContainer({ message, workflow, prepareWorkflow, removeProvider }: Props) {
  const clonedWorkflow = useAppSelector(store => store.chat?.clonedWorkflow ?? initialChatState.clonedWorkflow);
  const isTest = clonedWorkflow?.schedule?.frequency === "Test GPT";

  const providers = Object.keys(PROVIDERS).filter(p => isTest || p !== PROMPTIFY_NODE_TYPE);

  return (
    <Stack gap={4}>
      {message && (
        <Typography
          fontSize={16}
          fontWeight={500}
          color={"common.black"}
        >
          {message}
        </Typography>
      )}
      <Grid
        container
        spacing={2}
      >
        {providers.map(provider => {
          const providerType = provider as ProviderType;
          return (
            <Grid
              item
              xs={12}
              md={6}
              key={provider}
            >
              <ResponseProvider
                providerType={providerType}
                workflow={workflow}
                onInject={workflow => prepareWorkflow(providerType, workflow)}
                onUnselect={removeProvider}
              />
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
}

export default ResponseProvidersContainer;
