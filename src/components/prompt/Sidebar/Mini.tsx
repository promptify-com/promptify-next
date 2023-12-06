import React from "react";
import Stack from "@mui/material/Stack";
import { useDispatch } from "react-redux";
import { setActiveSidebarLink } from "@/core/store/templatesSlice";
import { SidebarLink } from "@/common/types/template";
import NoteStackIcon from "@/assets/icons/NoteStackIcon";
import { InfoOutlined } from "@mui/icons-material";
import { Badge, Button } from "@mui/material";
import { theme } from "@/theme";

const SidebarItems: SidebarLink[] = [
  {
    name: "executions",
    icon: <NoteStackIcon color={"#375CA9"} />,
    title: "My Works",
  },
  {
    name: "details",
    icon: <InfoOutlined fontSize="small" />,
    title: "Template details",
  },
];

interface Props {
  count: number;
}

export default function SidebarMini({ count }: Props) {
  const dispatch = useDispatch();

  const handleOpenDrawer = (link: SidebarLink) => {
    dispatch(setActiveSidebarLink(link));
  };

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={2.5}
      sx={{
        p: "12px 10px",
        bgcolor: "surface.1",
      }}
    >
      {SidebarItems.map(link => (
        <React.Fragment key={link.name}>
          {count && link.name === "executions" ? (
            <Badge
              badgeContent={count}
              sx={{
                ".MuiBadge-badge.MuiBadge-standard": {
                  bgcolor: "#375CA9",
                  color: theme.palette.onPrimary,
                  fontSize: 10,
                  fontWeight: 500,
                  height: 20,
                  minWidth: 20,
                  p: "0 3px",
                },
              }}
            >
              <Button
                onClick={() => handleOpenDrawer(link)}
                variant="text"
                sx={{
                  height: 24,
                  p: "15px",
                  bgcolor: theme.palette.primaryContainer,
                  color: "#375CA9",
                  border: "99px",
                  gap: 1,
                }}
              >
                {link.icon}
                {link.title}
              </Button>
            </Badge>
          ) : (
            <Button
              variant="text"
              onClick={() => handleOpenDrawer(link)}
              sx={{
                height: 24,
                p: "15px",
                bgcolor: theme.palette.primaryContainer,
                color: "#375CA9",
                border: "99px",
                gap: 1,
              }}
            >
              {link.icon}
              {link.title}
            </Button>
          )}
        </React.Fragment>
      ))}
    </Stack>
  );
}
