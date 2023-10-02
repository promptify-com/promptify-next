import React, { useRef, useState } from "react";
import { Avatar, Box, Chip, Stack, Typography, alpha } from "@mui/material";
import { CloudOutlined, ModeEdit, RocketLaunch, VisibilityOutlined } from "@mui/icons-material";
import BaseButton from "../base/BaseButton";
import { TemplateStatus } from "@/core/api/dto/templates";
import { theme } from "@/theme";
import { useSelector } from "react-redux";
import { isValidUserFn } from "@/core/store/userSlice";
import { RootState } from "@/core/store";
import { ProfileDropDown } from "../ProfileMenu";

interface IHeader {
  onDrawerOpen: () => void;
  onSave: () => void;
  onPublish: () => void;
  title: string;
  status: TemplateStatus;
  templateSlug?: string;
}

export const Header = ({ onDrawerOpen, onSave, onPublish, title, status, templateSlug }: IHeader) => {
  const isValidUser = useSelector(isValidUserFn);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const menuAnchorRef = useRef<HTMLDivElement | null>(null);
  const [isMenuShown, setIsMenuShown] = useState(false);
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
            <Typography
              sx={{ color: "onSurface", fontSize: "16px" }}
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <ModeEdit
              sx={{ cursor: "pointer", fontSize: "16px" }}
              onClick={onDrawerOpen}
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
            <BaseButton
              variant="text"
              color="custom"
              sx={btnStyle}
              startIcon={<VisibilityOutlined sx={{ fontSize: 20 }} />}
              onClick={() => window.open(`/prompt/${templateSlug}`, "_blank")}
            >
              Preview
            </BaseButton>
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

          {status === "DRAFT" && (
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
      {isValidUser && (
        <Box>
          <Avatar
            ref={menuAnchorRef}
            onClick={() => setIsMenuShown(!isMenuShown)}
            src={currentUser?.avatar}
            alt={currentUser?.first_name}
            sx={{
              ml: "auto",
              cursor: "pointer",
              bgcolor: "black",
              borderRadius: { xs: "24px", sm: "36px" },
              width: { xs: "24px", sm: "40px" },
              height: { xs: "24px", sm: "40px" },
              fontStyle: "normal",
              textAlign: "center",
              fontWeight: 400,
              fontSize: { sm: "30px" },
              textTransform: "capitalize",
              lineHeight: "20px",
              letterSpacing: "0.14px",
            }}
          />
          <ProfileDropDown
            anchorElement={menuAnchorRef.current}
            open={isMenuShown}
            onToggle={() => setIsMenuShown(!isMenuShown)}
            onClose={() => setIsMenuShown(false)}
          />
        </Box>
      )}
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
