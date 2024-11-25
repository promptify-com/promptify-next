import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppSelector } from "@/hooks/useStore";
import SystemAvatar from "@/components/Automation/ChatInterface/SystemAvatar";
import CredentialsContainer from "@/components/Automation/ChatInterface/messages/Credentials/CredentialsContainer";

function MessageCredentials() {
  const credentialInputs = useAppSelector(state => state.chat.credentialsInput);

  if (!credentialInputs?.length) {
    return null;
  }
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "primary.main",
        maxWidth: 700,
        bgcolor: "#fff",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
      >
        <SystemAvatar />
        <Stack sx={{ width: "100%" }}>
          <Typography
            variant="caption"
            fontWeight={700}
            color="primary.main"
            sx={{ textTransform: "uppercase" }}
          >
            Workflow Credentials (Required)
          </Typography>
          <Typography
            variant="caption"
            color="text.primary"
          >
            Please connect the following credentials for the workflow:
          </Typography>
          <Stack mt={2}>
            <CredentialsContainer showMessage={false} />
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default MessageCredentials;
