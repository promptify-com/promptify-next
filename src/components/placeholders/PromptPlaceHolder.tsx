import { Skeleton, Stack, Box, Grid } from "@mui/material";
import DetailsCardPlaceholder from "./DetailsCardPlaceholder";
import TabsAndFormPlaceholder from "./TabsAndFormPlaceholder";

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
          <DetailsCardPlaceholder />
          <TabsAndFormPlaceholder />
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
