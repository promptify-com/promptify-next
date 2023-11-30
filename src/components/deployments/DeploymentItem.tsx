import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteRounded from "@mui/icons-material/DeleteRounded";
import Zoom from "@mui/material/Zoom";
import ErrorOutline from "@mui/icons-material/ErrorOutline";

import type { Deployment } from "@/common/types/deployments";
import { StatusChip } from "./StatusChip";
import InstanceLabel from "./InstanceLabel";
import useTimestampConverter from "@/hooks/useTimestampConverter";
import { ExecuteDeploymentButton } from "./ExecuteDeploymentButton";
import { HelpOutline } from "@mui/icons-material";

interface DeploymentItem {
  item: Deployment;
  onDelete: () => void;
}

function DeploymentItem({ item, onDelete }: DeploymentItem) {
  const { convertedTimestamp } = useTimestampConverter();

  return (
    <Grid
      container
      my={{ xs: 1, md: 0 }}
      alignItems={"center"}
      sx={{
        p: { md: "16px 5px" },
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
        xs={9.5}
        md={2.5}
      >
        <Typography> {item.name} </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        md={1.5}
        textTransform={"capitalize"}
      >
        <Typography>
          {" "}
          {item.user.first_name ? `${item.user.first_name} ${item.user.last_name}` : item.user.username}{" "}
        </Typography>
      </Grid>
      <Grid
        item
        xs={6}
        md={1.5}
      >
        <Typography> {item.instance.region.name} </Typography>
      </Grid>
      <Grid
        item
        display={{ xs: "flex", md: "none" }}
        justifyContent={"end"}
        alignItems={"center"}
        md={1}
        xs={6}
      >
        <StatusChip
          size="small"
          label={item.status}
          status={item.status}
        />
      </Grid>
      <Grid
        item
        display={{ xs: "flex", md: "none" }}
        xs={12}
      >
        <InstanceLabel instance={item.instance} />
      </Grid>
      <Grid
        item
        display={{ xs: "none", md: "flex" }}
        alignItems={"center"}
        md={1.5}
      >
        {item.instance.instance_type}{" "}
        <Tooltip
          TransitionComponent={Zoom}
          title={`(cost ${item.instance.cost}/h, ${item.instance.vcpus}vcpus, ${item.instance.num_gpus}gpus, ${item.instance.memory}memory)`}
        >
          <HelpOutline
            sx={{
              fontSize: 18,
              cursor: "pointer",
              color: "#375CA9",
            }}
          />
        </Tooltip>
      </Grid>
      <Grid
        item
        display={{ xs: "none", md: "flex" }}
        justifyContent={"center"}
        alignItems={"center"}
        md={1}
      >
        <StatusChip
          size="small"
          label={item.status}
          status={item.status}
        />
        {item.status === "failed" && (
          <Tooltip
            TransitionComponent={Zoom}
            title={item.failure_reason}
          >
            <ErrorOutline
              sx={{
                fontSize: 18,
                cursor: "pointer",
                color: "#ef4444",
              }}
            />
          </Tooltip>
        )}
      </Grid>
      <Grid
        item
        display={"flex"}
        justifyContent={{ xs: "start", md: "center" }}
        pr={"13px"}
        md={1}
        width={{ xs: "50%" }}
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
        md={1}
        width={{ xs: "50%" }}
        pr={{ md: "0px" }}
      >
        <Typography
          display={"flex"}
          alignItems={"center"}
          sx={{
            fontSize: 12,
            opacity: { md: 0.4, xs: 1 },
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
                  opacity: { md: 0.25, xs: 1 },
                  fontSize: "16px",
                  "&:hover": {
                    opacity: 1,
                  },
                }}
              />
            </IconButton>
          </Tooltip>
          {item.status === "done" && (
            <ExecuteDeploymentButton
              deploymentId={item.id}
              modelName={item.model.name}
            />
          )}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default DeploymentItem;
