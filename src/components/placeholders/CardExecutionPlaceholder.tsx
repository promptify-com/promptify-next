import { Box, Card, Skeleton, Stack } from "@mui/material";

export const CardExecutionPlaceholder = () => {
  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: "surface.3",
        borderRadius: "8px",
        p: "8px",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={1}
        py={"8px"}
      >
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "95%",
            m: "auto",
            height: 20,
          }}
        />
      </Stack>
      <Box
        sx={{
          bgcolor: "surface.1",
          p: "16px 12px",
          borderRadius: "10px",
          height: "15svh",
          overflow: "hidden",
        }}
      >
        <Skeleton
          animation="wave"
          height={10}
          style={{ marginBottom: 6 }}
        />
        <Skeleton
          animation="wave"
          height={10}
          style={{ marginBottom: 6 }}
        />
        <Skeleton
          animation="wave"
          height={10}
          width="80%"
        />
      </Box>
    </Card>
  );
};
