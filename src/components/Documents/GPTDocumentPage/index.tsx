import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Header from "./Header";
import { IGPTDocumentResponse } from "@/components/Automation/types";
import { MessageContentWithHTML } from "@/components/GPT/Message";

interface Props {
  gpt: IGPTDocumentResponse;
  onUpdate: (title: string, gptKey: string) => void;
}

interface Modal extends Props {
  onClose: () => void;
}

function GPTDocumentPage({ gpt, onUpdate }: Props) {
  return (
    <Box
      sx={{
        height: { md: "calc(100svh - 24px)" },
        width: { md: "calc(100% - 164px)" },
        bgcolor: { xs: "surfaceContainerLow", md: "surfaceContainerLowest" },
        p: { md: "0 92px 0 72px" },
        position: "relative",
        overflow: { xs: "auto", md: "unset" },
        overscrollBehavior: "contain",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Header
        gpt={gpt}
        onUpdate={onUpdate}
      />
      <Stack
        direction={{ md: "row" }}
        alignItems={{ md: "flex-start" }}
        height={{
          md: `calc(100% - 120px)`,
        }}
        sx={{
          overflow: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Box
          sx={{
            order: { md: 0 },
            flex: 1,
            p: "48px",
            height: "100%",
            bgcolor: "surfaceContainerLowest",
            borderRadius: "16px",
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: 0,
            },
          }}
        >
          <MessageContentWithHTML content={gpt.output} />
        </Box>
      </Stack>
      <Box
        flex={2}
        order={0}
      ></Box>
    </Box>
  );
}

function GPTDocumentPageModal({ gpt, onClose, onUpdate }: Modal) {
  return (
    <Modal
      open
      disableAutoFocus={true}
    >
      <Stack
        direction={"row"}
        bgcolor={"surfaceContainerLowest"}
        sx={{
          height: { xs: "calc(100svh - 12px)", md: "calc(100svh - 24px)" },
          m: { xs: "12px 12px 0", md: "24px 16px 0" },
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
          overflow: "auto",
          overscrollBehavior: "contain",
          position: "relative",
          "&::-webkit-scrollbar": {
            width: 0,
          },
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: { xs: "fixed", md: "absolute" },
            top: { xs: "20px", md: "40px" },
            right: { xs: "20px", md: "24px" },
            zIndex: 9999,
            border: "none",
            bgcolor: { xs: "surfaceContainerLow", md: "transparent" },
            ":hover": { bgcolor: "surfaceContainerHigh" },
            "& svg": {
              width: { xs: "15px", md: "19px" },
              height: { xs: "15px", md: "19px" },
            },
          }}
        >
          <Close />
        </IconButton>
        <GPTDocumentPage
          gpt={gpt}
          onUpdate={onUpdate}
        />
      </Stack>
    </Modal>
  );
}

export default GPTDocumentPageModal;
