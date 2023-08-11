import { Box, Skeleton } from "@mui/material";

export default function ParagraphPlaceholder({ count = 12 }) {
  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "16px",
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          sx={{
            marginBottom: "16px",
            ":last-child": { marginBottom: 0 },
          }}
        >
          <Skeleton
            animation="wave"
            variant="text"
            width={"100%"}
            height={16}
            sx={{ marginBottom: "8px" }}
          />
          <Skeleton
            animation="wave"
            variant="text"
            width={"80%"}
            height={16}
            sx={{ marginBottom: "8px" }}
          />
          <Skeleton
            animation="wave"
            variant="text"
            width={"90%"}
            height={16}
            sx={{ marginBottom: "8px" }}
          />
          <Skeleton animation="wave" variant="text" width={"70%"} height={16} />
        </Box>
      ))}
    </Box>
  );
}
