import { Badge } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";

import ExtensionSettingsIcon from "@/assets/icons/ExtensionSettingsIcon";
import NoteStackIcon from "@/assets/icons/NoteStackIcon";
import { setActiveToolbarLink } from "@/core/store/templatesSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { theme } from "@/theme";
import type { Templates } from "@/core/api/dto/templates";
import type { Link } from "@/components/Prompt/Types";

interface Props {
  template: Templates;
  item: Link;
  executionsLength: number;
  activeVariant: string;
}

function ToolbarItem({ item, activeVariant, template, executionsLength }: Props) {
  const dispatch = useAppDispatch();

  const activeLink = useAppSelector(state => state.template.activeSideBarLink);
  const isVariantA = activeVariant === "a";

  const handleClick = (link: Link) => {
    if (link.name !== "customize") {
      dispatch(setActiveToolbarLink(link));
      return;
    }

    if (isVariantA) return;

    const url = `/prompt-builder/${template.slug}?editor=1`;
    window.open(url, "_blank");
  };

  const isSelected = activeLink?.name === item.name;

  const renderIcon = () => {
    const iconColor = isSelected ? theme.palette.primary.main : "#1B1B1E";

    switch (item.name) {
      case "extension":
        return <ExtensionSettingsIcon color={iconColor} />;
      case "executions":
        return <NoteStackIcon color={iconColor} />;
      default:
        return item.icon;
    }
  };

  return (
    <Grid key={item.name}>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => handleClick(item)}
          sx={{
            borderRadius: "16px",
            padding: "12px",
            backgroundColor: isSelected ? "#375CA91A" : undefined,
          }}
        >
          <Box
            style={{
              textDecoration: "none",
              display: "flex",
              width: "auto",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: "auto",
                color: isSelected || item.name === "api" ? "primary.main" : "onSurface",
                justifyContent: "center",
              }}
            >
              {executionsLength && item.name === "executions" ? (
                <Badge
                  badgeContent={executionsLength}
                  sx={{
                    ".MuiBadge-badge.MuiBadge-standard": {
                      bgcolor: isVariantA ? "surface.1" : "surface.5",

                      border: isVariantA ? "1px solid" : "none",
                      borderColor: "divider",
                    },
                  }}
                >
                  <Icon>{renderIcon()}</Icon>
                </Badge>
              ) : (
                <Icon>{renderIcon()}</Icon>
              )}
            </ListItemIcon>
          </Box>
        </ListItemButton>
      </ListItem>
    </Grid>
  );
}

export default ToolbarItem;
