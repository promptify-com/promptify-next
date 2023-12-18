import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function AvatarWithInitials({ title, variant = "b" }: { title: string; variant?: string }) {
  const getInitials = () => {
    const words = title.split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return words[0][0].toUpperCase();
  };
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        bgcolor: "primary.main",
        borderRadius: "8px",
      }}
    >
      <Typography
        color={"white"}
        fontSize={"14"}
      >
        {getInitials()}
      </Typography>

      {variant === "b" && (
        <Box
          position={"absolute"}
          width={"10px"}
          height={"10px"}
          borderRadius={"4px 0px 8px 0px"}
          bgcolor={"surface.1"}
          bottom={-0.5}
          right={-1}
        />
      )}
    </Box>
  );
}

export default AvatarWithInitials;
