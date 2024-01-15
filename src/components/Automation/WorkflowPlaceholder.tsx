import React from "react";

import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

function WorkflowPlaceholder() {
  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      mx={"auto"}
      width={"80%"}
      alignContent={"center"}
    >
      <Stack
        sx={{
          width: { md: "100%" },
          mx: { md: "auto" },
          height: "calc(100vh - 120px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 2,
        }}
      >
        <Stack
          height={"calc(100% - 20px)"}
          justifyContent={"flex-end"}
        >
          <Stack
            height={"250px"}
            bgcolor={"surface.3"}
            direction={"row"}
            justifyContent={"space-between"}
            sx={{
              borderRadius: "16px",
            }}
          >
            <Stack
              direction={"column"}
              gap={2}
              width={"100%"}
              sx={{
                p: { md: "48px 72px 48px 54px" },
              }}
            >
              <Skeleton
                variant="text"
                width={"320px"}
                height={"20px"}
              />
              <Stack width={"80%"}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="text"
                    width={"100%"}
                    height={"16px"}
                  />
                ))}
              </Stack>
            </Stack>
            <Skeleton
              variant="rectangular"
              width={"480px"}
              height={"100%"}
              sx={{
                borderRadius: "46px",
              }}
            />
          </Stack>
        </Stack>

        <Stack
          mt={5}
          direction={"column"}
          justifyContent={"space-between"}
          minHeight={"300px"}
        >
          <Stack
            direction={"column"}
            gap={3}
          >
            <Skeleton
              variant="text"
              width={"50%"}
              height={"16px"}
            />
            <Skeleton
              variant="rectangular"
              height={"150px"}
              sx={{
                borderRadius: "16px",
              }}
            />
          </Stack>

          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={"40px"}
            sx={{
              borderRadius: "40px",
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default WorkflowPlaceholder;
