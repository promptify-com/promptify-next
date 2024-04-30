import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Add from "@mui/icons-material/Add";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import UnfoldLess from "@mui/icons-material/UnfoldLess";

import { useAppSelector } from "@/hooks/useStore";
import { workflowsApi } from "@/core/api/workflows";
import Storage from "@/common/storage";
import RefreshCredentials from "@/components/RefreshCredentials";
import type { IAvailableCredentials, IStoredWorkflows } from "@/components/Automation/types";

interface Props {
  title: string;
  isExpanded: boolean;
}

function HeaderCreds({ title, isExpanded }: Props) {
  const router = useRouter();
  const workflowId = router.query?.workflowId as string;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [availableCredentials, setAvailableCredentials] = useState<IAvailableCredentials[]>([]);
  const [getWorkflow] = workflowsApi.endpoints.getWorkflow.useLazyQuery();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const { areCredentialsStored } = useAppSelector(state => state.chat);
  useEffect(() => {
    async function updateRefreshButtons() {
      const storedWorkflows = (Storage.get("workflows") as unknown as IStoredWorkflows) || {};
      if (workflowId && storedWorkflows[workflowId]?.id) {
        const _workflow = await getWorkflow(storedWorkflows[workflowId].id).unwrap();
        const clonedWorkflow = structuredClone(_workflow);
        const listedCredentials: IAvailableCredentials[] = [];

        clonedWorkflow.nodes.forEach(node => {
          if (
            !node.credentials ||
            Object.keys(node.credentials).length === 0 ||
            node.type === "n8n-nodes-promptify.promptify" ||
            node.type === "n8n-nodes-base.openAi"
          ) {
            return;
          }

          for (const credentialsType in node.credentials) {
            listedCredentials.push({
              id: node.credentials[credentialsType].id,
              name: node.credentials[credentialsType].name?.replace("Credentials", "").trim(),
              type: credentialsType,
              isRefreshed: false,
            });
          }
        });
        setAvailableCredentials(listedCredentials);
      }
    }

    updateRefreshButtons();
  }, [areCredentialsStored]);

  const refreshCredential = (credentialId: string) => {
    setAvailableCredentials(currentCredentials =>
      currentCredentials.map(cred => (cred.id === credentialId ? { ...cred, isRefreshed: true } : cred)),
    );
  };

  useEffect(() => {
    if (availableCredentials.length > 0) {
      const allRefreshed = availableCredentials.every(cred => cred.isRefreshed);
      if (allRefreshed) {
        setAvailableCredentials([]);
      }
    }
  }, [availableCredentials]);
  return (
    <Stack
      direction={"row"}
      gap={"8px"}
      width={"100%"}
      alignItems={"center"}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={"8px"}
        flex={1}
        width={"100%"}
      >
        <Box
          position={"relative"}
          mt={0.5}
          sx={{
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "8px",
            border: `1px dashed`,
            borderColor: "primary.main",
            bgcolor: "surface.5",
            color: "primary.main",
          }}
        >
          <Add
            sx={{
              fontSize: 32,
            }}
          />
          <Box
            position={"absolute"}
            width={"11px"}
            height={"11px"}
            borderRadius={"4px 0px 8px 0px"}
            bgcolor={"surface.1"}
            bottom={0}
            right={0}
          />
        </Box>

        <Stack
          flex={1}
          direction={"column"}
          gap={"2px"}
        >
          <Typography
            fontSize={{ xs: "14px", md: "15px" }}
            lineHeight={"120%"}
            display={"flex"}
            flex={1}
            alignItems={"center"}
            justifyContent={{ xs: "space-between", md: "start" }}
            letterSpacing={"0.2px"}
          >
            {title}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={"8px"}
      >
        {availableCredentials.length > 0 && (
          <>
            <Button
              startIcon={<RefreshRounded />}
              onClick={handleClick}
              sx={{
                color: "onSurface",
                fontSize: 15,
                fontWeight: "500",
              }}
            >
              Refresh
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              sx={{
                px: "16px",
              }}
            >
              {availableCredentials.map(
                credential =>
                  !credential.isRefreshed && (
                    <RefreshCredentials
                      key={credential.id}
                      credential={credential}
                      onRefresh={() => {
                        refreshCredential(credential.id);
                      }}
                    />
                  ),
              )}
            </Menu>
          </>
        )}
        <Stack>
          {isExpanded ? (
            <Tooltip
              title="Collapse"
              arrow
              placement="top"
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -5],
                    },
                  },
                ],
              }}
            >
              <IconButton
                sx={{
                  border: "none",
                  ":hover": {
                    bgcolor: "surface.4",
                  },
                }}
              >
                <UnfoldLess fontSize="inherit" />
              </IconButton>
            </Tooltip>
          ) : (
            <Button
              variant="text"
              sx={{
                height: "34px",
                p: "15px",
                color: "onSurface",
                fontSize: 13,
                fontWeight: 500,
                ":hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              Expand
              <UnfoldLess
                sx={{
                  fontSize: 20,
                  ml: 1,
                }}
              />
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default HeaderCreds;
