// Mui
import { Stack, Skeleton, Box } from "@mui/material";

const WorkflowCardPlaceholder = () => {
  return (
    <Stack
      p={"8px"}
      width={{ xs: "282px", md: "487px" }}
      minWidth={{ xs: "282px", md: "487px" }}
      direction={{ xs: "column", md: "row" }}
      bgcolor={"#F9F9F9"}
      borderRadius={"16px"}
      position={"relative"}
    >
      <Box
        width={{ xs: "100%", md: "180px" }}
        height={{ xs: "266px", md: "180px" }}
        borderRadius={"18px"}
        overflow={"hidden"}
        position={"relative"}
      >
        <Skeleton
          width={"100%"}
          height={"100%"}
        />
      </Box>

      <Stack
        p={{ xs: "16px", md: "40px 24px 16px 24px" }}
        flex={1}
        gap={"24px"}
        alignItems={"start"}
      >
        <Stack
          gap={"8px"}
          width={"100%"}
        >
          <Skeleton
            width={"50%"}
            height={30}
          />
          <Skeleton
            width={"100%"}
            height={20}
          />
        </Stack>

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width={"100%"}
        >
          <Skeleton
            width={"50%"}
            height={20}
          />
          <Skeleton
            width={"32px"}
            height={"32px"}
            variant="circular"
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default WorkflowCardPlaceholder;
