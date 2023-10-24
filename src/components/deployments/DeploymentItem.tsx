import { Deployment } from "@/common/types/deployments";
import { Grid, Typography } from "@mui/material";
import React from "react";
import { StatusChip } from "./StatusChip";

interface DeploymentItem {
  item: Deployment;
}

const DeploymentItem = ({ item }: DeploymentItem) => {
  return (
    <Grid
      container
      alignItems={"center"}
    >
      <Grid
        item
        md={3}
      >
        <Typography> {item.model} </Typography>
      </Grid>

      <Grid
        item
        md={4}
      >
        <Typography> {item.instance}</Typography>
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
          {item.createdAt}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default DeploymentItem;
