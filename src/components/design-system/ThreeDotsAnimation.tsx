import Grid from "@mui/material/Grid";

const ThreeDotsAnimation = ({ loading }: { loading: boolean }) => {
  const dots = [1, 2, 3];

  if (!loading) {
    return null;
  }

  return (
    <Grid
      p={"0px 16px 10px"}
      className="dot-container"
    >
      {dots.map(dotIndex => (
        <Grid
          key={dotIndex}
          item
          className="dot"
        ></Grid>
      ))}
    </Grid>
  );
};

export default ThreeDotsAnimation;
