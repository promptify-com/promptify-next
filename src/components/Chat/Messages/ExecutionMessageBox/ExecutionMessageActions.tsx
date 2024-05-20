import Stack from "@mui/material/Stack";
import FeedbackThumbs from "@/components/Prompt/Common/FeedbackThumbs";
import ExportExecutionButton from "@/components/Chat/Messages/ExecutionMessageBox/ExportExecutionButton";
import type { TemplatesExecutions } from "@/core/api/dto/templates";
import SaveExecutionButton from "./SaveExecutionButton";

interface Props {
  execution?: TemplatesExecutions;
}

function ExecutionMessageActions({ execution }: Props) {
  return (
    <>
      {!!execution && (
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          {!!execution && (
            <FeedbackThumbs
              variant="icon"
              execution={execution}
            />
          )}
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
          >
            <SaveExecutionButton execution={execution} />
            <ExportExecutionButton execution={execution} />
          </Stack>
        </Stack>
      )}
    </>
  );
}

export default ExecutionMessageActions;
