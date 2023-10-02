import { Skeleton, Box, Stack, Divider } from "@mui/material";

export default function BuilderPromptPlaceholder({ count = 1 }) {
  return Array.from({ length: count }).map((_, index) => (
    <Box
      sx={{
        bgcolor: "surface.1",
        m: "24px 0 !important",
        borderRadius: "16px !important",
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        p={"12px 24px"}
      >
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "40%",
            height: "24px",
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "30%",
            height: "24px",
          }}
        />
      </Stack>
      <Divider sx={{ borderColor: "surface.3" }} />
      <Box p={"12px 24px"}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
        >
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "10%",
              height: "24px",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "10%",
              height: "24px",
            }}
          />
        </Stack>
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            height: "224px",
          }}
        />
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{
            height: "42px",
            borderRadius: "999px",
          }}
        />
      </Box>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        p={"12px 24px"}
      >
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "50%",
            height: "24px",
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "30%",
            height: "24px",
          }}
        />
      </Stack>
    </Box>
  ));
}
