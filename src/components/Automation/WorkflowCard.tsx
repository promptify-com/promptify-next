import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Image from "@/components/design-system/Image";
import { stripTags } from "@/common/helpers";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { initialState as initialChatState, setSelectedWorkflow } from "@/core/store/chatSlice";
import type { IWorkflow } from "@/components/Automation/types";
import useChatsManager from "@/components/Chat/Hooks/useChatsManager";

interface Props {
  workflow: IWorkflow;
  onScrollToBottom?: () => void;
}

function WorkflowCard({ workflow, onScrollToBottom }: Props) {
  const dispatch = useAppDispatch();

  const { updateChat } = useChatsManager();

  const selectedChat = useAppSelector(state => state.chat?.selectedChat ?? initialChatState.selectedChat);

  const { image, name, description } = workflow;

  const handleSelectWorkflow = () => {
    if (!selectedChat) {
      return;
    }

    updateChat(selectedChat.id, { title: name, thumbnail: image });
    dispatch(setSelectedWorkflow(workflow));
    onScrollToBottom?.();
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      gap={"24px"}
      sx={{
        bgcolor: "surfaceContainerLowest",
        border: "none",
        borderColor: "surfaceDim",
        width: { xs: "calc(100% - 16px)", md: "calc(100% - 32px)" },
        p: { xs: "16px 8px", md: "16px" },
        borderRadius: "16px",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"flex-start"}
        gap={"24px"}
        width={{ xs: "100%", md: "fit-content" }}
      >
        <Box
          sx={{
            zIndex: 0,
            position: "relative",
            width: { xs: "160px", md: "152px" },
            minWidth: "152px",
            height: "113px",
            borderRadius: "24px",
            overflow: "hidden",
            textDecoration: "none",
          }}
        >
          <Image
            src={image ?? require("@/assets/images/default-thumbnail.jpg")}
            alt={name}
            priority={true}
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </Box>
        <Stack
          direction={"column"}
          justifyContent={"space-between"}
          gap={2}
          py={"8px"}
        >
          <Stack alignItems={"flex-start"}>
            <Typography
              fontSize={{ xs: 15, md: 18 }}
              fontWeight={500}
              lineHeight={"25.2px"}
            >
              {name}
            </Typography>
            <Typography
              fontSize={{ xs: 14, md: 16 }}
              fontWeight={400}
              lineHeight={"22.2px"}
              sx={{
                opacity: 0.75,
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                minwid: "44.4px",
              }}
            >
              {stripTags(description ?? "")}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={1}
        px={{ md: "16px" }}
        width={{ xs: "100%", md: "fit-content" }}
      >
        <Button
          variant="text"
          startIcon={<PlayArrow />}
          sx={btnStyle}
          onClick={handleSelectWorkflow}
        >
          Run Workflow
        </Button>
      </Stack>
    </Stack>
  );
}

export default WorkflowCard;

const btnStyle = {
  width: "fit-content",
  border: "none",
  color: "onSurface",
  bgcolor: { xs: "surfaceContainerLow", md: "transparent" },
  "&:hover": {
    bgcolor: "action.hover",
  },
};
