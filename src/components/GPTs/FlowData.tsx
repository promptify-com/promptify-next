import Typography from "@mui/material/Typography";
import Link from "next/link";
import Stack from "@mui/material/Stack";

import type { ITemplateWorkflow } from "@/components/Automation/types";
import { getWorkflowDataFlow } from "./helpers";
import { useAppSelector } from "@/hooks/useStore";
import { isAdminFn } from "@/core/store/userSlice";
import ShareIcon from "@/assets/icons/ShareIcon";
import DataFlowSteps from "../common/DataFlowSteps";

function Workflow({ workflow }: { workflow: ITemplateWorkflow }) {
  const steps = getWorkflowDataFlow(workflow);
  const isAdmin = useAppSelector(isAdminFn);
  const userWorkflowId = useAppSelector(state => state.chat?.clonedWorkflow?.id ?? null);

  return (
    <Stack
      gap={5}
      sx={{
        p: "40px",
        borderLeft: "1px solid #ECECF3",
        backgroundColor: "#fcfbff",
        backgroundImage: "radial-gradient(circle, #e9e6f3 1px, transparent 1px)",
        backgroundSize: "10px 10px",
      }}
    >
      <Stack
        flexDirection={"row"}
        gap={1}
        alignItems={"center"}
      >
        <Typography
          fontSize={14}
          fontWeight={500}
          color={"common.black"}
          fontStyle={"normal"}
          lineHeight={"100%"}
        >
          Data flow
        </Typography>
        {isAdmin && userWorkflowId && (
          <Link
            href={`https://automation.promptify.com/workflow/${userWorkflowId}`}
            style={{ textDecoration: "none" }}
            target="_blank"
          >
            <ShareIcon opacity={1} />
          </Link>
        )}
      </Stack>
      <Stack>
        <DataFlowSteps steps={steps} />
      </Stack>
    </Stack>
  );
}

export default Workflow;
