import lazy from "next/dynamic";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Close from "@mui/icons-material/Close";
import Image from "next/image";
import { isAdminFn } from "@/core/store/userSlice";
import { setActiveToolbarLink } from "@/core/store/templatesSlice";
import ToolbarItem from "@/components/Prompt/Common/Sidebar/ToolbarItem";
import { TemplateSidebarLinks } from "@/common/constants";
import FavoriteIcon from "../../FavoriteButton";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import useVariant from "../../Hooks/useVariant";
const ExecutionsLazy = lazy(() => import("./Executions"));
const TemplateDetailsLazy = lazy(() => import("../../TemplateDetails"));
const ApiAccessLazy = lazy(() => import("./ApiAccess"));
const ExtensionLazy = lazy(() => import("./Extension"));
const FeedbackLazy = lazy(() => import("../../Feedback"));
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import useBrowser from "@/hooks/useBrowser";

const drawerWidth = 352;

interface SidebarProps {
  template: Templates;
  executions: TemplatesExecutions[];
}

function Sidebar({ template, executions }: SidebarProps) {
  const dispatch = useAppDispatch();
  const { isVariantB } = useVariant();
  const { isMobile } = useBrowser();
  const activeLink = useAppSelector(state => state.template.activeSideBarLink);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const theme = useTheme();
  const handleCloseSidebar = () => {
    dispatch(setActiveToolbarLink(null));
  };
  const isAdmin = useAppSelector(isAdminFn);
  const isOwner = isAdmin || currentUser?.id === template.created_by.id;
  const sidebarLinks = isVariantB
    ? TemplateSidebarLinks.filter(link => (isOwner ? link.name !== "clone" : link.name !== "customize"))
    : TemplateSidebarLinks.filter(link => !["customize", "clone"].includes(link.name));

  const open = !!activeLink?.name;

  return (
    <Box
      sx={{
        width: { xs: open ? "100%" : 0, md: "auto" },
        height: "100%",
        position: { xs: "absolute", md: "sticky" },
        top: 0,
        bgcolor: "surface.3",
        display: "flex",
        flexDirection: isVariantB ? "row" : "row-reverse",
        gap: "1px",
      }}
    >
      {!isMobile && (
        <>
          {isVariantB ? (
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
                gap={1}
                sx={{
                  p: "16px",
                  zIndex: 1300,
                  bgcolor: "surface.1",
                }}
              >
                <Tooltip
                  placement="top"
                  arrow
                  title={`Created by ${template.created_by.first_name || template.created_by.username}`}
                >
                  <Image
                    src={template.created_by.avatar ?? require("@/assets/images/default-avatar.jpg")}
                    alt={template.created_by.username}
                    width={30}
                    height={30}
                    priority={false}
                    loading="lazy"
                    style={{
                      borderRadius: 30,
                    }}
                  />
                </Tooltip>

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

                {sidebarLinks.map(link => (
                  <ToolbarItem
                    key={link.title}
                    item={link}
                    template={template}
                    executionsLength={executions?.length ?? 0}
                  />
                ))}
              </Box>
            </Box>
          ) : (
            <Stack
              display={{ xs: "none", md: "flex" }}
              gap={1}
              sx={{
                p: "16px",
                zIndex: 1300,
                bgcolor: "surface.1",
              }}
            >
              {sidebarLinks.map(link => (
                <ToolbarItem
                  key={link.title}
                  item={link}
                  template={template}
                  executionsLength={executions?.length ?? 0}
                />
              ))}
            </Stack>
          )}
        </>
      )}

      <Drawer
        variant="persistent"
        anchor="right"
        open={open}
        sx={{
          width: { xs: "100%", md: open ? drawerWidth : 0 },
          transition: theme.transitions.create("width", { duration: 200 }),
          position: "relative",
          "& .MuiDrawer-paper": {
            display: open ? "flex" : "none",
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            bgcolor: "surface.1",
            border: "none",
          },
        }}
      >
        <Stack
          direction={"row"}
          alignItems="center"
          justifyContent="space-between"
          sx={{
            bgcolor: "surface.1",
            p: "16px 24px",
            position: "sticky",
            top: 0,
            left: 0,
            zIndex: 1300,
          }}
        >
          <Typography
            sx={{
              color: "common.black",
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            {activeLink?.title}
          </Typography>

          <IconButton
            onClick={handleCloseSidebar}
            sx={{
              border: "none",
              opacity: 0.45,
              "&:hover": {
                bgcolor: "surface.2",
                opacity: 1,
              },
            }}
          >
            <Close />
          </IconButton>
        </Stack>
        {activeLink?.name === "executions" && <ExecutionsLazy template={template} />}
        {activeLink?.name === "details" && <TemplateDetailsLazy template={template} />}
        {activeLink?.name === "feedback" && <FeedbackLazy />}
        {activeLink?.name === "api" && <ApiAccessLazy template={template} />}
        {activeLink?.name === "extension" && <ExtensionLazy />}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
