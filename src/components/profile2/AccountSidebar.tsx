import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { theme } from "@/theme";
import Box from "@mui/material/Box";
import { AccountSidebarWidth, NavItems } from "./Constants";
import Link from "next/link";
import { useRouter } from "next/router";
import useLogout from "@/hooks/useLogout";

export default function AccountSidebar() {
  const router = useRouter();
  const logout = useLogout();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Box
      width={AccountSidebarWidth}
      height={"100svh"}
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        overflow: "auto",
        overscrollBehavior: "contain",
        "&::-webkit-scrollbar": {
          width: 0,
        },
      }}
    >
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
        <Stack
          gap={2}
          py={"24px"}
          sx={{
            ".item": {
              textDecoration: "none",
              padding: "16px 24px",
              fontSize: 14,
              fontWeight: 500,
              color: theme.palette.secondary.main,
              borderRadius: "8px",
              cursor: "pointer",
              "&.active, &:hover": {
                bgcolor: "surfaceContainerHighest",
                color: "onPrimaryContainer",
              },
            },
          }}
        >
          {NavItems.map(navItem => (
            <Stack
              key={navItem.label}
              gap={"1px"}
            >
              {navItem.label && (
                <Typography
                  p="24px 24px 8px"
                  fontSize={12}
                  fontWeight={500}
                  color={"secondary.light"}
                  sx={{
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  {navItem.label}
                </Typography>
              )}
              {navItem.items.map(item => (
                <Link
                  key={item.title}
                  href={item.link}
                  className={`item ${router.pathname == item.link ? "active" : ""}`}
                >
                  {item.title}
                </Link>
              ))}
            </Stack>
          ))}
          <Box
            className={"item"}
            onClick={handleLogout}
          >
            Sign Out
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
