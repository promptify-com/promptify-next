import Stack from "@mui/material/Stack";
import Launch from "@mui/icons-material/Launch";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";

import { theme } from "@/theme";
import { ChromeIcon } from "@/assets/icons/Chrome";
import Image from "@/components/design-system/Image";

export const Extension = () => {
  return (
    <Stack
      alignItems={"center"}
      gap={2}
      textAlign={"center"}
    >
      <Image
        src={require("@/assets/images/Extension.png")}
        alt="extension"
      />

      <Typography
        fontSize={22}
        fontWeight={500}
        color={"text.primary"}
      >
        Try our Chrome Extension
      </Typography>
      <Typography
        fontSize={14}
        fontWeight={400}
        color={alpha(theme.palette.text.secondary, 0.45)}
      >
        Make this template accessible directly in most common websites
      </Typography>

      <Typography
        fontSize={14}
        fontWeight={400}
        color={alpha(theme.palette.text.secondary, 0.45)}
      >
        Extension not found
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
        Coming Soon
      </Button>
      <Button
        onClick={() => {}}
        sx={{
          p: "6px 14px",
          borderRadius: "100px",
          gap: 1.5,
          fontSize: 13,
          fontWeight: 500,
          bgcolor: "transparent",
          lineHeight: "22px",
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
