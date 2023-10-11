import { Stack } from "@mui/material";
import React from "react";

const PromptItemPlaceholder = () => {
  return (
    <Stack
      width={"100%"}
      minHeight={"50px"}
      borderRadius={"8px"}
      sx={{
        border: "1px dashed var(--primary-main, #375CA9)",
        boxShadow:
          "0px 6px 6px -3px rgba(225, 226, 236, 0.20), 0px 10px 14px 1px rgba(225, 226, 236, 0.14), 0px 4px 18px 3px rgba(27, 27, 30, 0.12)",
      }}
      bgcolor={"var(--primary-hover, rgba(55, 92, 169, 0.08))"}
    ></Stack>
  );
};

export default PromptItemPlaceholder;
