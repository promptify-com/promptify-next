import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

function TableHeader() {
  return (
    <Grid
      container
      display={{ xs: "none", md: "flex" }}
      p={"16px"}
    >
      <Grid
        item
        md={3}
      >
        <Typography
          sx={{
            opacity: 0.5,
          }}
        >
          {" "}
          Model
        </Typography>
      </Grid>

      <Grid
        item
        md={4}
      >
        <Typography
          sx={{
            opacity: 0.5,
          }}
        >
          {" "}
          Instance
        </Typography>
      </Grid>
      <Grid
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        item
        md={2}
        sx={{
          opacity: 0.5,
        }}
      >
        <Typography>Status</Typography>
      </Grid>
      <Grid
        item
        display={"flex"}
        justifyContent={"end"}
        md={3}
      >
        <Typography
          sx={{
            opacity: 0.5,
          }}
        >
          Created at
        </Typography>
      </Grid>
    </Grid>
  );
}

export default TableHeader;
