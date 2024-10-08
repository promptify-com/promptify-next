import { Dialog, Divider, Stack, Typography } from "@mui/material";
import ExportPdf from "./ExportPdf";
import { useAppSelector } from "@/hooks/useStore";
import { format } from "date-fns";
import ExportDocx from "./ExportDoc";

interface ExportPopupChatProps {
  onClose: () => void;
  content: string;
}

export const ExportPopupChat = ({ onClose, content }: ExportPopupChatProps) => {
  const clonedWorkflow = useAppSelector(state => state.chat?.clonedWorkflow ?? {});
  const currentDate = format(new Date(), "MM-dd-yyyy");
  const title = `${clonedWorkflow?.name} - ${currentDate}`
    .replace(/[\s,:]+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  return (
    <Dialog
      open
      onClose={() => onClose()}
      disableScrollLock
      maxWidth={"sm"}
    >
      <Stack sx={{ p: 2 }}>
        <Typography sx={{ fontSize: 12, color: "#375CA9", textTransform: "uppercase" }}>EXPORT</Typography>
      </Stack>
      <Divider />
      <Stack spacing={1}>
        <ExportPdf
          title={title}
          content={content}
        />
        <Divider />
        <ExportDocx
          title={title}
          content={content}
        />
      </Stack>
    </Dialog>
  );
};
