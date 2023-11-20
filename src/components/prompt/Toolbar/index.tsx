import Box from "@mui/material/Box";

import ToolbarItem from "./ToolbarItem";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "../FavoriteIcon";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItem from "@mui/material/ListItem";

import type { Link } from "@/common/types/TemplateToolbar";
import { ToolbarItems } from "@/common/constants";
import { Templates } from "@/core/api/dto/templates";

interface Props {
  template: Templates;
}

function TemplateToolbar({ template }: Props) {
  const handleItemClick = (link: Link) => {
    if (link.name === "customize") {
      const url = `/prompt-builder/${template.slug}?editor=1`;
      window.open(url, "_blank");
    }
  };

  return (
    <Box height={"100%"}>
      <Box
        sx={{
          display: "flex",
          height: "100%",
        }}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={2}
          sx={{
            p: "16px",
            zIndex: 1300,
            bgcolor: "surface.1",
          }}
        >
          <Avatar
            src={template.created_by.avatar}
            alt={template.created_by.username}
            sx={{ width: 30, height: 30 }}
          />

          <ListItem
            disablePadding
            sx={{
              mb: -2,
            }}
          >
            <ListItemButton
              sx={{
                borderRadius: "16px",
                padding: "12px",
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
                    color: "onSurface",
                    justifyContent: "center",
                  }}
                >
                  <FavoriteIcon
                    style={{
                      sx: {
                        flexDirection: "column",
                        p: 0,
                        color: "secondary.main",
                        fontSize: 13,
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItemIcon>
              </Box>
            </ListItemButton>
          </ListItem>

          {ToolbarItems.map(link => (
            <ToolbarItem
              key={link.title}
              item={link}
              onClick={handleItemClick}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default TemplateToolbar;
