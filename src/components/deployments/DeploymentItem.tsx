import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import type { Deployment } from "@/common/types/deployments";
import { StatusChip } from "./StatusChip";
import InstanceLabel from "./InstanceLabel";
import useTimestampConverter from "@/hooks/useTimestampConverter";
import { Button } from "@mui/material";
import { ExecuteDeploymentButton } from "./ExecuteDeploymentButton";

interface DeploymentItem {
  item: Deployment;
}

const DeploymentItem = ({ item }: DeploymentItem) => {
  const { convertedTimestamp } = useTimestampConverter();

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
        md={3}
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
        pr={"13px"}
        md={1}
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
      >
        <ExecuteDeploymentButton item={item} />
      </Grid>
    </Grid>
  );
};

export default DeploymentItem;
