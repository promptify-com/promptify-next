import { Grid, Box, Skeleton } from "@mui/material";

export default function DeploymentPlaceholder({ count = 6 }) {
  const display = { xs: "none", md: "flex" };
  return Array.from({ length: count }).map((_, index) => (
    <Grid
      key={index}
      item
      sx={{ mb: 2 }}
    >
      <Box
        sx={{
          borderRadius: "16px",
          p: "8px",
        }}
      >
        <Grid
          display={"flex"}
          alignItems={"center"}
          gap={"16px"}
          sx={{ width: { xs: 200, md: "100%" } }}
        >
          <Grid
            width={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box sx={{ display, width: "15%" }}>
              <Skeleton
                sx={{ display, width: "65%" }}
                animation="wave"
              />
            </Box>
            <Box
              display={"flex"}
              justifyContent={"start"}
              width={{ xs: "100%", sm: "65%" }}
            >
              <Box sx={{ display, width: "65%" }}>
                <Skeleton
                  sx={{ display, width: "75%" }}
                  animation="wave"
                />
              </Box>

              <Box sx={{ display, alignItems: "center", justifyContent: "space-around", width: "50%" }}>
                {Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    sx={{ width: "20%" }}
                    animation="wave"
                  />
                ))}
              </Box>
            </Box>
            <Box
              display={{ xs: "none", md: "flex" }}
              justifyContent={"end"}
              gap={1}
            >
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="circular"
                  animation="wave"
                  sx={{ width: "20px", height: "20px" }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
        <Grid
          gap={0.5}
          sx={{ width: "100%" }}
          display={{ xs: "flex", md: "none" }}
          flexDirection={"column"}
        >
          <Grid
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: "20%",
                height: 20,
                marginBottom: "4px",
                fontSize: "18px",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: "20%",
                height: 30,
                marginBottom: "4px",
                fontSize: "18px",
              }}
            />
          </Grid>
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "90%",
              height: 20,
            }}
          />
          <Grid
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: "20%",
                height: 20,
                marginBottom: "4px",
                fontSize: "18px",
              }}
            />
            <Box
              display={"flex"}
              justifyContent={"end"}
              gap={1}
            >
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="circular"
                  animation="wave"
                  sx={{ width: "20px", height: "20px" }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  ));
}
