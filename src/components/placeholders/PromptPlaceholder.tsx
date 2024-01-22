import { alpha } from "@mui/material";
import { theme } from "@/theme";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

function PromptPlaceholder() {
  return (
    <Stack
      height={{ xs: "calc(100svh - 90px)", md: "calc(100svh - 180px)" }}
      gap={"2px"}
      sx={{
        position: "relative",
        pb: "90px",
      }}
    >
      <Stack
        display={"flex"}
        justifyContent={"flex-end"}
        gap={2}
        height={{ xs: "100%", md: "calc(100% - 66px)" }}
        bgcolor={"surface.1"}
      >
        <Stack
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            bgcolor: "surface.1",
          }}
        >
          <div style={{ marginTop: "auto" }}></div>
          <Box mx={{ xs: "16px", md: "40px" }}>
            <Stack
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                borderRadius: { xs: "42px", md: "48px" },
                p: { xs: "14px", md: 0 },
                position: "relative",
              }}
            >
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"flex-start"}
                gap={1}
              >
                <Stack
                  gap={2}
                  sx={{
                    p: { md: "48px 72px 48px 54px" },
                  }}
                >
                  <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                      width: { xs: "80px", md: "100px" },
                      height: "25px",
                    }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                      width: { xs: "115px", md: "450px" },
                      height: { xs: "35px", md: "50px" },
                    }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                      width: { xs: 0, md: "550px" },
                      height: { xs: 0, md: "50px" },
                    }}
                  />
                </Stack>

                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  sx={{
                    width: { xs: "101px", md: "351px" },
                    height: { xs: "72px", md: "262px" },
                    borderRadius: "48px",
                  }}
                />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Stack>

      <Stack mx={{ xs: "16px", md: "40px" }}>
        <Divider
          sx={{
            fontSize: 12,
            fontWeight: 400,
            color: "onSurface",
            opacity: 0.5,
          }}
        >
          New messages
        </Divider>

        <Stack
          py={{ xs: "8px", md: "16px" }}
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"16px"}
        >
          <Skeleton
            variant="circular"
            animation="wave"
            sx={{
              width: { xs: "40px", md: "48px" },
              height: { xs: "40px", md: "48px" },
            }}
          />

          <Stack
            sx={{
              display: "flex",
              flex: "1 1 0%",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: { xs: "100px", md: "150px" },
                height: "25px",
              }}
            />

            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: "90%",
                height: "25px",
              }}
            />
          </Stack>
        </Stack>
      </Stack>

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          width: { xs: "100%", md: "calc(100% - 80px)" },
          p: "16px",
          boxSizing: "border-box",
        }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            height: "44px",
            borderRadius: "99px",
            bgcolor: "surface.3",
          }}
        />
      </Box>
    </Stack>
  );
}

export default PromptPlaceholder;
