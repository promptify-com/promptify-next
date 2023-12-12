import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

interface Props {
  title: string;
  order: number;
}

export default function ExecutionFooter({ title, order }: Props) {
  if (!title || !order) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
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
