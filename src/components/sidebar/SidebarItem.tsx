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
  isPromptsPage: boolean;
  showFilters: boolean;
  onClick?: () => void;
  tags?: Tag[];
  engines?: Engine[];
}

function SidebarItem({ navItem, isPromptsPage, showFilters, onClick, engines, tags }: Props) {
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
            ".MuiListItemIcon-root span.MuiIcon-root.material-icons": {
              ...(!isPromptsPage && {
                bgcolor: "surface.1",
                display: "block",
                padding: "8px",
                borderRadius: "8px",
                color: "#375CA9",
              }),
            },
            ".MuiTypography-root": {
              color: "#375CA9",
            },
            mb: isPromptsPage ? "10px" : 0,
          }),
          padding: "8px",
          height: isPromptsPage ? "56px" : "auto",
        }}
        onClick={e => {
          onClick?.();

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
            justifyContent: isPromptsPage ? "space-between" : "flex-start",
            width: isPromptsPage ? "100%" : "auto",
            textAlign: "center",
            "&:hover": {
              bgcolor: "transparent",
              ".MuiListItemIcon-root span.MuiIcon-root.material-icons": {
                borderRadius: "8px",
                color: "#375CA9",
                ...(!isPromptsPage && {
                  bgcolor: "surface.1",
                  display: "block",
                  padding: "8px",
                }),
              },
              ".MuiTypography-root": {
                color: "#375CA9",
              },
              ...(isPromptsPage && { bgcolor: "surface.1", borderRadius: "8px", color: "onSurface" }),
            },
          }}
        >
          <Box sx={{ minWidth: "40px", display: isPromptsPage ? "flex" : "block" }}>
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
                alignSelf: isPromptsPage ? "center" : "flex-start",
              }}
              fontSize={14}
              fontWeight={500}
              color={"onSurface"}
            >
              {navItem.name}
            </Typography>
          </Box>
          {isPromptsPage && navItem.href === "/explore" ? (
            showFilters ? (
              <ExpandLess sx={{ mr: -1, color: "text.secondary" }} />
            ) : (
              <ExpandMore sx={{ mr: -1, color: "text.secondary" }} />
            )
          ) : null}
        </ListItemButton>
      </ListItem>
      <Collapse
        in={showFilters && isPromptsPage && navItem.href === "/explore"}
        timeout={"auto"}
        unmountOnExit
      >
        <ExploreFilterSideBar
          engines={engines}
          tags={tags}
          sidebarOpen
        />
      </Collapse>
    </Link>
  );
}

export default SidebarItem;
