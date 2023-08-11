import { Box, Skeleton } from "@mui/material";

export default function ParagraphPlaceholder({ count = 12 }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          animation="wave"
          variant="text"
          width={"60%"}
          height={16}
          sx={{ marginBottom: "8px" }}
        />
      ))}
    </Box>
  );
}
