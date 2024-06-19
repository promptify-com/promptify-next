import Link from "next/link";
import Icon from "@mui/material/Icon";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import type { NavItem } from "@/common/types/sidebar";
import { useTheme } from "@mui/material";

interface Props {
  navItem: NavItem;
}

function SidebarItem({ navItem }: Props) {
  const theme = useTheme();
  return (
    <Link
      href={navItem.href}
      target={navItem.external ? "_blank" : ""}
      style={{
        width: "100%",
        textDecoration: "none",
        cursor: navItem.href === "#" ? "none" : "pointer",
      }}
    >
      <ListItem
        className={navItem.href === "#" ? "grayedout_link" : ""}
        disablePadding
        sx={{
          ...(navItem.active && {
            svg: {
              fill: theme.palette.primary.main,
              transform: "scale(1.1)",
            },
            ".MuiTypography-root": {
              color: "secondary.main",
            },
            ".MuiListItemIcon-root": {
              backgroundColor: "surface.1",
            },
          }),
          padding: "8px",
          height: "auto",
          "&:not(.grayedout_link):hover": {
            backgroundColor: "transparent",
            borderRadius: "8px",
            svg: {
              transform: "scale(1.1)",
              fill: theme.palette.primary.main,
            },
            ".MuiTypography-root": {
              color: "secondary.main",
            },
            ".MuiListItemIcon-root": {
              backgroundColor: "surface.1",
            },
          },
          ".MuiListItemButton-root.Mui-disabled": {
            pointerEvents: "visible",
            cursor: "no-drop",
          },
        }}
      >
        <ListItemButton
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            width: "auto",
            textAlign: "center",
            "&:hover": {
              backgroundColor: "transparent",
              borderRadius: "8px",
              color: "onSurface",
              path: {
                fill: theme.palette.primary.main,
              },
            },
          }}
          disabled={navItem.href === "#"}
        >
          <Box sx={{ minWidth: "40px", display: "block" }}>
            <ListItemIcon
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minWidth: "40px",
                borderRadius: "6px",
                height: "40px",
                alignItems: "center",
                color: "#67677C",
                ".MuiListItemIcon-root": {
                  minWidth: "40px",
                  width: "40px",
                },
              }}
            >
              <Icon
                sx={{
                  width: "32px",
                  height: "32px",
                }}
              >
                {navItem.icon}
              </Icon>
            </ListItemIcon>
            <Typography
              sx={{
                mt: 0.5,
                alignSelf: "flex-start",
              }}
              fontSize={12}
              fontWeight={500}
              color={"onSurface"}
            >
              {navItem.name}
            </Typography>
          </Box>
        </ListItemButton>
      </ListItem>
    </Link>
  );
}

export default SidebarItem;
