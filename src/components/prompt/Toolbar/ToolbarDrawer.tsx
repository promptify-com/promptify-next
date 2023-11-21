import { useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { Executions } from "./Executions";
import { Feedback } from "./Feedback";
import { Extension } from "./Extension";
import { ApiAccess } from "./ApiAccess";
import { TemplateDetails } from "./TemplateDetails";
import { openToolbarDrawer, setActiveToolbarLink } from "@/core/store/templatesSlice";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";

interface Props {
  template: Templates;
  executions: TemplatesExecutions[];
  isExecutionsLoading: boolean;
  refetchTemplateExecutions: () => void;
}

function ToolbarDrawer({ template, executions, isExecutionsLoading, refetchTemplateExecutions }: Props) {
  const DRAWER_WIDTH = 352;

  const theme = useTheme();
  const dispatch = useAppDispatch();

  const sideBarOpen = useAppSelector(state => state.template.isSidebarExpanded);
  const activeLink = useAppSelector(state => state.template.activeSideBarLink);

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={sideBarOpen}
      sx={{
        width: sideBarOpen ? DRAWER_WIDTH : 0,
        transition: theme.transitions.create("width", { duration: 200 }),
        "& .MuiDrawer-paper": {
          mt: "92px",
          bgcolor: "surface.1",
          borderLeft: "none",
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
          onClick={() => {
            dispatch(openToolbarDrawer(false));
            dispatch(setActiveToolbarLink(null));
          }}
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
      {activeLink?.name === "executions" && (
        <Executions
          template={template}
          executions={executions}
          isExecutionsLoading={isExecutionsLoading}
          refetchTemplateExecutions={refetchTemplateExecutions}
        />
      )}
      {activeLink?.name === "feedback" && <Feedback />}
      {activeLink?.name === "api" && <ApiAccess template={template} />}
      {activeLink?.name === "extension" && <Extension />}
      {activeLink?.name === "details" && <TemplateDetails template={template} />}
    </Drawer>
  );
}

export default ToolbarDrawer;
