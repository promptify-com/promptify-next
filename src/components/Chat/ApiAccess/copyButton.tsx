import React from "react";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import Button from "@mui/material/Button";

interface Props {
  data: string;
}

export default function CopyButton({ data }: Props) {
  const [copy, result] = useCopyToClipboard();

  return (
    <Button
      sx={{
        p: { xs: 0, md: "8px 16px" },
        color: "onSurface",
        fontSize: 14,
        fontWeight: 500,
        ":hover": { bgcolor: "action.hover" },
      }}
      onClick={() => copy(data)}
    >
      Copy
    </Button>
  );
}
