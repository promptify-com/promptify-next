import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function BuilderPromptPlaceholder({ count = 1 }) {
  return Array.from({ length: count }).map((_, index) => (
    <Box
      key={index}
      sx={{
        bgcolor: "surface.1",
        m: "24px 0 !important",
        borderRadius: "16px !important",
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        p={"12px 24px"}
      >
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "40%",
            height: "24px",
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "30%",
            height: "24px",
          }}
        />
      </Stack>
      <Divider sx={{ borderColor: "surface.3" }} />
      <Box p={"12px 24px"}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
        >
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "10%",
              height: "24px",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: "10%",
              height: "24px",
            }}
          />
        </Stack>
        <Stack
          minHeight={"250px"}
          direction={"column"}
          gap={"8px"}
          mt={"10px"}
        >
          {Array.from({ length: 6 }).map((_i, index) => (
            <Skeleton
              key={index}
              variant="text"
              animation="wave"
              sx={{
                height: "24px",
              }}
            />
          ))}
        </Stack>
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{
            height: "42px",
            borderRadius: "999px",
          }}
        />
      </Box>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        p={"12px 24px"}
      >
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "50%",
            height: "24px",
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "30%",
            height: "24px",
          }}
        />
      </Stack>
    </Box>
  ));
}
