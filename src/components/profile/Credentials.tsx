import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { formatDate } from "@/common/helpers/timeManipulation";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import type { ICredential } from "@/components/Automation/types";
import { useDeleteCredentialMutation } from "@/core/api/workflows";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";

function Credentials() {
  const [selectedCredential, setSelectedCredential] = useState<ICredential | null>(null);
  const [deleteCredential] = useDeleteCredentialMutation();

  const { credentials, setCredentials, initializeCredentials, removeCredential } = useCredentials();

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

    await deleteCredential(selectedCredential.id);
    removeCredential(selectedCredential.id);
    setSelectedCredential(null);
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
        <Dialog
          open
          disableScrollLock={true}
          onClose={() => setSelectedCredential(null)}
        >
          <DialogContent>
            <DialogContentText>
              Are you sure you want to remove <b>{selectedCredential.name}</b>?
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              p: "8px 15px 15px",
            }}
          >
            <Button
              sx={{
                "&:hover": {
                  backgroundColor: "grey.300",
                },
              }}
              onClick={() => setSelectedCredential(null)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDelete}
            >
              Remove
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default Credentials;
