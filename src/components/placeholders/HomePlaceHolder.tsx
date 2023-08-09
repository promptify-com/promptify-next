import { Box, Grid, Skeleton } from "@mui/material";

import CardTemplatePlaceholder from "./CardTemplatePlaceholder";
import CategoryPlaceholder from "./CategoriesPlaceHolder";

export default function HomePlaceholder() {
  return (
    <LayoutPlaceholder>
      <Box mt={{ xs: 7, md: 0 }} padding={{ xs: "4px 0px", md: "0px 8px" }}>
        <Grid
          gap={"56px"}
          display={"flex"}
          flexDirection={"column"}
          sx={{
            padding: { xs: "16px", md: "32px" },
          }}
        >
          <Grid flexDirection="column" display={"flex"} gap={"56px"}>
            <Grid
              sx={{
                alignItems: "center",
                width: "100%",
              }}
            >
              <Skeleton
                variant="text"
                sx={{
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: 500,
                  fontSize: { xs: "30px", sm: "48px" },
                  lineHeight: { xs: "30px", md: "56px" },
                  color: "#1D2028",
                  marginLeft: { xs: "0px", sm: "0px" },
                  width: "80%", // Adjust the width of the skeleton
                  height: "48px", // Adjust the height of the skeleton
                }}
              />
            </Grid>
            {/* Placeholder for Your Latest Template */}
            <CardTemplatePlaceholder />

            {/* Placeholder for You may like this templates */}
            <CardTemplatePlaceholder />
            <Grid
              sx={{
                alignItems: "center",
                width: "100%",
              }}
            >
              <Skeleton
                variant="text"
                sx={{
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: 500,
                  fontSize: { xs: "30px", sm: "48px" },
                  lineHeight: { xs: "30px", md: "56px" },
                  color: "#1D2028",
                  marginLeft: { xs: "0px", sm: "0px" },
                  width: "80%", // Adjust the width of the skeleton
                  height: "48px", // Adjust the height of the skeleton
                }}
              />
            </Grid>
            {/* Placeholder for Categories Section */}
            <Grid
              display={"flex"}
              flexDirection={"row"}
              gap={"16px"}
              alignItems={"flex-start"}
              alignContent={"flex-start"}
              alignSelf={"stretch"}
              flexWrap={{ xs: "nowrap", md: "wrap" }}
              sx={{
                overflow: { xs: "auto", md: "initial" },
                WebkitOverflowScrolling: { xs: "touch", md: "initial" },
              }}
            >
              <CategoryPlaceholder />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LayoutPlaceholder>
  );
}

// LAYOUT
const LayoutPlaceholder = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Box sx={{ bgcolor: "surface.3", display: "flex" }}>
        {/* SIDEBAR */}
        <Box
          sx={{
            width: { xs: 0, md: "300px" },
          }}
        >
          {/* Empty Placeholder */}
          <Skeleton
            variant="rectangular"
            sx={{
              width: "100%",
              height: "96vh",
              borderRadius: "0px 8px 8px 0px",
            }}
          />
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            minHeight: "100vh",
            maxWidth: {
              xs: "100%",
              md: "80%",
            },
            m: { md: "0px auto 0px auto" },
          }}
        >
          <Box
            sx={{
              position: { xs: "fixed", md: "relative" }, // Sticky position for sidebar in medium screens and above
              top: 0,
              zIndex: 1000,
              width: "100%",
              background: "transparent",
              height: { xs: "58px", md: "90px" },
            }}
          >
            {/* Search Place */}
            <SearchPlace />
          </Box>
          <Box
            bgcolor={{ xs: "surface.1", md: "surface.3" }}
            minHeight={{ xs: "calc(100vh - 60px)", md: "calc(100vh - 90px)" }}
          >
            <Grid display={"flex"} flexDirection={"column"} gap={"16px"}>
              {children}
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  );
};

// SEARCH
const SearchPlace = () => {
  return (
    <Box
      sx={{
        width: "100%",
        position: { xs: "fixed", md: "relative" },
        zIndex: 1000,
        top: { xs: 0, md: 20 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: { xs: "surface.1", md: "surface.3" },
        height: { xs: "58px", md: "50px" },
      }}
    >
      <Grid
        sx={{
          justifyContent: "space-between",
          display: "flex",
          width: "100%",
          gap: "30px",
          padding: { xs: "0 4px ", md: "1.5em 2em" },
          alignItems: "center",
          borderBottom: { xs: "2px solid #E1E2EC", md: "none" },
        }}
      >
        <Grid
          display={{ xs: "flex", md: "none" }}
          width={75}
          p={"0px 10px"}
          alignItems={"center"}
          height={48}
          mt={1}
        >
          <Skeleton
            variant="circular"
            width={23}
            height={23}
            animation={false}
          />
        </Grid>
        <Grid
          display={{ xs: "flex", md: "none" }}
          alignItems={"center"}
          gap={2}
          mr={1}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="circular"
              width={26}
              height={26}
              animation={false}
            />
          ))}
        </Grid>
        <Box
          display={{ xs: "none", md: "flex" }}
          sx={{
            flex: 1,
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Placeholder for search bar */}
          <Skeleton
            variant="text"
            sx={{
              width: "100%",
              //   height: "66px",
              padding: { xs: "0 4px ", md: "1.5em 22em" },
              borderBottom: { xs: "18px solid #E1E2EC", md: "none" },
            }}
            animation={false}
          />
        </Box>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Box sx={{ display: { xs: "none", md: "flex", bgcolor: "red" } }}>
            {/* Placeholder for user avatar or login/signup button */}
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              animation={false}
            />
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};
