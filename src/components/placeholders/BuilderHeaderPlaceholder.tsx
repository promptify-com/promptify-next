import { Skeleton } from "@mui/material";
import Stack from "@mui/material/Stack";

function BuilderHeaderPlaceholder() {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={10}
      bgcolor={"surface.1"}
      p={"16px 24px"}
      border={`1px solid `}
      borderColor={"surface.3"}
      zIndex={3}
      position={"relative"}
    >
      <Stack
        direction={"row"}
        width={"100%"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Skeleton
          variant="text"
          width={"140px"}
          height={"15px"}
        />
        <Stack
          direction={"row"}
          justifyContent={"space-around"}
        >
          <Stack
            gap={"8px"}
            mr={"63px"}
            direction={"row"}
          >
            <Skeleton
              variant="rectangular"
              width={"120px"}
              height={"40px"}
              sx={{
                borderRadius: "8px",
              }}
            />
            <Skeleton
              variant="rectangular"
              width={"220px"}
              height={"40px"}
              sx={{
                borderRadius: "8px",
              }}
            />
          </Stack>
          <Skeleton
            variant="circular"
            width={"40px"}
            height={"40px"}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default BuilderHeaderPlaceholder;
