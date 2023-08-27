import { Box, Grid, Skeleton } from "@mui/material";

export default function CategoriesPlaceholder({ count = 12 }) {
  return Array.from({ length: count }).map((_, index) => (
    <Grid
      item
      key={index}
    >
      <Box
        sx={{
          maxWidth: "200px",
          width: "200px",
          bgcolor: "transparent",
          borderRadius: "27px",
          overflow: "hidden",
          transition: "opacity 0.3s ease",
        }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            zIndex: 1,
            borderRadius: "16px",
            width: "100%",
            height: "200px",
          }}
        />
        <Box
          sx={{
            p: 2,
            textAlign: "center",
          }}
        >
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "80%",
              height: 20,
              marginBottom: "4px",
              fontSize: "18px",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{ width: "60%", height: 16, fontSize: "14px" }}
          />
        </Box>
      </Box>
    </Grid>
  ));
}
