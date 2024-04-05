import { Skeleton, Stack, SxProps } from "@mui/material";

interface Props {
  count?: number;
  sx?: SxProps;
}

export default function CardDocumentTemplatePlaceholder({ count = 12, sx }: Props) {
  return Array.from({ length: count }).map((_, idx) => (
    <Stack
      key={idx}
      gap={2}
      sx={{
        minWidth: { xs: 190, md: 246 },
        height: "100%",
        ...sx,
      }}
    >
      <Skeleton
        variant="rounded"
        sx={{
          width: { xs: 155, md: 246 },
          height: { xs: 135, md: 191 },
          borderRadius: "16px",
        }}
      />
      <Skeleton
        variant="text"
        sx={{
          width: "60%",
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
