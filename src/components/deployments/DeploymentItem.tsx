import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import type { Deployment } from "@/common/types/deployments";
import { StatusChip } from "./StatusChip";
import InstanceLabel from "./InstanceLabel";
import useTimestampConverter from "@/hooks/useTimestampConverter";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteRounded from "@mui/icons-material/DeleteRounded";
import { isDesktopViewPort } from "@/common/helpers";
import { ExecuteDeploymentButton } from "./ExecuteDeploymentButton";

interface DeploymentItem {
  item: Deployment;
  onDelete: () => void;
}

function DeploymentItem({ item, onDelete }: DeploymentItem) {
  const { convertedTimestamp } = useTimestampConverter();
  const isDesktop = isDesktopViewPort();

  return (
    <Grid
      container
      my={{ xs: 1, md: 0 }}
      alignItems={"center"}
      sx={{
        p: { md: "16px" },
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
      rowSpacing={{ xs: 1, md: 0 }}
    >
      <Grid
        item
        xs={8}
        md={2}
      >
        <Typography> {item.model.name} </Typography>
      </Grid>
      <Grid
        item
        display={{ xs: "flex", md: "none" }}
        justifyContent={"end"}
        alignItems={"center"}
        md={2}
        xs={4}
      >
        <StatusChip
          size="small"
          label={item.status}
          status={item.status}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={4}
      >
        <InstanceLabel instance={item.instance} />
      </Grid>
      <Grid
        item
        display={{ xs: "none", md: "flex" }}
        justifyContent={"center"}
        alignItems={"center"}
        md={2}
      >
        <StatusChip
          size="small"
          label={item.status}
          status={item.status}
        />
      </Grid>
      <Grid
        item
        display={"flex"}
        justifyContent={isDesktop ? "center" : "start"}
        pr={"13px"}
        md={2}
        {...(!isDesktop && { width: "50%" })}
      >
        <Typography
          sx={{
            fontSize: 12,
            opacity: 0.4,
          }}
        >
          {convertedTimestamp(item.created_at)}
        </Typography>
      </Grid>
      <Grid
        item
        display={"flex"}
        justifyContent={"end"}
        md={2}
        {...(isDesktop ? { pr: "13px" } : { width: "50%" })}
      >
        <Typography
          display={"flex"}
          alignItems={"center"}
          sx={{
            fontSize: 12,
            opacity: isDesktop ? 0.4 : 1,
            "&:hover": {
              opacity: 1,
            },
          }}
        >
          <Tooltip title="Delete">
            <IconButton
              onClick={onDelete}
              sx={{
                mt: -0.4,
                border: "none",
                "&:hover": {
                  bgcolor: "surface.2",
                  opacity: 1,
                },
              }}
            >
              <DeleteRounded
                sx={{
                  opacity: isDesktop ? 0.25 : 1,
                  fontSize: "16px",
                  "&:hover": {
                    opacity: 1,
                  },
                }}
              />
            </IconButton>
          </Tooltip>
          {item.status === "done" && <ExecuteDeploymentButton item={item} />}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default DeploymentItem;
