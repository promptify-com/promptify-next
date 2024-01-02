import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Close from "@mui/icons-material/Close";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { isValidUserFn } from "@/core/store/userSlice";
import { setActiveToolbarLink } from "@/core/store/templatesSlice";
import ToolbarItem from "@/components/Prompt/Common/Sidebar/ToolbarItem";
import { TemplateSidebarLinks } from "@/common/constants";
import FavoriteIcon from "../FavoriteIcon";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { isDesktopViewPort } from "@/common/helpers";
import useVariant from "../../Hooks/useVariant";
import lazy from "next/dynamic";
import Image from "@/components/design-system/Image";

const ExecutionsLazy = lazy(() => import("./Executions"));
const TemplateDetailsLazy = lazy(() => import("./TemplateDetails"));
const ApiAccessLazy = lazy(() => import("./ApiAccess"));
const ExtensionLazy = lazy(() => import("./Extension"));
const FeedbackLazy = lazy(() => import("./Feedback"));
const drawerWidth = 352;

interface SidebarProps {
  template: Templates;
  executions: TemplatesExecutions[];
}

function Sidebar({ template, executions }: SidebarProps) {
  const dispatch = useAppDispatch();
  const { isVariantA } = useVariant();
  const isMobile = !isDesktopViewPort();
  const activeLink = useAppSelector(state => state.template.activeSideBarLink);
  const isValidUser = useAppSelector(isValidUserFn);
  const theme = useTheme();
  const handleCloseSidebar = () => {
    dispatch(setActiveToolbarLink(null));
  };
  const open = !!activeLink?.name;
  const shouldFilterCustomize = isVariantA || (!isVariantA && !isValidUser);
  const filtredSidebarLinks = shouldFilterCustomize
    ? TemplateSidebarLinks.filter(item => item.name !== "customize")
    : TemplateSidebarLinks;
  return (
    <Box
      sx={{
        width: { xs: open ? "100%" : 0, md: "auto" },
        height: "100%",
        position: { xs: "absolute", md: "sticky" },
        top: 0,
        bgcolor: "surface.3",
        display: "flex",
        flexDirection: !isVariantA ? "row" : "row-reverse",
        gap: "1px",
      }}
    >
      {!isMobile && (
        <>
          {!isVariantA ? (
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
                <Image
                  src={template.created_by.avatar}
                  alt={template.created_by.username}
                  width={30}
                  height={30}
                  priority={false}
                  loading="lazy"
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

                {filtredSidebarLinks.map(link => (
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
              {filtredSidebarLinks.map(link => (
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
