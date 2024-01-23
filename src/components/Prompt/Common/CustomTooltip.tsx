import { ReactNode, useState } from "react";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

interface CustomTooltipProps {
  title: React.ReactNode;
  children: ReactNode;
}

function CustomTooltip({ title, children }: CustomTooltipProps) {
  const [openTooltip, setOpenTooltip] = useState(false);

  return (
    <Tooltip
      open={openTooltip}
      onClose={() => setOpenTooltip(false)}
      onOpen={() => setOpenTooltip(true)}
      arrow
      PopperProps={commonPopperProps}
      title={title}
    >
      <Stack onClick={() => setOpenTooltip(!openTooltip)}>{children}</Stack>
    </Tooltip>
  );
}

export default CustomTooltip;

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
