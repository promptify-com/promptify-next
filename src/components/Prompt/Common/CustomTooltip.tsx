import React, { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import HelpOutline from "@mui/icons-material/HelpOutline";

interface CustomTooltipProps {
  title: React.ReactNode;
}

function CustomTooltip({ title }: CustomTooltipProps) {
  const [openTooltip, setOpenTooltip] = useState(false);

  const commonPopperProps = {
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, -14],
        },
      },
    ],
  };

  return (
    <Tooltip
      open={openTooltip}
      onClose={() => setOpenTooltip(false)}
      onOpen={() => setOpenTooltip(true)}
      arrow
      PopperProps={commonPopperProps}
      title={title}
    >
      <IconButton
        onClick={() => setOpenTooltip(!openTooltip)}
        sx={{
          opacity: 0.3,
          border: "none",
        }}
      >
        <HelpOutline />
      </IconButton>
    </Tooltip>
  );
}

export default CustomTooltip;
