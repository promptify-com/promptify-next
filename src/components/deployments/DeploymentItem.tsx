import { Deployment } from "@/common/types/deployments";
import { Grid, Typography } from "@mui/material";
import React from "react";
import { StatusChip } from "./StatusChip";
import InstanceLabel from "./InstanceLabel";
import useTimestampConverter from "@/hooks/useTimestampConverter";

interface DeploymentItem {
  item: Deployment;
}

const DeploymentItem = ({ item }: DeploymentItem) => {
  const { convertedTimestamp } = useTimestampConverter();

  return (
    <Grid
      container
      alignItems={"center"}
      sx={{
        p: "16px",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      <Grid
        item
        md={3}
      >
        <Typography> {item.model.name} </Typography>
      </Grid>

      <Grid
        item
        md={4}
      >
        {InstanceLabel(item.instance)}
      </Grid>
      <Grid
        item
        display={"flex"}
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
        justifyContent={"end"}
        pr={"13px"}
        md={3}
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
    </Grid>
  );
};

export default DeploymentItem;
