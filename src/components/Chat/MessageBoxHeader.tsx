import React from "react";
import Stack from "@mui/material/Stack";
import Image from "../design-system/Image";
import Box from "@mui/material/Box";
import { Button, Typography } from "@mui/material";
import { useAppSelector } from "@/hooks/useStore";
import ArrowCircleUp from "@/assets/icons/ArrowCircleUp";

function MessageBoxHeader({}) {
  const { selectedChatOption, selectedTemplate, answers, inputs } = useAppSelector(state => state.chat);
  return (
    <Stack
      bgcolor={"surface.2"}
      p={"16px 24px"}
      borderRadius={"24px"}
      direction={"row"}
      alignItems={"center"}
      gap={2}
      width={"100%"}
    >
      <Box
        sx={{
          zIndex: 0,
          position: "relative",
          width: "60px",
          height: "45px",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <Image
          src={selectedTemplate?.thumbnail!}
          alt={"Image 1"}
          priority={true}
          fill
          style={{
            objectFit: "cover",
          }}
        />
      </Box>
      <Typography
        fontSize={18}
        fontWeight={500}
        lineHeight={"25.2px"}
        sx={{
          flex: 1,
        }}
      >
        {selectedTemplate?.title}
      </Typography>
      {selectedChatOption === "FORM" && (
        <Stack
          direction={"row"}
          gap={2}
          alignItems={"center"}
        >
          <Button
            variant="text"
            sx={{
              bgcolor: "surface.4",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            Instructions: {answers.length} of {inputs.length}
          </Button>
          <Button
            variant="text"
            sx={{
              bgcolor: "primary.main",
              color: "onPrimary",
              border: "none",
              "&:hover": {
                bgcolor: "primary.main",
                opacity: 0.9,
              },
            }}
            endIcon={<ArrowCircleUp />}
          >
            Start
          </Button>
        </Stack>
      )}
    </Stack>
  );
}

export default MessageBoxHeader;
