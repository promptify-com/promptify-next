import PlayCircle from "@mui/icons-material/PlayCircle";
import Button from "@mui/material/Button";

interface Props {
  title: string;
  onClick: () => void;
}

export default function RunButton({ title, onClick }: Props) {
  return (
    <Button
      onClick={onClick}
      endIcon={<PlayCircle />}
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
        color: "onPrimary",
        ":hover": {
          bgcolor: "surface.1",
          color: "primary.main",
        },
      }}
    >
      {title}
    </Button>
  );
}
