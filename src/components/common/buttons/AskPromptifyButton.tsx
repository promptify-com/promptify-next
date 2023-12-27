import BaseButton from "@/components/base/BaseButton";
import { alpha } from "@mui/material";
import { redirectToPath } from "@/common/helpers";
import { theme } from "@/theme";

export default function AskPromptifyButton({ keyword }: { keyword: string }) {
  return (
    <BaseButton
      variant="contained"
      color="primary"
      sx={btnStyle}
      onClick={() => {
        redirectToPath("/", { q: keyword });
      }}
    >
      Ask Promptify
    </BaseButton>
  );
}

const btnStyle = {
  color: "surface.1",
  fontSize: 14,
  p: "6px 16px",
  borderRadius: "8px",
  border: `1px solid ${alpha(theme.palette.onSurface, 0.2)}`,
  ":hover": {
    bgcolor: "action.hover",
  },
};
