import React from "react";
import { Box, Chip, Stack, Typography, Tooltip, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { ModeEdit, Publish, PreviewOutlined } from "@mui/icons-material";
import BaseButton from "../base/BaseButton";
import { TemplateStatus } from "@/core/api/dto/templates";

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
      bgcolor={"#262626"}
      height="80px"
      display="flex"
      alignItems="center"
      px={{ xs: "10px", md: "50px" }}
      justifyContent="space-between"
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
          sx={{ color: "white" }}
        >
          <Typography
            sx={{ color: "white", fontSize: "1rem" }}
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <ModeEdit
            sx={{ cursor: "pointer" }}
            onClick={onDrawerOpen}
          />
        </Stack>

        {status && (
          <Chip
            label={status}
            sx={{ color: "surface.3" }}
            color={status === "PENDING_REVIEW" ? "info" : "primary"}
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
          <Tooltip title="Preview">
            <IconButton
              sx={{
                display: { xs: "none", md: "inline-flex" },
                bgcolor: "surface.2",
                border: "none",
                color: "onSurface",
                "&:hover": {
                  bgcolor: "surface.3",
                  color: "onSurface",
                },
              }}
              onClick={() => {
                window.open(`/prompt/${templateSlug}`, "_blank");
              }}
            >
              <PreviewOutlined />
            </IconButton>
          </Tooltip>
        )}
        <BaseButton
          variant="contained"
          color="custom"
          customColor="black"
          sx={{
            border: "1px solid black",
            fontSize: "0.8rem",
            bgcolor: "black",
            minWidth: 110,
            justifyContent: "center",
            color: "white",
          }}
          startIcon={<PlayArrowIcon sx={{ fontSize: "1rem" }} />}
          onClick={() => onSave()}
        >
          Save
        </BaseButton>

        {status === "DRAFT" && (
          <BaseButton
            variant="contained"
            color="custom"
            customColor="white"
            sx={{ color: "onSurface" }}
            onClick={() => onPublish()}
          >
            <Publish sx={{ fontSize: "1rem", mr: 1 }} />
            Publish
          </BaseButton>
        )}
      </Box>
    </Box>
  );
};
