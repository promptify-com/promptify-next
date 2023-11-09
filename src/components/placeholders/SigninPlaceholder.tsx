import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

export default function SigninPlaceholder({ signup = false }) {
  return (
    <Box
      display="flex"
      sx={{
        height: "100vh",
        overflowY: { xs: "hidden", sm: "auto" },
        width: "100%",
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      {signup ? (
        <Box
          width="100%"
          maxWidth={{ xs: "100%", sm: "50%" }}
          padding={{ xs: "16px", sm: "24px" }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Grid
            container
            spacing={1}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <Grid
                item
                xs={6}
                sm={6}
                key={index}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="16px"
                  border="2px solid #dfdfdf"
                  width="80%"
                  height={180}
                >
                  <Skeleton
                    variant="circular"
                    width={80}
                    height={80}
                    animation="wave"
                    sx={{ borderRadius: "100px" }}
                  />
                  <Skeleton
                    variant="text"
                    width="70%"
                    height={16}
                    animation="wave"
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Grid
          sx={{
            width: { xs: "100%", lg: "50%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid
            className="button-style"
            sx={{
              height: { xs: "100%", sm: "70vh" },
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: { xs: "center", sm: "flex-start" },
              flexDirection: "column",
              gap: { xs: "1em", sm: "2em" },
              marginBottom: { xs: "1em", sm: 0 },
            }}
          >
            <Grid
              sx={{
                display: "flex",
                alignItems: { xs: "center", sm: "flex-start" },
                width: "100%",
                flexDirection: "column",
                gap: "1em",
              }}
            >
              <Skeleton
                variant="text"
                width="50%"
                height={40}
                animation="wave"
              />
              <Skeleton
                variant="text"
                width="30%"
                height={30}
                animation="wave"
              />
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width="80%"
                  height={50}
                  animation="wave"
                  sx={{ borderRadius: "25px" }}
                />
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}

      <Grid
        sx={{
          width: { xs: "100%", sm: "50%" },
          display: { xs: "flex", sm: "none", lg: "flex" },
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <Box
          sx={{
            padding: { xs: "0px", sm: "24px" },
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
            sx={{ borderRadius: "25px" }}
          />
        </Box>
      </Grid>
    </Box>
  );
}
