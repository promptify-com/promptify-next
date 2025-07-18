import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Refresh } from "@mui/icons-material";
import BaseButton from "@/components/base/BaseButton";
import { useDeleteCredentialMutation } from "@/core/api/workflows";
import { useAppDispatch } from "@/hooks/useStore";
import useCredentials from "./Automation/Hooks/useCredentials";
import { setToast } from "@/core/store/toastSlice";
import { IAvailableCredentials, ICredential } from "./Automation/types";

interface Props {
  credential: IAvailableCredentials | ICredential;
  onClick?: () => void;
  showLabel?: boolean;
}

function RefreshCredentials({ credential, showLabel = false, onClick }: Props) {
  const dispatch = useAppDispatch();
  const { removeCredential, updateWorkflowAfterCredentialsDeletion } = useCredentials();
  const [deleteCredential] = useDeleteCredentialMutation();

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={1}
    >
      <IconButton
        sx={{
          border: "none",
          ":hover": {
            bgcolor: "action.hover",
          },
        }}
        onClick={async e => {
          e.preventDefault();
          await deleteCredential(credential.id);
          await updateWorkflowAfterCredentialsDeletion(credential.type, false);
          dispatch(setToast({ message: "Credential was successfully deleted.", severity: "info" }));
          removeCredential(credential.id);
          onClick?.();
        }}
      >
        <Refresh />
      </IconButton>
    </Stack>
  );
}

export default RefreshCredentials;
