import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

function TableHeader() {
  return (
    <Grid
      container
      display={{ xs: "none", md: "flex" }}
      p={"16px 0"}
    >
      <Grid
        item
        md={2}
      >
        <Typography
          sx={{
            opacity: 0.5,
          }}
        >
          Model
        </Typography>
      </Grid>
      <Grid
        item
        md={2.5}
      >
        <Typography
          sx={{
            opacity: 0.5,
          }}
        >
          Name
        </Typography>
      </Grid>
      <Grid
        item
        md={1.5}
      >
        <Typography
          sx={{
            opacity: 0.5,
          }}
        >
          Created by
        </Typography>
      </Grid>
      <Grid
        item
        md={1.5}
      >
        <Typography
          sx={{
            opacity: 0.5,
          }}
        >
          Region
        </Typography>
      </Grid>
      <Grid
        item
        md={1.5}
      >
        <Typography
          sx={{
            opacity: 0.5,
          }}
        >
          Instance
        </Typography>
      </Grid>
      <Grid
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        item
        md={1}
        sx={{
          opacity: 0.5,
        }}
      >
        <Typography>Status</Typography>
      </Grid>
      <Grid
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        item
        md={1}
        sx={{
          opacity: 0.5,
        }}
      >
        <Typography>Created at</Typography>
      </Grid>
      <Grid
        item
        display={"flex"}
        justifyContent={"end"}
        md={1}
      >
        <Typography
          sx={{
            opacity: 0.5,
          }}
        >
          Actions
        </Typography>
      </Grid>
    </Grid>
  );
}

export default TableHeader;
