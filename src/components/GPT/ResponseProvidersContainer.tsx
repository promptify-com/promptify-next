import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { PROVIDERS } from "./Constants";
import ResponseProvider from "./ResponseProvider";
import type { IWorkflow } from "@/components/Automation/types";
import type { ProviderType } from "./Types";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import { useAppSelector } from "@/hooks/useStore";
import ProviderCard from "./ProviderCard";
import { getNodeInfoByType } from "../GPTs/helpers";
import { useState } from "react";

interface Props {
  message: string;
  workflow: IWorkflow;
  prepareWorkflow(provider: ProviderType): void;
}

function ResponseProvidersContainer({ message, workflow, prepareWorkflow }: Props) {
  const clonedWorkflow = useAppSelector(store => store.chat?.clonedWorkflow ?? initialChatState.clonedWorkflow);
  const isTest = clonedWorkflow?.schedule?.frequency === "Test GPT";

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
        {Object.keys(PROVIDERS).map(provider => {
          const providerType = provider as ProviderType;
          return (
            <Grid
              item
              xs={6}
              key={provider}
            >
              <ResponseProvider
                providerType={providerType}
                workflow={workflow}
                onInject={() => prepareWorkflow(providerType)}
              />
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
}

export default ResponseProvidersContainer;
