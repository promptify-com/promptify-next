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
          px={"40px"}
          justifyContent={"flex-end"}
        >
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={"240px"}
            sx={{
              borderRadius: "16px",
            }}
          />
        </Stack>

        <Stack
          mt={5}
          px={"40px"}
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
