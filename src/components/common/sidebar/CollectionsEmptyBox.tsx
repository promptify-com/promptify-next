import { EmptyBox } from "@/assets/icons/EmptyBox";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";

export const CollectionsEmptyBox = ({ onExpand }: { onExpand?: boolean }) => {
  const router = useRouter();

  return (
    <Box
      sx={{ display: onExpand ? "flex" : "none" }}
      mt={2}
      alignContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={3}
    >
      <Box textAlign={"center"} width={"100%"}>
        <Typography
          fontSize={14}
          sx={{
            textAlign: "center",
          }}
          color={"onSurface"}
        >
          Your selected templates <br /> will be collected there
        </Typography>
      </Box>
      <EmptyBox />
      <Grid
        display={"flex"}
        justifyContent={"space-around"}
        alignItems={"center"}
        gap={3}
      >
        <Button variant="outlined" onClick={() => router.push('signin')}>Sign In</Button>
        <Typography>Or</Typography>
        <Button
          sx={{
            bgcolor: "#3B4050",
            color: "white",
            "&:hover": {
              color: "#3B4050",
              border: "1px solid #3B4050",
            },
          }}
          onClick={() => {
            router.push({
              pathname: "/signin",
              query: { from: "signup" },
            })
          }}
        >
          Sign Up
        </Button>
      </Grid>
    </Box>
  );
};
