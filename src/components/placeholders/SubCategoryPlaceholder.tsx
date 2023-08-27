import { Box, Skeleton } from "@mui/material";

import ParagraphPlaceholder from "@/components/placeholders/ParagraphPlaceholder";
import CardTemplatePlaceholder from "@/components/placeholders/CardTemplatePlaceHolder";

export default function SubCategoryPlaceholder() {
  return (
    <Box>
      <Skeleton
        animation="wave"
        sx={{ mb: 1, width: { xs: "40%", md: "10%" } }}
      />
      <ParagraphPlaceholder count={1} />
      <Box
        display="flex"
        gap={2}
        mb={2}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={1}
            sx={{
              bgcolor: "#f5f4f9",
              p: 1,
              borderRadius: 16,
              width: { xs: "100%", md: "10%" },
            }}
          >
            <Skeleton
              variant="circular"
              width={30}
              height={30}
              animation="wave"
            />
            <Skeleton
              variant="text"
              animation="wave"
              width={140}
            />
          </Box>
        ))}
      </Box>
      <CardTemplatePlaceholder count={8} />
    </Box>
  );
}
