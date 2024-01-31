import { useEffect, useState } from "react";
import Delete from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";

import { formatDate } from "@/common/helpers/timeManipulation";
import { useDeleteCredentialMutation, useGetCredentialsQuery } from "@/core/api/workflows";
import Storage from "@/common/storage";
import { useAppDispatch } from "@/hooks/useStore";
import { DeleteDialog } from "@/components/dialog/DeleteDialog";
import { setToast } from "@/core/store/toastSlice";
import type { CredentialResponse } from "@/components/Automation/types";

function Credentials() {
  const dispatch = useAppDispatch();

  const storedCredentials = Storage.get("credentials");
  const [localCredentials, setLocalCredentials] = useState<CredentialResponse[]>([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<CredentialResponse>();

  const shouldSkipApiCall = storedCredentials && Object.keys(storedCredentials).length > 0;

  const { data: credentials } = useGetCredentialsQuery(undefined, {
    skip: shouldSkipApiCall,
  });

  const [deleteCredential] = useDeleteCredentialMutation();

  useEffect(() => {
    const storedCredentials = Storage.get("credentials");

    if (storedCredentials) {
      const transformedCredentials: CredentialResponse[] = Object.keys(storedCredentials).map(key => ({
        ...storedCredentials[key],
        type: key,
      }));
      setLocalCredentials(transformedCredentials);
    } else if (credentials) {
      setLocalCredentials(credentials);
    }
  }, [credentials]);

  const handleDeleteCredential = async () => {
    if (!selectedCredential) return;

    try {
      const response = await deleteCredential(selectedCredential.id).unwrap();

      if (response) {
        setLocalCredentials(prevCredentials => prevCredentials.filter(cred => cred.id !== selectedCredential.id));

        const storedCredentials = Storage.get("credentials") || {};
        delete storedCredentials[selectedCredential.type];
        Storage.set("credentials", JSON.stringify(storedCredentials));

        dispatch(setToast({ message: "Credential successfully deleted.", severity: "success" }));
      }
    } catch (error) {
      dispatch(setToast({ message: "Failed to delete credential.", severity: "error" }));
    } finally {
      setOpenConfirmDialog(false);
      setSelectedCredential(undefined);
    }
  };

  if (!localCredentials.length) {
    return;
  }

  return (
    <>
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
        {localCredentials?.map(cred => (
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
                md={3}
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
                md={3}
              >
                <Typography
                  fontWeight={400}
                  fontSize="14px"
                  display={"block"}
                >
                  {formatDate(cred.createdAt)}
                </Typography>
              </Grid>
              <Grid
                item
                ml={"auto"}
              >
                <IconButton
                  onClick={() => {
                    setOpenConfirmDialog(true);
                    setSelectedCredential(cred);
                  }}
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>
      {openConfirmDialog && (
        <DeleteDialog
          open
          dialogTitle="Are you sure?"
          dialogContentText="Deleting this credential cannot be reverted."
          onClose={() => setOpenConfirmDialog(false)}
          onSubmit={handleDeleteCredential}
        />
      )}
    </>
  );
}

export default Credentials;
