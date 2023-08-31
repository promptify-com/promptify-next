import { Box, Skeleton, Stack } from "@mui/material";

export default function DetailsCardPlaceholder() {
  return (
    <Stack
      gap={2}
      direction={"column"}
      sx={{
        bgcolor: "surface.1",
        p: "16px",
        width: `calc(100% - 32px)`,
        height: "fit-content",
      }}
    >
      <Skeleton
        variant="rectangular"
        height={226}
        width={"100%"}
        sx={{
          borderRadius: "16px",
        }}
        animation="wave"
      />
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        flex={1}
        gap={1}
      >
        <Box>
          <Skeleton
            animation="wave"
            height={15}
            width="100px"
          />
          <Skeleton
            animation="wave"
            height={15}
            width="150px"
          />
        </Box>

        <Skeleton
          variant="rectangular"
          width="90px"
          sx={{
            display: { xs: "none", md: "flex" },
            p: "6px 16px",
            color: "primary.main",
            borderRadius: `10px `,
          }}
          animation="wave"
        />
      </Stack>
    </Stack>
  );
}
