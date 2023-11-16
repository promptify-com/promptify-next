import Link from "next/link";
import Icon from "@mui/material/Icon";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import { redirectToPath } from "@/common/helpers";
import type { NavItem } from "@/common/types/sidebar";

function SidebarItem({ navItem, isPromptsPage }: { navItem: NavItem; isPromptsPage: boolean }) {
  return (
    <Link
      href={navItem.href}
      target={navItem.external ? "_blank" : ""}
      style={{
        width: "100%",
        textDecoration: "none",
      }}
    >
      <ListItem
        disablePadding
        sx={{
          ...(navItem.active && {
            ".MuiListItemIcon-root": {
              backgroundColor: "surface.1",
              ".MuiSvgIcon-root": {
                color: "#375CA9",
              },
            },
            ".MuiTypography-root": {
              color: "#375CA9",
            },
          }),
          padding: "8px",
          "&:hover": {
            // ".MuiListItemIcon-root": {
            backgroundColor: "surface.1",
            borderRadius: "8px",
            ".MuiSvgIcon-root": {
              transform: "scale(1.1)",
            },
            // },
            // ".MuiTypography-root, .MuiSvgIcon-root": {
            //   color: "#375CA9",
            // },
          },
          ".MuiSvgIcon-root": {
            transition: "transform 0.3s ease, color 0.3s ease",
          },
        }}
        onClick={e => {
          if (navItem.external) {
            return;
          }

          if (navItem.active) {
            e.preventDefault();
          }

          if (navItem.reload && !navItem.active) {
            e.stopPropagation();
            redirectToPath(navItem.href);
          }
        }}
      >
        <ListItemButton
          sx={{
            display: "flex",
            flexDirection: isPromptsPage ? "row" : "column",
            width: isPromptsPage ? "100%" : "auto",
            textAlign: "center",
            "&:hover": {
              backgroundColor: "surface.1",
              borderRadius: "8px",
              color: "onSurface",
            },
          }}
        >
          <ListItemIcon
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: isPromptsPage ? "flex-end" : "center",
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
            }}
            fontSize={14}
            fontWeight={500}
            color={"onSurface"}
          >
            {navItem.name}
          </Typography>
        </ListItemButton>
      </ListItem>
    </Link>
  );
}

export default SidebarItem;
