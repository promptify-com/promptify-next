import PlayArrow from "@mui/icons-material/PlayArrow";
import PlayCircle from "@mui/icons-material/PlayCircle";
import { SxProps } from "@mui/material";
import Button from "@mui/material/Button";

interface Props {
  title: string;
  onClick: () => void;
  sx?: SxProps;
}

export default function RunButton({ title, onClick, sx }: Props) {
  return (
    <Button
      onClick={onClick}
      startIcon={<PlayArrow />}
      variant={"contained"}
      sx={{
        height: "22px",
        maxWidth: "200px",
        p: { xs: "12px", md: "15px" },
        fontSize: { xs: 12, md: 15 },
        lineHeight: "110%",
        letterSpacing: "0.2px",
        fontWeight: 500,
        bgcolor: "primary.main",
        borderColor: "primary.main",
        borderRadius: "99px",
        color: "onPrimary",
        ":hover": {
          bgcolor: "surface.1",
          color: "primary.main",
        },
        ...sx,
      }}
    >
      {title}
    </Button>
  );
}
