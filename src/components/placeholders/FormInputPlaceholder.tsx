import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

function FormInputPlaceholder({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Stack
          key={index}
          justifyContent="center"
          alignItems="center"
          p={"16px 8px"}
        >
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={"20px"}
            sx={{
              borderRadius: "16px",
            }}
          />
        </Stack>
      ))}
    </>
  );
}

export default FormInputPlaceholder;
