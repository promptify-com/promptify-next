import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { formatDate } from "@/common/helpers/timeManipulation";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import type {
  ICredential,
  INodeCredentials,
  IStoredWorkflows,
  IWorkflowCreateResponse,
} from "@/components/Automation/types";
import { useDeleteCredentialMutation, useUpdateWorkflowMutation, workflowsApi } from "@/core/api/workflows";
import { DeleteDialog } from "@/components/dialog/DeleteDialog";
import { useAppDispatch } from "@/hooks/useStore";
import { setToast } from "@/core/store/toastSlice";
import Stack from "@mui/material/Stack";
import Image from "@/components/design-system/Image";
import Button from "@mui/material/Button";
import DeleteForeverOutlined from "@mui/icons-material/DeleteForeverOutlined";
import Grid from "@mui/material/Grid";
import Storage from "@/common/storage";

function recreateNodeCredentials(nodeCredentials: INodeCredentials) {
  const _newCredentials = {} as INodeCredentials;

  for (const provider in nodeCredentials) {
    _newCredentials[provider] = { id: nodeCredentials[provider].id, name: nodeCredentials[provider].name };
  }

  return _newCredentials;
}

function Credentials() {
  const dispatch = useAppDispatch();
  const [selectedCredential, setSelectedCredential] = useState<ICredential | null>(null);
  const [deleteCredential] = useDeleteCredentialMutation();
  const [getWorkflow] = workflowsApi.endpoints.getWorkflow.useLazyQuery();
  const [updateWorkflow] = useUpdateWorkflowMutation();

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

      const storedWorkflows = (Storage.get("workflows") as unknown as IStoredWorkflows) || {};

      if (!!Object.values(storedWorkflows).length) {
        for (const _workflowId in storedWorkflows) {
          const _workflow = await getWorkflow(storedWorkflows[_workflowId].id).unwrap();
          let credentialFound = false;
          const _updatedWorkflow = {
            ..._workflow,
            nodes: _workflow.nodes.map(node => ({
              ...node,
              ...(node.credentials && { credentials: recreateNodeCredentials(node.credentials) }),
            })),
          };

          _updatedWorkflow.nodes.forEach(node => {
            if (!node.credentials) {
              return;
            }

            if (node.credentials[selectedCredential.type]) {
              node.credentials[selectedCredential.type].name = "to_be_deleted";
              credentialFound = true;
            }
          });

          if (credentialFound) {
            await updateWorkflow({ workflowId: Number(_workflowId), data: _updatedWorkflow });
          }
        }
      }

      removeCredential(selectedCredential.id);
      dispatch(setToast({ message: "Credential was successfully deleted", severity: "info" }));
    } catch (err) {
      dispatch(
        setToast({
          message: "Something went wrong please try again. " + (err as { message: string }).message,
          severity: "error",
        }),
      );
    } finally {
      setSelectedCredential(null);
    }
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
        <Grid
          container
          justifyContent={"space-between"}
          alignItems={{ xs: "flex-start", md: "center" }}
          flexDirection={{ xs: "column", md: "row" }}
          wrap={"nowrap"}
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
          <Grid
            item
            sx={{ xs: 12, md: 3 }}
            overflow={"hidden"}
          >
            <Typography
              fontSize={16}
              fontWeight={400}
              color={"onSurface"}
              sx={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {credential.name}
            </Typography>
          </Grid>
          <Grid
            item
            xs={7}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={2}
            whiteSpace={"nowrap"}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={2}
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
            </Stack>
            <Typography
              fontSize={14}
              fontWeight={400}
              color={"secondary.light"}
            >
              {formatDate(credential.createdAt)}
            </Typography>
          </Grid>
          <Grid
            item
            xs={2}
            ml={{ xs: "-1em", md: 0 }}
          >
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
          </Grid>
        </Grid>
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
