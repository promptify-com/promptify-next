import { Skeleton, Stack, Box, Grid } from "@mui/material";

export default function PromptPlaceholder() {
  return (
    <Grid
      mt={{ xs: 7, md: 0 }}
      container
      sx={{
        mx: "auto",
        height: {
          xs: "calc(100svh - 56px)",
          md: "calc(100svh - (90px + 32px))",
        },
        width: { md: "calc(100% - 65px)" },
        bgcolor: "surface.2",
        borderTopLeftRadius: { md: "16px" },
        borderTopRightRadius: { md: "16px" },
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "401px" },
          overflow: "auto",
          position: "relative",
          top: 0,
          left: 0,
          scrollbarColor: "red",
          right: 0,
          zIndex: 999,
          bgcolor: "background.default",
        }}
      >
        <Stack height={"100%"}>
          {detailsCard()}
          {tabsAndForm()}
        </Stack>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          borderLeft: "1px solid #e6e6e6",
          bgcolor: "background.default",
          display: { xs: "none", md: "block" },
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #e6e6e6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Skeleton animation="wave" height={25} width="100px" sx={{}} />
          <Skeleton
            variant="circular"
            animation="wave"
            height={35}
            width={35}
          />
        </Box>
      </Box>
    </Grid>
  );
}

const detailsCard = (min = false) => (
  <Stack
    gap={2}
    direction={"column"}
    sx={{
      bgcolor: "surface.1",
      p: min ? "10px 14px" : "16px",
      width: `calc(100% - 32px)`,
      height: "fit-content",
      borderTop: min ? `1px solid black` : "none",
      borderBottom: min ? `1px solid black` : "none",
    }}
  >
    <Skeleton
      variant="rectangular"
      height={226}
      width={"100%"}
      sx={{
        borderRadius: "16px",
      }}
      animation="wave"
    />
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      flex={1}
      gap={1}
    >
      <Box>
        <Skeleton animation="wave" height={15} width="100px" />
        <Skeleton animation="wave" height={15} width="150px" />
      </Box>

      <Skeleton
        variant="rectangular"
        width="90px"
        sx={{
          display: { xs: "none", md: "flex" },
          p: "6px 16px",
          color: "primary.main",
          borderRadius: `10px `,
        }}
        animation="wave"
      />
    </Stack>
  </Stack>
);

const tabsAndForm = () => (
  <Stack flex={1}>
    <Box
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton
          variant="text"
          key={index}
          animation="wave"
          height={20}
          width="100px"
          sx={{ mb: 2 }}
        />
      ))}
    </Box>

    <Box
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} animation="wave" height={45} width="90%" />
      ))}
    </Box>

    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Skeleton
        animation="wave"
        height={60}
        width="70%"
        sx={{
          border: "none",
          borderRadius: "999px",
        }}
      />
    </Box>
  </Stack>
);
