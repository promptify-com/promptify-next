import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { theme } from "@/theme";
import Box from "@mui/material/Box";
import { AccountSidebarWidth, NavItems } from "./Constants";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AccountSidebar() {
  const router = useRouter();

  return (
    <Box
      width={AccountSidebarWidth}
      height={"100svh"}
      overflow={"auto"}
      sx={{
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
        >
          {NavItems.map(navItem => (
            <Stack
              key={navItem.label}
              gap={"1px"}
              sx={{
                a: {
                  textDecoration: "none",
                  padding: "16px 24px",
                  fontSize: 14,
                  fontWeight: 500,
                  color: theme.palette.secondary.main,
                  borderRadius: "8px",
                  "&.active, &:hover": {
                    bgcolor: "surfaceContainerHighest",
                    color: "onPrimaryContainer",
                  },
                },
              }}
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
                  className={router.pathname == item.link ? "active" : ""}
                >
                  {item.title}
                </Link>
              ))}
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
