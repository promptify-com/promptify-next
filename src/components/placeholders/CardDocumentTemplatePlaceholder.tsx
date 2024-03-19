import { Skeleton, Stack } from "@mui/material";

export default function CardDocumentTemplatePlaceholder({ count = 12 }) {
  return Array.from({ length: count }).map((_, idx) => (
    <Stack
      key={idx}
      gap={2}
      sx={{
        minWidth: "256px",
        height: "calc(100% - 24px)",
      }}
    >
      <Skeleton
        variant="rounded"
        sx={{
          width: { xs: "256px", sm: "100%" },
          height: { xs: "191px", sm: "191px" },
          borderRadius: "16px",
        }}
      />
      <Skeleton
        variant="text"
        sx={{
          width: "90%",
          height: 24,
        }}
      />
      <Skeleton
        variant="text"
        sx={{
          width: "30%",
          height: 19.5,
        }}
      />
    </Stack>
  ));
}
