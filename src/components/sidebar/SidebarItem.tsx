import Link from "next/link";
import Icon from "@mui/material/Icon";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import { redirectToPath } from "@/common/helpers";
import type { NavItem } from "@/common/types/sidebar";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { ExploreFilterSideBar } from "../explorer/ExploreFilterSideBar";
import { Engine, Tag } from "@/core/api/dto/templates";
import { theme } from "@/theme";
import { Box } from "@mui/material";

interface Props {
  navItem: NavItem;
}

function SidebarItem({ navItem }: Props) {
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
            ".MuiSvgIcon-root": {
              fill: "#375CA9",
              transform: "scale(1.1)",
            },
            ".MuiTypography-root": {
              color: "#375CA9",
            },
            ".MuiListItemIcon-root": {
              backgroundColor: "surface.1",
            },
          }),
          padding: "8px",
          height: "auto",
          "&:hover": {
            backgroundColor: "transparent",
            borderRadius: "8px",
            ".MuiSvgIcon-root": {
              transform: "scale(1.1)",
              fill: "#375CA9",
            },
            ".MuiTypography-root": {
              color: "#375CA9",
            },
            ".MuiListItemIcon-root": {
              backgroundColor: "surface.1",
            },
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
            flexDirection: "column",
            justifyContent: "flex-start",
            width: "auto",
            textAlign: "center",
            "&:hover": {
              backgroundColor: "transparent",
              borderRadius: "8px",
              color: "onSurface",
            },
          }}
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
