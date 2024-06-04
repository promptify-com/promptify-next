import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

const WorkflowCardPlaceholder = () => {
  return (
    <Stack gap={"24px"}>
      <Stack
        direction={"row"}
        alignItems={{ xs: "end", md: "center" }}
        px={{ xs: "26px", md: "80px" }}
        justifyContent={{ md: "space-between" }}
        gap={"40px"}
      >
        <Stack
          gap={"12px"}
          width={"50%"}
        >
          <Skeleton
            width={"40%"}
            height={30}
          />
          <Skeleton
            width={"90%"}
            height={20}
          />
        </Stack>
      </Stack>
      <Stack
        overflow={"hidden"}
        ml={{ xs: "24px", md: "80px" }}
      >
        <Stack
          gap={{ xs: "16px", md: "24px" }}
          direction={"row"}
          sx={{
            display: "flex",
            flexWrap: "nowrap",
          }}
        >
          {Array.from({ length: 2 }).map((_, index) => (
            <Stack
              key={index}
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
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default WorkflowCardPlaceholder;
