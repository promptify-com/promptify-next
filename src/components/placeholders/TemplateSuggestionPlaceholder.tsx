import { Skeleton, Stack } from "@mui/material";
import React from "react";

function TemplateSuggestionPlaceholder() {
  return (
    <Stack
      border={"1px solid"}
      borderColor={"surfaceDim"}
      p={"16px 0px"}
      px={{ xs: "8px", md: "16px" }}
      borderRadius={"24px"}
      direction={{ xs: "column", md: "row" }}
      gap={"24px"}
      alignItems={"center"}
      justifyContent={"space-between"}
      width={"100%"}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={2}
      >
        <Skeleton
          variant="rectangular"
          width={"152px"}
          height={"113px"}
          sx={{
            borderRadius: "24px",
          }}
        />
        <Stack gap={2}>
          <Skeleton
            variant="text"
            width={"152px"}
          />
          <Skeleton
            variant="text"
            width={"252px"}
          />
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={3}
          >
            <Skeleton
              variant="text"
              width={"42px"}
            />
            <Skeleton
              variant="text"
              width={"42px"}
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack
        px={"23px"}
        direction={"row"}
        alignItems={"center"}
        gap={3}
      >
        <Skeleton
          variant="rectangular"
          width={"32px"}
          height={"32px"}
          sx={{
            borderRadius: "32px",
          }}
        />
        <Skeleton
          variant="rectangular"
          width={"32px"}
          height={"32px"}
          sx={{
            borderRadius: "32px",
          }}
        />
      </Stack>
    </Stack>
  );
}

export default TemplateSuggestionPlaceholder;
