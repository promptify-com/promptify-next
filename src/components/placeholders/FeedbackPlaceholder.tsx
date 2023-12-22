import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

function FeedbackPlaceholder({ count = 1 }) {
  return Array.from({ length: count }).map((_, index) => (
    <Stack
      key={index}
      direction={"row"}
      gap={1.5}
    >
      <Skeleton
        variant="circular"
        animation="wave"
        sx={{
          width: 32,
          height: 32,
        }}
      />
      <Stack
        flex={1}
        gap={1.5}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={1.5}
        >
          <Skeleton
            variant="text"
            animation="wave"
            height={15}
            width="40%"
          />
          <Skeleton
            animation="wave"
            height={10}
            width="20%"
          />
        </Stack>
        <Skeleton
          animation="wave"
          height={10}
        />
        <Skeleton
          animation="wave"
          height={10}
        />
        <Skeleton
          animation="wave"
          height={10}
        />
      </Stack>
    </Stack>
  ));
}

export default FeedbackPlaceholder;
