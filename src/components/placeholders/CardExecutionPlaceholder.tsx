import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export const CardExecutionPlaceholder = () => {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={1}
      width={"90%"}
    >
      <Skeleton
        animation="wave"
        sx={{
          width: 50,
          height: 80,
        }}
      />
      <Stack flex={1}>
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            height: 20,
          }}
        />
        <Skeleton
          animation="wave"
          variant="text"
          sx={{
            height: 20,
          }}
        />
      </Stack>
    </Stack>
  );
};
