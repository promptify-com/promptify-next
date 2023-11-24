import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

export default function DataLoading({ loading }: { loading: boolean }) {
  return (
    <>
      {loading && (
        <Stack
          direction={"row"}
          justifyContent={"center"}
        >
          <CircularProgress />
        </Stack>
      )}
    </>
  );
}
