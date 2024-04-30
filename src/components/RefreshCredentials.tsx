import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";

import { useDeleteCredentialMutation } from "@/core/api/workflows";
import { useAppDispatch } from "@/hooks/useStore";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import { setToast } from "@/core/store/toastSlice";
import type { IAvailableCredentials, ICredential } from "@/components/Automation/types";
import { RefreshRounded } from "@mui/icons-material";

interface Props {
  credential: IAvailableCredentials | ICredential;
  onRefresh?: () => void;
}

function RefreshCredentials({ credential, onRefresh }: Props) {
  const dispatch = useAppDispatch();
  const { removeCredential, updateWorkflowAfterCredentialsDeletion } = useCredentials();
  const [deleteCredential] = useDeleteCredentialMutation();

  return (
    <MenuItem
      onClick={async e => {
        e.stopPropagation();
        e.preventDefault();
        await deleteCredential(credential.id);
        await updateWorkflowAfterCredentialsDeletion(credential.type);
        dispatch(setToast({ message: "Credential was successfully deleted.", severity: "info" }));
        removeCredential(credential.id);
        onRefresh?.();
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        p: "8px 16px",
        gap: 1,
        ":hover": {
          bgcolor: "surfaceContainerHighest",
        },
      }}
    >
      <Typography
        sx={{
          color: "onSurface",
        }}
      >
        {credential.name}
      </Typography>
    </MenuItem>
  );
}

export default RefreshCredentials;
