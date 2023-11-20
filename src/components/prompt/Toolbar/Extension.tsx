import { Button, Stack, Typography, alpha } from "@mui/material";
import { theme } from "@/theme";
import { Launch } from "@mui/icons-material";
import Image from "@/components/design-system/Image";
import { ChromeIcon } from "@/assets/icons/Chrome";

export const Extension = () => {
  return (
    <Stack
      alignItems={"center"}
      gap={3}
      width={"300px"}
      p={"24px"}
    >
      <Image
        src={require("@/assets/images/Extension.png")}
        alt="extension"
      />

      <Typography
        fontSize={22}
        fontWeight={500}
        color={"text.primary"}
        textAlign={"center"}
      >
        Try our Chrome Extension
      </Typography>
      <Typography
        fontSize={14}
        fontWeight={400}
        color={alpha(theme.palette.text.secondary, 0.45)}
        textAlign={"center"}
      >
        Make this template accessible directly in most common websites
      </Typography>

      <Button
        onClick={() => {}}
        startIcon={<ChromeIcon />}
        endIcon={<Launch />}
        sx={{
          p: "6px 14px",
          borderRadius: "100px",
          gap: 1.5,
          fontSize: 15,
          fontWeight: 500,
          bgcolor: "transparent",
          color: "text.primary",
          border: `1px solid ${theme.palette.divider}`,
          ":hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        Install Extension
      </Button>
      <Button
        onClick={() => {}}
        sx={{
          p: "6px 14px",
          borderRadius: "100px",
          gap: 1.5,
          fontSize: 15,
          fontWeight: 500,
          bgcolor: "transparent",
          color: "text.primary",
          border: `1px solid ${theme.palette.divider}`,
          ":hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        Skip & go to the settings
      </Button>
    </Stack>
  );
};
