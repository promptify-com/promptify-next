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
      my={{ xs: 1, md: 0 }}
      alignItems={"center"}
      sx={{
        p: { md: "16px" },
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
      rowSpacing={1}
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
        {InstanceLabel(item.instance)}
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
