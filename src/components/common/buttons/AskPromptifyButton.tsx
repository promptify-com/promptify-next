import BaseButton from "@/components/base/BaseButton";
import { alpha } from "@mui/material";
import { redirectToPath } from "@/common/helpers";
import { theme } from "@/theme";
import { useRouter } from "next/router";

export default function AskPromptifyButton({ keyword, actionHandler }: { keyword: string; actionHandler: () => void }) {
  const router = useRouter();

  return (
    <BaseButton
      variant="contained"
      color="primary"
      sx={btnStyle}
      onClick={() => {
        if (router.pathname === "/") {
          router.replace(`/?q=${keyword}`);
          actionHandler();
          return;
        }
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
