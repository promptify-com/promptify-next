import Stack from "@mui/material/Stack";

import type { Deployment } from "@/common/types/deployments";
import DeploymentItem from "./DeploymentItem";
import TableHeader from "./TableHeader";
import { useState } from "react";
import { DeleteDialog } from "../dialog/DeleteDialog";
import { useDeleteDeploymentMutation } from "@/core/api/deployments";

function DeploymentList({ items }: { items: Deployment[] }) {
  const [popupData, setPopupData] = useState<null | number>(null);
  const [deleteDeployment] = useDeleteDeploymentMutation();

  const removeDeployment = async () => {
    if (!popupData) return;

    try {
      await deleteDeployment(popupData);
    } catch (error) {
      console.warn(`Could not delete deployment with id ${popupData}`, error);
    } finally {
      setPopupData(null);
    }
  };

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
              onDelete={() => {
                setPopupData(deployment.id);
              }}
            />
          ))}
      </Stack>
      {popupData && (
        <DeleteDialog
          open
          dialogTitle="Delete deployment"
          dialogContentText="Are you sure you want to delete this deployment?"
          onSubmit={removeDeployment}
          onClose={() => setPopupData(null)}
        />
      )}
    </Stack>
  );
}

export default DeploymentList;
