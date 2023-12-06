import React, { useState } from "react";
import { alpha } from "@mui/material";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloudOutlined from "@mui/icons-material/CloudOutlined";
import ModeEdit from "@mui/icons-material/ModeEdit";
import RocketLaunch from "@mui/icons-material/RocketLaunch";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import AccountTree from "@mui/icons-material/AccountTree";
import FormatListBulleted from "@mui/icons-material/FormatListBulleted";
import BaseButton from "../base/BaseButton";
import { TemplateStatus } from "@/core/api/dto/templates";
import { theme } from "@/theme";
import { isValidUserFn } from "@/core/store/userSlice";
import { RootState } from "@/core/store";
import { BuilderType } from "@/common/types/builder";
import { BUILDER_TYPE } from "@/common/constants";
import { useAppSelector } from "@/hooks/useStore";
import { ProfileMenu } from "@/components/ProfileMenu";
import { usePathname } from "next/navigation";

interface IHeader {
  onSave: () => void;
  onPublish: () => void;
  title: string;
  status: TemplateStatus;
  templateSlug?: string;
  onEditTemplate: () => void;
  type: BuilderType;
}

export const Header = ({ onSave, onPublish, title, status, templateSlug, onEditTemplate, type }: IHeader) => {
  const isValidUser = useAppSelector(isValidUserFn);
  const currentUser = useAppSelector((state: RootState) => state.user.currentUser);
  const [isSaving, setIsSaving] = useState(false);
  const pathname = usePathname();

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

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={10}
      bgcolor={"surface.1"}
      p={"16px 24px"}
      border={`1px solid ${theme.palette.surface[3]}`}
      zIndex={3}
      position={"relative"}
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
          {templateSlug ? (
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
          ) : null}
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
                bgcolor: "secondary.main",
                color: "onPrimary",
              }}
              startIcon={<RocketLaunch sx={{ fontSize: 20 }} />}
              disabled={isSaving}
              onClick={handlePublishTemplate}
            >
              Publish
            </BaseButton>
          )}
        </Stack>
      </Stack>
      {isValidUser && type === BUILDER_TYPE.USER && <ProfileMenu />}
    </Stack>
  );
};

const btnStyle = {
  color: "secondary.main",
  fontSize: 14,
  p: "6px 16px",
  borderRadius: "8px",
  border: `1px solid ${alpha(theme.palette.onSurface, 0.2)}`,
  ":hover": {
    bgcolor: "action.hover",
  },
};
