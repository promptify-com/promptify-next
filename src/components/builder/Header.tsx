import React from "react";
import { Box, Button } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { EditableTextField } from "@/components/blocks";

interface IHeader {
  updateTemplateTitle: (value: string) => void;
  onSave: () => void;
  title: string;
}

export const Header = ({ updateTemplateTitle, onSave, title }: IHeader) => {
  return (
    <Box
      bgcolor={"#262626"}
      height="80px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box ml="50px">
        <EditableTextField value={title} setValue={updateTemplateTitle} />
      </Box>

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
