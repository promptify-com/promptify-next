import { Box, Grid, Card, Skeleton } from "@mui/material";

export default function LatestTemplatePlaceholder({ count = 12 }) {
  return Array.from({ length: count }).map((_, index) => (
    <Box>
      <Card
        sx={{
          maxWidth: "266px",
          width: "266px",
          minHeight: "277px",
          bgcolor: "transparent",
          borderRadius: "16px",
          position: "relative",
          overflow: "hidden",
        }}
        elevation={0}
      >
        <Skeleton
          sx={{
            zIndex: 0,
            borderRadius: "16px 16px 0px 0px",
            width: "100%",
            height: "115px",
            bgcolor: "#dad9de",
          }}
          variant="rectangular"
          animation="wave"
        />

        <Box
          display={"flex"}
          flexDirection={"column"}
          mt={-1.5}
          sx={{
            zIndex: 1,
          }}
        >
          <Skeleton
            sx={{
              bgcolor: "#cdcdd1",
              padding: "16px",
              borderRadius: "16px",
              height: "121px",
            }}
            variant="rectangular"
            animation="wave"
          />

          <Grid
            gap={0.5}
            sx={{ width: "100%" }}
            display={"flex"}
            flexDirection={"column"}
            mt={-18}
            ml={2}
          >
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: "80%",
                height: 20,
                marginBottom: "4px",
                fontSize: "18px",
                bgcolor: "#dad9de",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{ width: "70%", height: 16, fontSize: "14px", bgcolor: "#dad9de" }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{ width: "60%", height: 16, fontSize: "14px", bgcolor: "#dad9de" }}
            />
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mt: "13px",
              mr: "15px",
            }}
          >
            <Skeleton
              variant="circular"
              animation="wave"
              sx={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                bgcolor: "#dad9de",
              }}
            />
          </Box>
        </Box>
      </Card>
    </Box>
  ));
}
