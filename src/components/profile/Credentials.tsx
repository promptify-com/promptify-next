import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { formatDate } from "@/common/helpers/timeManipulation";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import type {
  ICredential,
  INodeCredentials,
  IStoredWorkflows,
  IWorkflowCreateResponse,
} from "@/components/Automation/types";
import { useDeleteCredentialMutation, useUpdateWorkflowMutation, workflowsApi } from "@/core/api/workflows";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import { DeleteDialog } from "@/components/dialog/DeleteDialog";
import { useAppDispatch } from "@/hooks/useStore";
import { setToast } from "@/core/store/toastSlice";
import Storage from "@/common/storage";
import { setAreCredentialsStored } from "@/core/store/chatSlice";

function Credentials() {
  const dispatch = useAppDispatch();
  const [selectedCredential, setSelectedCredential] = useState<ICredential | null>(null);
  const [deleteCredential] = useDeleteCredentialMutation();
  const {
    credentials,
    setCredentials,
    initializeCredentials,
    removeCredential,
    updateWorkflowAfterCredentialsDeletion,
  } = useCredentials();

  useEffect(() => {
    // if credentials already in local storage, no http call will be triggered, we're safe here.
    initializeCredentials().then(_credentials => {
      if (!!_credentials.length) {
        const newCredentials = _credentials.filter(credential => credential.type !== "promptifyApi");

        setCredentials(newCredentials);
      }
    });
  }, []);

  const handleDelete = async () => {
    if (!selectedCredential) return;

    try {
      await deleteCredential(selectedCredential.id);
      await updateWorkflowAfterCredentialsDeletion(selectedCredential.type);

      removeCredential(selectedCredential.id);
      dispatch(setToast({ message: "Credential was successfully deleted", severity: "info" }));
    } catch (_) {
      dispatch(setToast({ message: "Something went wrong please try again", severity: "error" }));
    } finally {
      setSelectedCredential(null);
    }

    removeCredential(selectedCredential.id);
    dispatch(setToast({ message: "Credential was successfully deleted", severity: "info" }));
  };

  if (!credentials.length) {
    return;
  }

  return (
    <Box
      mt={"14px"}
      width={"100%"}
      sx={{
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Typography
        textAlign={{ xs: "center", sm: "start" }}
        sx={{
          fontFamily: "Poppins",
          fontStyle: "normal",
          fontWeight: 500,
          fontSize: { xs: 18, md: 24 },
          lineHeight: { xs: "133.4%", sm: "123.5%" },
          display: "flex",
          alignItems: "center",
          color: "#1B1B1E",
        }}
      >
        Credentials
      </Typography>
      {credentials.map(cred => (
        <Box
          key={cred.id}
          sx={{
            bgcolor: "surface.1",
            height: "74px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "0px 24px",
            border: "1px solid #ECECF4",
            borderRadius: "16px",
          }}
        >
          <Grid
            container
            alignItems={"center"}
          >
            <Grid
              item
              md={5}
            >
              <Typography
                fontWeight={500}
                fontSize="1rem"
                display={"block"}
              >
                {cred.name}
              </Typography>
            </Grid>
            <Grid
              item
              md={4}
            >
              <Typography
                fontWeight={400}
                fontSize="1rem"
                display={"block"}
              >
                {cred.type}
              </Typography>
            </Grid>

            <Grid
              item
              ml={"auto"}
            >
              <Typography
                fontWeight={400}
                color={"text.secondary"}
              >
                {formatDate(cred.createdAt)}
              </Typography>
            </Grid>
            {cred.type !== "promptifyApi" && (
              <Grid
                ml={2}
                item
              >
                <IconButton
                  onClick={() => setSelectedCredential(cred)}
                  sx={{
                    border: "none",
                    color: "onSurface",
                    "&:hover": {
                      color: "#ef4444",
                    },
                  }}
                >
                  <Delete />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </Box>
      ))}
      {selectedCredential?.id && (
        <DeleteDialog
          open={true}
          dialogContentText={`Are you sure you want to remove ${selectedCredential.name}?`}
          onClose={() => setSelectedCredential(null)}
          onSubmit={handleDelete}
        />
      )}
    </Box>
  );
}

export default Credentials;
