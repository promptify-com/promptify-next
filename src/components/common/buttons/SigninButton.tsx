import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { LogoApp } from "@/assets/icons/LogoApp";

export const SigninButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      onClick={onClick}
      variant={"contained"}
      startIcon={
        <LogoApp
          width={18}
          color="white"
        />
      }
      sx={{
        flex: 1,
        p: "10px 25px",
        fontWeight: 500,
        borderColor: "primary.main",
        borderRadius: "999px",
        bgcolor: "primary.main",
        color: "onPrimary",
        whiteSpace: "pre-line",
        ":hover": {
          bgcolor: "surface.1",
          color: "primary.main",
        },
      }}
    >
      <Typography
        ml={2}
        color={"inherit"}
      >
        Sign in or Create an account
      </Typography>
    </Button>
  );
};

export default SigninButton;
