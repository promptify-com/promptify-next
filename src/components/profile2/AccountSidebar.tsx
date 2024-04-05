import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { theme } from "@/theme";
import Box from "@mui/material/Box";
import { AccountSidebarWidth, navItems } from "./Constants";
import Link from "next/link";
import { useRouter } from "next/router";
import useLogout from "@/hooks/useLogout";
import { isDesktopViewPort } from "@/common/helpers";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import IconButton from "@mui/material/IconButton";

interface Props {
  closeSidebar?: () => void;
}

export default function AccountSidebar({ closeSidebar }: Props) {
  const router = useRouter();
  const logout = useLogout();
  const desktopView = isDesktopViewPort();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Box
      width={desktopView ? AccountSidebarWidth : "301px"}
      height={"100svh"}
      sx={{
        position: "fixed",
        top: 0,
        ...(desktopView
          ? {
              right: 0,
            }
          : {
              left: 0,
              bgcolor: "surfaceContainerLow",
            }),
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
            display: "flex",
            height: "72px",
            alignItems: "center",
            gap: "var(--1, 8px)",
            flexShrink: 0,
            alignSelf: "stretch",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              color: "var(--onSurface, var(--onSurface, #1B1B1F))",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontFamily: "Poppins",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "100%",
            }}
          >
            My Account
          </Typography>

          {!desktopView && (
            <IconButton
              sx={{
                border: "none",
                "& > svg": { width: 24, height: 24 },
                "&:active": {
                  color: "#1C1B1F",
                  textDecoration: "none",
                },
              }}
              onClick={() => closeSidebar?.()}
            >
              <CloseRoundedIcon fontSize="large" />
            </IconButton>
          )}
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
          {navItems.map((navItem, idx) => (
            <Stack
              key={idx}
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
