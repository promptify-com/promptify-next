import useBrowser from "@/hooks/useBrowser";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function CardTemplatePlaceholder({ count = 12 }) {
  const { isMobile } = useBrowser();
  return (
    <Grid
      container
      spacing={1}
      px={"16px"}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Grid
          key={index}
          item
          xs={6}
          sm={6}
          md={5}
          lg={3}
        >
          <Card
            sx={{
              minWidth: { xs: "50%", sm: !isMobile ? "210px" : "auto" },
              bgcolor: "surface.2",
              borderRadius: "16px",
              position: "relative",
              overflow: "hidden",
            }}
            elevation={0}
          >
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{
                zIndex: 0,
                borderRadius: "16px",
                width: "100%",
                height: "155px",
                bgcolor: "surfaceContainerHigher",
              }}
            />
            <Stack
              direction={"column"}
              justifyContent={"space-between"}
              padding={"8px"}
            >
              <Skeleton
                width={"120px"}
                variant="text"
                animation="wave"
                sx={{
                  bgcolor: "surfaceContainerHigher",
                }}
              />
              <Stack
                gap={1}
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  gap={2}
                >
                  <Skeleton
                    variant="text"
                    sx={{ width: "32px", bgcolor: "surfaceContainerHigher" }}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ width: "32px", bgcolor: "surfaceContainerHigher" }}
                  />
                </Stack>

                <Skeleton
                  variant="text"
                  sx={{ width: "112px", bgcolor: "surfaceContainerHigher" }}
                />
              </Stack>
            </Stack>
          </Card>
        </Grid>
      ))}
      ;
    </Grid>
  );
}
