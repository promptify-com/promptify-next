import { Grid, Card, Skeleton } from "@mui/material";

export default function CardTemplatePlaceholder({ count = 6 }) {
  return Array.from({ length: count }).map((_, index) => (
    <Grid
      key={index}
      item
      sx={{ mb: 2 }}
    >
      <Card
        sx={{
          borderRadius: "16px",
          p: "8px",
          bgcolor: "surface.2",
        }}
      >
        <Grid
          display={"flex"}
          flexDirection={{ xs: "column", md: "row" }}
          alignItems={{ xs: "start", md: "center" }}
          justifyContent={"space-between"}
        >
          <Grid
            display={"flex"}
            flexDirection={"row"}
            width={{ xs: "100%", md: "auto" }}
            justifyContent={"space-between"}
            gap={{ xs: "16px", md: 0 }}
            alignItems={"center"}
          >
            <Grid
              display={"flex"}
              alignItems={"center"}
              gap={"16px"}
              sx={{ width: 200 }}
            >
              <Grid>
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  sx={{
                    zIndex: 1,
                    borderRadius: "16px",
                    width: { xs: "98px", sm: "72px" },
                    height: { xs: "73px", sm: "54px" },
                  }}
                />
              </Grid>
              <Grid
                gap={0.5}
                sx={{ width: "100%" }}
                display={"flex"}
                flexDirection={"column"}
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
              </Grid>
            </Grid>
            <Skeleton
              variant="circular"
              animation="wave"
              sx={{
                display: { xs: "flex", md: "none" },
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                bgcolor: "surface.5",
              }}
            />
          </Grid>
          <Grid
            display={"flex"}
            alignItems={{ xs: "end", md: "center" }}
            width={{ xs: "100%", md: "auto" }}
            justifyContent={"space-between"}
            gap={1}
          >
            <Grid
              sx={{
                display: "flex",
                gap: "4px",
              }}
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  animation="wave"
                  variant="text"
                  sx={{ width: "60px", height: 18, fontSize: "14px" }}
                />
              ))}
            </Grid>
            <Skeleton
              variant="circular"
              animation="wave"
              sx={{
                display: { xs: "none", md: "flex" },
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                bgcolor: "surface.5",
              }}
            />
          </Grid>
        </Grid>
      </Card>
    </Grid>
  ));
}
