import React from "react";
//
import Button from "@mui/material/Button";

interface Props {
  data: string;
}

export default function CopyButton({ data }: Props) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(data);
  };

  return (
    <Button
      sx={{
        p: { xs: 0, md: "8px 16px" },
        color: "onSurface",
        fontSize: 14,
        fontWeight: 500,
        ":hover": {
          bgcolor: "action.hover",
        },
      }}
      onClick={handleCopy}
    >
      Copy
    </Button>
  );
}
