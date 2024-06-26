import { useState } from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Edit from "@mui/icons-material/Edit";
import CloudDone from "@mui/icons-material/CloudDone";
import useBrowser from "@/hooks/useBrowser";
import { theme } from "@/theme";
import { IGPTDocumentResponse } from "@/components/Automation/types";
import UpdateTextInputModal from "@/components/dialog/UpdateTextInputModal";

interface Props {
  gpt: IGPTDocumentResponse;
  onUpdate: (title: string, gptKey: string) => void;
}

function Header({ gpt, onUpdate }: Props) {
  const { isMobile } = useBrowser();
  const [popup, setPopup] = useState<string | null>(null);
  const [title, setTitle] = useState<string>(gpt.title);

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={2}
      sx={{
        position: { md: "sticky" },
        top: 0,
        p: { xs: "24px 24px 0", md: "24px 0 24px 32px" },
        borderBottom: { md: `1px solid ${theme.palette.surfaceContainerHighest}` },
      }}
    >
      <Stack
        flex={1}
        gap={1}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={1}
          width={{ xs: "96%", md: "auto" }}
        >
          <Typography
            fontSize={16}
            fontWeight={500}
            color={"onSurface"}
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
            }}
          >
            {title}
          </Typography>
          {!isMobile && (
            <IconButton
              onClick={() => setPopup("update")}
              sx={{ border: "none", svg: { fontSize: 16 } }}
            >
              <Edit />
            </IconButton>
          )}
        </Stack>
        <Typography
          fontSize={13}
          fontWeight={400}
          lineHeight={"28px"}
          color={"text.secondary"}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <>
            <CloudDone color="primary" />
            Saved as document
          </>
        </Typography>
      </Stack>

      {popup === "update" && (
        <UpdateTextInputModal
          title={gpt.title}
          onClose={() => setPopup(null)}
          onUpdate={newTitle => {
            onUpdate(newTitle, `${gpt.id}_${gpt.created_at}`);
            setTitle(newTitle);
            setPopup(null);
          }}
        />
      )}
    </Stack>
  );
}

export default Header;
