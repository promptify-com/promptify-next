import NoteStackIcon from "@/assets/icons/NoteStackIcon";
import { TemplateSidebarLinks } from "@/common/constants";
import { Link } from "@/common/types/TemplateToolbar";
import { setActiveToolbarLink } from "@/core/store/templatesSlice";
import { useAppDispatch } from "@/hooks/useStore";
import { theme } from "@/theme";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import Stack from "@mui/material/Stack";
import React, { Fragment } from "react";

function TopHeaderActions({ executionsLength = 0 }) {
  const dispatch = useAppDispatch();
  const ToolbarItems = TemplateSidebarLinks.filter(link => link.name === "executions" || link.name === "details");

  const renderIcon = (link: Link) => {
    if (link.name === "executions") {
      return <NoteStackIcon color={theme.palette.primary.main} />;
    }
    return link.icon;
  };
  return (
    <Stack
      p={"16px"}
      direction={"row"}
      alignItems={"center"}
      gap={"20px"}
      bgcolor={"surface.1"}
      display={{ xs: "flex", md: "none" }}
    >
      {ToolbarItems.map(link => (
        <Fragment key={link.name}>
          {executionsLength > 0 && link.name === "executions" ? (
            <Badge
              badgeContent={executionsLength}
              color="primary"
            >
              <Button
                onClick={() => dispatch(setActiveToolbarLink(link))}
                variant="text"
                startIcon={<Icon>{renderIcon(link)}</Icon>}
                sx={{
                  height: 22,
                  p: "15px",
                  bgcolor: "surface.3",
                }}
              >
                {link.title}
              </Button>
            </Badge>
          ) : (
            <Button
              variant="text"
              onClick={() => dispatch(setActiveToolbarLink(link))}
              startIcon={<Icon sx={{ py: "4px", pr: "2px", mt: -0.5 }}>{renderIcon(link)}</Icon>}
              sx={{
                height: 22,
                p: "15px",
                bgcolor: "surface.3",
              }}
            >
              {link.title}
            </Button>
          )}
        </Fragment>
      ))}
    </Stack>
  );
}

export default TopHeaderActions;
