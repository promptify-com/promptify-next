import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Icon from "@mui/material/Icon";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import ClearAll from "@mui/icons-material/ClearAll";
import Tooltip from "@mui/material/Tooltip";
import FormatListBulleted from "@mui/icons-material/FormatListBulleted";
import { useTheme } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setOpenBuilderSidebar } from "@/core/store/sidebarSlice";
import PromptSequence from "@/components/builderSidebar/PromptSequence";
import Help from "@/components/builderSidebar/Help";
import TestLog from "@/components/builderSidebar/TestLog";
import Support from "@/components/builder/Assets/Support";
import Contact from "@/components/builder/Assets/Contact";
import Api from "@/components/builder/Assets/Api";
import { useDeletePromptExecutionsMutation, useGetPromptExecutionsQuery } from "@/core/api/templates";
import type { IEditPrompts, ISidebarLink } from "@/common/types/builder";
import { initialState as initialBuilderState } from "@/core/store/builderSlice";
import TemplateForm from "../common/forms/TemplateForm";
import type { Templates } from "@/core/api/dto/templates";
import type { FormType } from "@/common/types/template";

const LINKS: ISidebarLink[] = [
  {
    key: "templateForm",
    name: "Template details",
    icon: <InfoOutlinedIcon />,
  },
  {
    key: "list",
    name: "Prompt sequence",
    icon: <FormatListBulleted />,
  },
  {
    key: "test_log",
    name: "Test log",
    icon: <Contact />,
  },
  {
    key: "help",
    name: "Help",
    icon: <Support />,
  },
  {
    key: "api",
    name: "Api",
    icon: <Api />,
  },
];

interface Props {
  prompts: IEditPrompts[];
  setPrompts: Dispatch<SetStateAction<IEditPrompts[]>>;
  isTemplateLoading?: boolean;
  createMode: FormType;
  handleSaveTemplate: (newTemplate?: Templates) => Promise<void>;
  templateData: Templates | undefined;
  isNewTemplate: boolean;
  templateDrawerOpen?: boolean;
  setTemplateDrawerOpen?: Dispatch<SetStateAction<boolean>>;
}

export const BuilderSidebar = ({
  prompts,
  setPrompts,
  createMode,
  handleSaveTemplate,
  templateData,
  isNewTemplate,
  isTemplateLoading,
  templateDrawerOpen,
  setTemplateDrawerOpen,
}: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { template, engines } = useAppSelector(state => state.builder ?? initialBuilderState);
  const templateId = template?.id;
  const [open, setOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<ISidebarLink>();
  const { data: executions } = useGetPromptExecutionsQuery(templateId!, { skip: activeLink?.key !== "test_log" });
  const [deletePrompt] = useDeletePromptExecutionsMutation();

  const handleOpenSidebar = (link: ISidebarLink) => {
    setOpen(true);
    setActiveLink(link);
    dispatch(setOpenBuilderSidebar(true));
  };

  const handleCloseSidebar = () => {
    setOpen(false);
    dispatch(setOpenBuilderSidebar(false));
    if (activeLink?.key === "templateForm" && templateDrawerOpen) {
      setTemplateDrawerOpen?.(false);
    }
  };

  const deleteAllExecutions = async () => {
    if (templateId) await deletePrompt(templateId);
  };

  useEffect(() => {
    if (isTemplateLoading && !template) {
      return;
    }
    if (templateDrawerOpen) {
      const link = LINKS.find(link => link.key === "templateForm");
      if (!link) return;
      handleOpenSidebar(link);
    }
  }, [template, isTemplateLoading, templateDrawerOpen]);

  const renderIcon = (item: ISidebarLink) => {
    const iconColor = item.key === activeLink?.key ? theme.palette.primary.main : "#1C1B1F";

    switch (item.key) {
      case "help":
        return <Support color={iconColor} />;
      case "test_log":
        return <Contact color={iconColor} />;
      case "api":
        return <Api color={iconColor} />;
      default:
        return item.icon;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        position: "fixed",
        right: 0,
        top: 0,
        height: "100vh",
        width: "64px",
        borderRadius: "var(--none, 0px)",
        padding: "75px var(--1, 8px)",
        zIndex: 1,
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--3, 24px)",
        alignSelf: "stretch",
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: "auto",
        ...(open && {
          width: "64px",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginRight: theme.custom.promptBuilder.drawerWidth,
        }),
      }}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        gap={1}
        mt={"120px"}
      >
        {LINKS.map(link => (
          <Grid key={link.name}>
            <ListItem
              disablePadding
              onClick={() => handleOpenSidebar(link)}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  borderRadius: "8px",
                  mx: 1,
                  padding: "16px 22px ",
                  bgcolor: open && activeLink?.name === link.name ? "action.hover" : "transparent",
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
                      color: activeLink?.name === link.name ? "primary.main" : "onSurface",
                      justifyContent: "center",
                    }}
                  >
                    <Icon>{renderIcon(link)}</Icon>
                  </ListItemIcon>
                </Box>
              </ListItemButton>
            </ListItem>
          </Grid>
        ))}
      </Box>
      <Drawer
        sx={{
          width: theme.custom.promptBuilder.drawerWidth,
          flexShrink: 0,
          mt: theme.custom.promptBuilder.headerHeight,
          "& .MuiDrawer-paper": {
            width: theme.custom.promptBuilder.drawerWidth,
            bgcolor: "surface.1",
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
          p={"16px 24px"}
          height="70px"
          boxSizing={"border-box"}
        >
          <Typography
            sx={{
              flex: 1,
              color: "var(--onSurface, #1B1B1E)",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "140%",
              letterSpacing: "0.5px",
              textTransform: "capitalize",
            }}
          >
            {activeLink?.name}
          </Typography>
          {activeLink?.key === "test_log" && executions && executions.length > 0 && (
            <Tooltip title="Delete all">
              <IconButton
                onClick={deleteAllExecutions}
                sx={{
                  border: "none",
                  "&:hover": {
                    bgcolor: "surface.2",
                  },
                }}
              >
                <ClearAll />
              </IconButton>
            </Tooltip>
          )}

          <IconButton
            onClick={handleCloseSidebar}
            sx={{
              border: "none",
              "&:hover": {
                bgcolor: "surface.2",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
        {activeLink?.key === "templateForm" && (
          <Box
            sx={{
              padding: "16px 24px",
            }}
          >
            <TemplateForm
              type={createMode}
              templateData={templateData}
              darkMode
              onSaved={template => (isNewTemplate ? handleSaveTemplate(template) : window.location.reload())}
              onClose={handleCloseSidebar}
            />
          </Box>
        )}
        {activeLink?.key === "list" && (
          <PromptSequence
            prompts={prompts}
            engines={engines}
            setPrompts={setPrompts}
          />
        )}
        {activeLink?.key === "help" && <Help />}
        {activeLink?.key === "test_log" && <TestLog />}
      </Drawer>
    </Box>
  );
};
