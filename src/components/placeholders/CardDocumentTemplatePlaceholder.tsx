import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { SxProps } from "@mui/material";

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
        width: { xs: 155, md: 246 },
        height: { xs: 135, md: 191 },
        ...sx,
      }}
    >
      <Skeleton
        variant="rounded"
        sx={{
          width: "100%",
          height: "80%",
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
