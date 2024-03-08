import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

interface Props {
  count?: number;
}

export const ChatCardPlaceholder = ({ count = 1 }: Props) => {
  return Array.from({ length: count }, (_, i) => (
    <Stack
      key={i}
      direction={"row"}
      alignItems={"center"}
      gap={2}
      sx={{
        width: "90%",
        p: "16px 18px 16px 16px",
        bgcolor: "surfaceContainerHigh",
        borderRadius: "16px",
      }}
    >
      <Skeleton
        animation="wave"
        variant="circular"
        sx={{
          width: 40,
          height: 40,
        }}
      />
      <Stack
        gap={1}
        flex={1}
      >
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            height: 21,
          }}
        />
        <Skeleton
          animation="wave"
          variant="text"
          sx={{
            height: 19,
          }}
        />
      </Stack>
    </Stack>
  ));
};
