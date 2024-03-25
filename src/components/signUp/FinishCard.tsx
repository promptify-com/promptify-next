import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface Props {
  children: React.ReactNode;
  title: string;
}

const FinishCard = ({ children, title }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "528px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "var(--2, 16px)",
      }}
    >
      <Typography
        sx={{
          color: "var(--onSurface, var(--onSurface, #1B1B1F))",
          fontFeatureSettings: "'clig' off, 'liga' off",
          fontFamily: "Poppins",
          fontSize: "20px",
          fontStyle: "normal",
          fontWeight: "400",
          lineHeight: "120%",
          letterSpacing: "0.17px",
        }}
      >
        {title}
      </Typography>

      {children}
    </Box>
  );
};

export default FinishCard;
