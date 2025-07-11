import { useState } from "react";
import { usePathname } from "next/navigation";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloudOutlined from "@mui/icons-material/CloudOutlined";
import ModeEdit from "@mui/icons-material/ModeEdit";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import RocketLaunchOutlined from "@mui/icons-material/RocketLaunchOutlined";
import AccountTree from "@mui/icons-material/AccountTree";
import FormatListBulleted from "@mui/icons-material/FormatListBulleted";

import { BUILDER_TYPE } from "@/common/constants";
import { useAppSelector } from "@/hooks/useStore";
import BaseButton from "@/components/base/BaseButton";
import BuilderHeaderPlaceholder from "@/components/placeholders/BuilderHeaderPlaceholder";
import type { TemplateStatus } from "@/core/api/dto/templates";
import type { BuilderType } from "@/common/types/builder";
import { useTheme } from "@mui/material/styles";

interface IHeader {
  onSave: () => void;
  onPublish: () => void;
  templateLoading?: boolean;
  title: string;
  status: TemplateStatus;
  templateSlug?: string;
  onEditTemplate: () => void;
  type: BuilderType;
}

function Header({ templateLoading, onSave, onPublish, title, status, templateSlug, onEditTemplate, type }: IHeader) {
  const pathname = usePathname();
  const theme = useTheme();
  const currentUser = useAppSelector(state => state.user.currentUser);

  const builderSidebarOpen = useAppSelector(state => state.sidebar.builderSidebarOpen);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveTemplate = async () => {
    setIsSaving(true);
    await onSave();
    setIsSaving(false);
  };

  const handlePublishTemplate = async () => {
    setIsSaving(true);
    await onPublish();
    setIsSaving(false);
  };

  const containerWidth = `${theme.custom.leftClosedSidebarWidth}  ${builderSidebarOpen ? " + 353px" : ""}`;

  if (typeof templateLoading === "boolean" && templateLoading) {
    return <BuilderHeaderPlaceholder />;
  }

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={10}
      bgcolor={"surface.1"}
      p={"16px 24px"}
      zIndex={3}
      height="70px"
      boxSizing={"border-box"}
      sx={{
        position: "relative",
        ...(type === BUILDER_TYPE.USER && {
          position: "fixed",
          top: "72px",
          borderTop: "1px solid",
          borderColor: "surface.3",
          borderBottomRightRadius: { md: "16px" },
          borderBottomLeftRadius: { md: "16px" },
          width: {
            xs: "100%",
            md: `calc(100% - (${containerWidth}))`,
          },
        }),
      }}
    >
      <Stack
        flex={1}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={2}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
            sx={{ color: "onSurface" }}
          >
            <Typography sx={{ color: "onSurface", fontSize: "16px" }}>{title}</Typography>
            <ModeEdit
              sx={{ cursor: "pointer", fontSize: "16px" }}
              onClick={onEditTemplate}
            />
          </Stack>

          {status && (
            <Chip
              label={status}
              sx={{
                bgcolor: "surface.3",
                color: "onSurface",
                fontSize: 13,
                p: "7px 6px",
                height: "auto",
                ".MuiChip-label": {
                  textTransform: "lowercase",
                  ":first-letter": {
                    textTransform: "uppercase",
                  },
                },
              }}
              size="small"
            />
          )}
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={1}
        >
          {templateSlug && (
            <>
              {currentUser?.is_admin && type === BUILDER_TYPE.USER && (
                <BaseButton
                  variant="text"
                  color="custom"
                  sx={btnStyle}
                  startIcon={<AccountTree sx={{ fontSize: 20 }} />}
                  onClick={() => window.open(`/builder/${templateSlug}`, "_blank")}
                >
                  Tree of Thoughts Builder
                </BaseButton>
              )}
              {type === BUILDER_TYPE.ADMIN && (
                <BaseButton
                  variant="text"
                  color="custom"
                  sx={btnStyle}
                  startIcon={<FormatListBulleted sx={{ fontSize: 20 }} />}
                  onClick={() => window.open(`/prompt-builder/${templateSlug}`, "_blank")}
                >
                  Chain of Thoughts Builder
                </BaseButton>
              )}
              <BaseButton
                variant="text"
                color="custom"
                sx={btnStyle}
                startIcon={<VisibilityOutlined sx={{ fontSize: 20 }} />}
                onClick={() => window.open(`/prompt/${templateSlug}`, "_blank")}
              >
                Preview
              </BaseButton>
            </>
          )}
          <BaseButton
            variant="text"
            color="custom"
            sx={btnStyle}
            startIcon={<CloudOutlined sx={{ fontSize: 20 }} />}
            disabled={isSaving}
            onClick={handleSaveTemplate}
          >
            Save
          </BaseButton>

          {status === "DRAFT" && pathname !== "/prompt-builder/create" && (
            <BaseButton
              variant="contained"
              color="custom"
              sx={{
                ...btnStyle,
                border: "none",
                bgcolor: "secondary.main",
                color: "onPrimary",
              }}
              startIcon={<RocketLaunchOutlined sx={{ fontSize: 27 }} />}
              disabled={isSaving}
              onClick={handlePublishTemplate}
            >
              Publish
            </BaseButton>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

const btnStyle = {
  color: "secondary.main",
  fontSize: 14,
  p: "6px 16px",
  borderRadius: "50px",
  ":hover": {
    bgcolor: "action.hover",
  },
};

export default Header;
