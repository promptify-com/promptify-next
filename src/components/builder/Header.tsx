import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { ModeEdit } from "@mui/icons-material";

interface IHeader {
  onTitleHover: () => void;
  onSave: () => void;
  title: string;
}

export const Header = ({ onTitleHover, onSave, title }: IHeader) => {
  return (
    <Box
      bgcolor={"#262626"}
      height="80px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack direction={"row"} alignItems={"center"} gap={1} 
        sx={{ ml: "50px", color: "white" }}
      >
        <Typography sx={{ color: "white", fontSize: "1rem" }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <ModeEdit sx={{ cursor: "pointer" }} 
          onClick={onTitleHover}
        />
      </Stack>

      <Button
        sx={{
          borderRadius: "10px",
          mr: "50px",
          fontSize: "0.8rem",
          fontWeight: 600,
          bgcolor: "black",
          minWidth: 250,
          justifyContent: "start",
          color: "white",
        }}
        startIcon={<PlayArrowIcon sx={{ fontSize: "1rem" }} />}
        onClick={onSave}
      >
        Save
      </Button>
    </Box>
  );
};
