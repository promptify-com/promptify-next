import useBrowser from "@/hooks/useBrowser";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function CardTemplatePlaceholder({ count = 12, isVertical = true }) {
  const { isMobile } = useBrowser();
  return (
    <Grid
      container
      spacing={1}
      px={"16px"}
    >
      {Array.from({ length: count }).map((_, index) => (
        <>
          {isVertical ? (
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
          ) : (
            <Grid
              key={index}
              item
              xs={12}
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
          )}
        </>
      ))}
      ;
    </Grid>
  );
}
