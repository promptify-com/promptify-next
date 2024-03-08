import ArrowCircleUp from "@/assets/icons/ArrowCircleUp";
import Button from "@mui/material/Button";

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

function RunButton({ onClick, disabled = false }: Props) {
  return (
    <Button
      variant="text"
      sx={{
        bgcolor: "primary.main",
        color: "onPrimary",
        border: "none",
        "&:hover": {
          bgcolor: "primary.main",
          opacity: 0.9,
        },
        ":disabled": {
          bgcolor: "surface.5",
          cursor: "not-allowed",
        },
      }}
      disabled={disabled}
      endIcon={<ArrowCircleUp color={disabled ? "gray" : "white"} />}
      onClick={onClick}
    >
      Start
    </Button>
  );
}

export default RunButton;
