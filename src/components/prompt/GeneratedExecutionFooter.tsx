import { isDesktopViewPort } from "@/common/helpers";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

interface Props {
  title: string;
  order: number;
}

export default function GeneratedExecutionFooter({ title, order }: Props) {
  const isDesktopView = isDesktopViewPort();

  if (!title || !order) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "sticky",
        bottom: !isDesktopView ? "129px" : 0,
        left: 0,
        right: 0,
        zIndex: 998,
        bgcolor: "surface.1",
      }}
    >
      <Divider sx={{ borderColor: "surface.3" }} />
      <Typography
        sx={{
          padding: "8px 16px 5px",
          textAlign: "right",
          fontSize: 11,
          fontWeight: 500,
          opacity: 0.3,
        }}
      >
        Prompt #{order}: {title}
      </Typography>
    </Box>
  );
}
