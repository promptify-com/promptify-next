import React from "react";
//
import { useAppDispatch } from "@/hooks/useStore";
import { setToast } from "@/core/store/toastSlice";
//
import Button from "@mui/material/Button";

interface Props {
  data: string;
}

export default function CopyButton({ data }: Props) {
  const dispatch = useAppDispatch();
  //
  const handleCopy = async () => {
    await navigator.clipboard.writeText(data);
    dispatch(
      setToast({
        message: "Copied to clipboard!",
        severity: "success",
        position: { vertical: "bottom", horizontal: "right" },
      }),
    );
  };

  return (
    <Button
      sx={{
        p: { xs: 0, md: "8px 16px" },
        color: "onSurface",
        fontSize: 14,
        fontWeight: 500,
        ":hover": { bgcolor: "action.hover" },
      }}
      onClick={handleCopy}
    >
      Copy
    </Button>
  );
}
