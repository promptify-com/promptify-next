import { useState } from "react";
import type { ExecutionTemplatePopupType, ExecutionWithTemplate } from "@/core/api/dto/templates";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Edit from "@mui/icons-material/Edit";
import { SparkSaveDeletePopup } from "@/components/dialog/SparkSaveDeletePopup";
import CloudDone from "@mui/icons-material/CloudDone";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";
import { daysFrom } from "@/common/helpers/timeManipulation";
import useBrowser from "@/hooks/useBrowser";
import ActionButtons from "./ActionButtons";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setDocumentTitle } from "@/core/store/documentsSlice";
import { theme } from "@/theme";
import { calculateDocumentDeleteDeadline } from "@/components/Documents/Helper";

interface Props {
  document: ExecutionWithTemplate;
}

function Header({ document }: Props) {
  const dispatch = useAppDispatch();
  const { isMobile } = useBrowser();
  const [popup, setPopup] = useState<ExecutionTemplatePopupType>(null);
  const title = useAppSelector(state => state.documents.title);
  const [isFavorite, setIsFavorite] = useState(document.is_favorite);

  const daysLeft = calculateDocumentDeleteDeadline(document.created_at);

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
          {isFavorite ? (
            <>
              <CloudDone color="primary" />
              Saved as document
            </>
          ) : (
            <>
              <ScheduleOutlined sx={{ color: "secondary.light" }} />
              {daysLeft !== "0" ? `Saved as draft for ${daysLeft}` : "Soon"}
            </>
          )}
        </Typography>
      </Stack>

      {!isMobile && (
        <ActionButtons
          document={document}
          onFavorite={setIsFavorite}
        />
      )}

      {(popup === "delete" || popup === "update") && (
        <SparkSaveDeletePopup
          type={popup}
          activeExecution={document}
          onClose={() => setPopup(null)}
          onUpdate={updateDocument => dispatch(setDocumentTitle(updateDocument.title))}
        />
      )}
    </Stack>
  );
}

export default Header;
