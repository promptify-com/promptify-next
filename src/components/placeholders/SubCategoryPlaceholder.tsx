import { Box, Skeleton } from "@mui/material";

export default function SubCategoryPlaceholder() {
  return (
    <Box>
      <Skeleton animation="wave" width="10%" sx={{ mb: 1 }} />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        gap={2}
      >
        {[1, 2, 3].map((_, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={1}
            width="15%"
            sx={{
              bgcolor: "#f5f4f9",
              p: 1,
              borderRadius: 15,
            }}
          >
            <Skeleton
              variant="circular"
              width={60}
              height={40}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width="100%"
              height={30}
              animation="wave"
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
