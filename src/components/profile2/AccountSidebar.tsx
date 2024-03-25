import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MuiDrawer from "@mui/material/Drawer";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import { theme } from "@/theme";
import { ReactNode } from "react";
import { KeyboardTab } from "@mui/icons-material";
import { Box } from "@mui/material";
import { AccountSidebarWidth } from "./Constants";

export default function AccountSidebar() {
  return (
    <Box width={AccountSidebarWidth}>
      <Box px={"16px"}>
        <Box
          sx={{
            height: "40px",
            p: "16px 8px",
            fontSize: 18,
            fontWeight: 500,
            color: "onSurface",
          }}
        >
          My Account
        </Box>
        <Divider />
        <Stack py={"24px"}></Stack>
      </Box>
    </Box>
  );
}
