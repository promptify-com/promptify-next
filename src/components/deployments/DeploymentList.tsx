import Stack from "@mui/material/Stack";

import type { Deployment } from "@/common/types/deployments";
import DeploymentItem from "./DeploymentItem";
import TableHeader from "./TableHeader";

function DeploymentList({ items }: { items: Deployment[] }) {
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
          items.map(deployment => (
            <DeploymentItem
              key={deployment.id}
              item={deployment}
            />
          ))}
      </Stack>
    </Stack>
  );
}

export default DeploymentList;
