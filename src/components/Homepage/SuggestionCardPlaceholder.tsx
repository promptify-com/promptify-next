import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

function SuggestionCardPlaceholder() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <Stack
          key={index}
          bgcolor={"surface.2"}
          borderRadius={"16px"}
          width={"23%"}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            p={"16px 8px 16px 24px"}
            borderBottom={"1px solid"}
            borderColor={"surface.3"}
            justifyContent={"space-between"}
          >
            <Stack gap={1}>
              <Skeleton
                variant="text"
                sx={{ width: "70px", height: "20px" }}
              />
              <Skeleton
                variant="text"
                sx={{ width: "120px", height: "20px" }}
              />
            </Stack>
            <Skeleton
              variant="rectangular"
              sx={{ width: "48px", height: "48px", borderRadius: "48px" }}
            />
          </Stack>

          <Stack
            direction={"row"}
            alignItems={"center"}
            p={"16px 8px 16px 24px"}
          >
            <Stack
              gap={1}
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              width={"100%"}
            >
              <Skeleton
                variant="text"
                sx={{ width: "170px", height: "20px" }}
              />
              <Skeleton
                variant="rectangular"
                sx={{ width: "32px", height: "32px", borderRadius: "32px" }}
              />
            </Stack>
          </Stack>
        </Stack>
      ))}
    </>
  );
}

export default SuggestionCardPlaceholder;
