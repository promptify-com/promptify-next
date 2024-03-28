import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { formatDate } from "@/common/helpers/timeManipulation";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import type { ICredential } from "@/components/Automation/types";
import { useDeleteCredentialMutation } from "@/core/api/workflows";
import { DeleteDialog } from "@/components/dialog/DeleteDialog";
import { useAppDispatch } from "@/hooks/useStore";
import { setToast } from "@/core/store/toastSlice";
import Stack from "@mui/material/Stack";
import Image from "@/components/design-system/Image";
import Button from "@mui/material/Button";
import DeleteForeverOutlined from "@mui/icons-material/DeleteForeverOutlined";

function Credentials() {
  const dispatch = useAppDispatch();
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

    try {
      await deleteCredential(selectedCredential.id);
    } catch (_) {
      dispatch(setToast({ message: "Something went wrong please try again", severity: "error" }));
      return;
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
    <Stack
      alignItems={"center"}
      gap={2}
    >
      {credentials.map(credential => (
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={3}
          key={credential.id}
          sx={{
            width: "calc(100% - 40px)",
            border: "1px solid ",
            borderColor: "surfaceContainerHighest",
            borderRadius: "16px",
            p: "16px 24px 16px 16px",
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
            minWidth={"fit-content"}
          >
            <Typography
              fontSize={16}
              fontWeight={400}
              color={"onSurface"}
            >
              {credential.name}
            </Typography>
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={2}
            whiteSpace={"nowrap"}
          >
            <Image
              src={require("@/assets/images/default-avatar.jpg")}
              alt={credential.name.slice(0, 1) ?? "P"}
              width={40}
              height={40}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Poppins, Space Mono",
                fontSize: "16px",
                borderRadius: "50%",
                overflow: "hidden",
                color: "#fff",
                backgroundColor: "black",
                textTransform: "capitalize",
                lineHeight: "47px",
                textAlign: "center",
              }}
            />
            <Typography
              fontSize={16}
              fontWeight={400}
              color={"onSurface"}
            >
              {credential.type}
            </Typography>
            <Typography
              fontSize={14}
              fontWeight={400}
              color={"secondary.light"}
            >
              {formatDate(credential.createdAt)}
            </Typography>
          </Stack>
          <Button
            onClick={() => setSelectedCredential(credential)}
            startIcon={<DeleteForeverOutlined />}
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: "onSurface",
            }}
          >
            Delete
          </Button>
        </Stack>
      ))}
      {selectedCredential?.id && (
        <DeleteDialog
          open={true}
          dialogContentText={`Are you sure you want to remove ${selectedCredential.name}?`}
          onClose={() => setSelectedCredential(null)}
          onSubmit={handleDelete}
        />
      )}
    </Stack>
  );
}

export default Credentials;
