import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { PROVIDERS } from "./Constants";
import ResponseProvider from "./ResponseProvider";
import type { IWorkflow } from "@/components/Automation/types";

interface Props {
  message: string;
  workflow: IWorkflow;
}

function ResponseProvidersContainer({ message, workflow }: Props) {
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
        {Object.keys(PROVIDERS).map(provider => (
          <Grid
            item
            xs={6}
            key={provider}
          >
            <ResponseProvider
              providerType={provider}
              workflow={workflow}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

export default ResponseProvidersContainer;
