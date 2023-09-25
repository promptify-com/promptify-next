import React from "react";
import { Box, Chip, Stack, Typography, alpha } from "@mui/material";
import { CloudOutlined, ModeEdit, RocketLaunch, VisibilityOutlined } from "@mui/icons-material";
import BaseButton from "../base/BaseButton";
import { TemplateStatus } from "@/core/api/dto/templates";
import { theme } from "@/theme";

interface IHeader {
  onDrawerOpen: () => void;
  onSave: () => void;
  onPublish: () => void;
  title: string;
  status: TemplateStatus;
  templateSlug?: string;
}

export const Header = ({ onDrawerOpen, onSave, onPublish, title, status, templateSlug }: IHeader) => {
  return (
    <Box
      bgcolor={"surface.1"}
      display="flex"
      alignItems="center"
      p={"16px 24px"}
      justifyContent="space-between"
      border={`1px solid ${theme.palette.surface[3]}`}
    >
      <Box
        display={"flex"}
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
      </Box>
      <Box
        display={"flex"}
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
          onClick={() => onSave()}
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
            onClick={() => onPublish()}
          >
            Publish
          </BaseButton>
        )}
      </Box>
    </Box>
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
