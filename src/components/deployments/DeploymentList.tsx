import React from "react";
import { Stack } from "@mui/material";

import DeploymentItem from "./DeploymentItem";
import TableHeader from "./TableHeader";
import { Deployment } from "@/common/types/deployments";

const DeploymentList = ({ items }: { items: Deployment[] }) => {
  return (
    <Stack
      bgcolor={"surface.1"}
      borderRadius={"16px"}
      p={"16px"}
      direction={"column"}
      gap={2}
    >
      <Stack
        direction={"column"}
        gap={"18px"}
      >
        <TableHeader />

        {items.map(deployment => (
          <DeploymentItem
            key={deployment.createdAt}
            item={deployment}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default DeploymentList;
