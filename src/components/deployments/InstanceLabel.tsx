import { Instance } from "@/common/types/deployments";
import { Typography } from "@mui/material";
import React from "react";

const InstanceLabel = (item: Instance) => {
  return (
    <>
      {item.instance_type}{" "}
      <Typography
        component="span"
        variant="body2"
        sx={{ opacity: 0.6 }}
      >
        (cost ${item.cost}/h, {item.vcpus}vcpus, {item.num_gpus}gpus, {item.memory}memory)
      </Typography>
    </>
  );
};

export default InstanceLabel;
