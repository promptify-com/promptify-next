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
      direction={"column"}
      overflow={"hidden"}
      gap={2}
    >
      <Stack direction={"column"}>
        <TableHeader />

        {items &&
          items.map((deployment, idx) => (
            <DeploymentItem
              key={idx}
              item={deployment}
            />
          ))}
      </Stack>
    </Stack>
  );
};

export default DeploymentList;
