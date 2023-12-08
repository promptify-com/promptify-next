import { Badge } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";

import ExtensionSettingsIcon from "@/assets/icons/ExtensionSettingsIcon";
import NoteStackIcon from "@/assets/icons/NoteStackIcon";
import type { Link } from "@/common/types/TemplateToolbar";
import { openToolbarDrawer, setActiveToolbarLink, setTemplateApiStatus } from "@/core/store/templatesSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { theme } from "@/theme";
import { templatesApi } from "@/core/api/templates";

interface Props {
  templateId: number;
  item: Link;
  onClick: (item: Link) => void;
  executionsLength: number;
}

function ToolbarItem({ templateId, item, onClick, executionsLength }: Props) {
  const dispatch = useAppDispatch();

  const [getTempalteEnable] = templatesApi.endpoints.getTemplateApiStatus.useLazyQuery();

  const activeLink = useAppSelector(state => state.template.activeSideBarLink);
  const tempateApiStatus = useAppSelector(state => state.template.templateApiStatus);

  const getTempalteApiStatus = async () => {
    if (tempateApiStatus.data) return;
    await getTempalteEnable(templateId)
      .unwrap()
      .then(data => dispatch(setTemplateApiStatus({ data, isLoading: false })))
      .catch(_err => dispatch(setTemplateApiStatus({ data: null, isLoading: false })));
  };

  const handleClick = (link: Link) => {
    if (link.name !== "customize") {
      dispatch(openToolbarDrawer(true));
      dispatch(setActiveToolbarLink(link));
      link.name === "api" && getTempalteApiStatus();
      return;
    }
    onClick(link);
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
                      bgcolor: "surface.5",
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
