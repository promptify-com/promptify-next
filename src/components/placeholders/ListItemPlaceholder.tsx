import { Box, Skeleton } from "@mui/material";

export default function ListItemPlaceholder() {
  return (
    <Box
      sx={{
        minHeight: 48,
        mx: 1,
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        p: "8px",
        width: "100%",
      }}
    >
      <Box>
        <Skeleton
          animation="wave"
          variant="circular"
          width={65}
          height={50}
          sx={{
            borderRadius: "16px",
          }}
        />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
      >
        <Skeleton
          variant="text"
          animation="wave"
          width="80%"
          height={20}
        />
        <Skeleton
          variant="text"
          animation="wave"
          width="60%"
          height={20}
        />
      </Box>
    </Box>
  );
}
