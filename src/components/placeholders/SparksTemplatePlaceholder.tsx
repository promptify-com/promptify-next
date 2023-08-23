import { Grid, Box, Skeleton } from "@mui/material";

export default function SparksTemplatePlaceholder({ count = 6 }){
  const display = {xs: "none", md:"flex"};
  return Array.from({ length: count }).map((_, index) => (
    <Grid key={index} item sx={{ mb: 2 }}>
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
              sx={{ width: {xs: 200, md: "100%"} }}
            >
              <Grid 
                width={"100%"}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Box sx={{display, width: "35%"}}>
                  <Skeleton sx={{display, width: "25%"}} animation="wave"/>
                </Box>
                <Box 
                  display={"flex"}
                  justifyContent={"space-between"}
                  width={{xs: "100%", sm: "65%"}}
                >
                  <Box 
                    display={"flex"}
                    justifyContent={"space-around"}
                    alignItems={"center"}
                    gap={1}
                    sx={{
                      width: { xs: "90px", md: "30%" },
                      height: { xs: "68px", md: "51px" }
                    }}
                    >
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      sx={{
                        zIndex: 1,
                        borderRadius: {xs: "16px", md: "8px"},
                        width: "75px",
                        height: "100%"
                      }}
                    />
                    <Skeleton sx={{display, width: "40%"}} animation="wave"/>
                  </Box>
                  

                  <Box sx={{display, alignItems:"center", justifyContent: "space-around",  width: "50%"}}>
                    { Array.from({length: 3}).map((_, index) => <Skeleton key={index} sx={{ width: "20%"}} animation="wave"/>)}
                  </Box>
                </Box>
                
              </Grid>
              <Grid
                gap={0.5}
                sx={{ width: "100%" }}
                display={{xs: "flex", md: "none"}}
                flexDirection={"column"}
              >
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: "90%",
                    height: 20,
                    marginBottom: "4px",
                    fontSize: "18px",
                  }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{ width: "80%", height: 16 }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{ width: "70%", height: 16 }}
                />
              </Grid>
        </Grid>
      </Box>
    </Grid>
  ));
}
