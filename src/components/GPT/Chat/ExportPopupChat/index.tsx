import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "@/hooks/useStore";
import ExportDocument from "./ExportDocument";
import { format } from "date-fns";
import SendEmail from "./SendEmail";
import { initialState as initialChatState } from "@/core/store/chatSlice";

interface ExportPopupChatProps {
  onClose: () => void;
  content: string;
}

export const ExportPopupChat = ({ onClose, content }: ExportPopupChatProps) => {
  const clonedWorkflow = useAppSelector(state => state.chat?.clonedWorkflow ?? initialChatState.clonedWorkflow);
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
        <ExportDocument
          title={title}
          content={content}
          format="pdf"
        />
        <Divider />
        <ExportDocument
          title={title}
          content={content}
          format="docx"
        />
        <Divider />
        <SendEmail
          title={title}
          content={content}
        />
      </Stack>
    </Dialog>
  );
};
