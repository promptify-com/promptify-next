import React, { useEffect, useRef, useState } from "react";
import { useGetPromptTemplatesQuery } from "@/core/api/templates";
import { INodesData } from "@/common/types/builder";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { Sidebar } from "@/components/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/core/store";
import { setOpenSidebar } from "@/core/store/sidebarSlice";
import { Header } from "@/components/builder/Header";
import TemplateForm from "@/components/common/forms/TemplateForm";
import { ArrowDropDown, Menu, MoreVert, PlayCircle, Settings } from "@mui/icons-material";
import { theme } from "@/theme";

const templateId = 521;

export const Builder = () => {
  const sidebarOpen = useSelector((state: RootState) => state.sidebar.open);
  const dispatch = useDispatch();
  const toggleSidebar = () => {
    dispatch(setOpenSidebar(!sidebarOpen));
  };
  const [templateDrawerOpen, setTemplateDrawerOpen] = React.useState(false);
  const { data: fetchedTemplate } = useGetPromptTemplatesQuery(templateId);
  const [templateData, setTemplateData] = useState(fetchedTemplate);
  const prompts = useRef(fetchedTemplate?.prompts);

  useEffect(() => {
    setTemplateData(fetchedTemplate);
    prompts.current = fetchedTemplate?.prompts;
  }, [fetchedTemplate]);

  return (
    <Box
      sx={{
        bgcolor: "surface.3",
        minHeight: "100svh",
      }}
    >
      <Sidebar
        open={sidebarOpen}
        toggleSideBar={() => toggleSidebar()}
        fullHeight
      />
      <Box
        sx={{
          ml: sidebarOpen ? "299px" : "86px",
        }}
      >
        <Header
          status={templateData?.status || "DRAFT"}
          title={templateData?.title || ""}
          onPublish={() => {}}
          onDrawerOpen={() => setTemplateDrawerOpen(true)}
          onSave={() => {}}
          templateSlug={templateData?.slug}
        />

        <Box
          sx={{
            width: "60%",
            m: "20px auto",
          }}
        >
          <Stack
            gap={1}
            mb={2}
          >
            <Typography sx={{ fontSize: 34, fontWeight: 400 }}>Chained Prompt Builder</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
              Structure your prompts for a productive and more deterministic AI. You chained prompts will guide AI
              content creation with focus and intent. Learn more
            </Typography>
          </Stack>

          {prompts.current?.map(prompt => (
            <Accordion
              key={prompt.id}
              defaultExpanded
              sx={{
                bgcolor: "surface.1",
                m: "24px 0 !important",
                borderRadius: "16px !important",
                boxShadow: "none",
                transition: "box-shadow 0.3s ease-in-out",
                ":before": { display: "none" },
                ":hover": {
                  boxShadow:
                    "0px 3px 3px -2px rgba(225, 226, 236, 0.20), 0px 3px 4px 0px rgba(225, 226, 236, 0.14), 0px 1px 8px 0px rgba(27, 27, 30, 0.12)",
                },
              }}
            >
              <AccordionSummary
                sx={{
                  ".MuiAccordionSummary-content, .Mui-expanded": {
                    m: "12px 0",
                    alignItems: "center",
                    gap: 2,
                    minHeight: "42px",
                  },
                }}
              >
                <Menu
                  sx={{
                    width: 24,
                    height: 24,
                    opacity: 0.3,
                    ":hover": {
                      opacity: 1,
                    },
                  }}
                />
                <Typography>#{prompt.order}</Typography>
                <Button endIcon={<ArrowDropDown />}>
                  <img
                    src={prompt.engine.icon}
                    alt={prompt.engine.name}
                    loading="lazy"
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                    }}
                  />
                  {prompt.engine.name}
                </Button>
                <Stack
                  flex={1}
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"flex-end"}
                  gap={1}
                >
                  {prompt.model_parameters && (
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 400,
                        color: "onSurface",
                        opacity: 0.5,
                        whiteSpace: "nowrap",
                        width: "200px",
                        overflow: "hidden",
                      }}
                    >
                      Max Length: {prompt.model_parameters.maximumLength || 0}, Temperature:{" "}
                      {prompt.model_parameters.temperature || 0}, Top P: {prompt.model_parameters.topP || 0}, Frequency
                      Penalty: {prompt.model_parameters.frequencyPenalty || 0}, Presence Penalty:{" "}
                      {prompt.model_parameters.presencePenalty || 0}
                    </Typography>
                  )}
                  <IconButton
                    onClick={() => {}}
                    sx={{
                      border: "none",
                      "&:hover": {
                        bgcolor: "surface.2",
                      },
                    }}
                  >
                    <Settings sx={{ width: 24, height: 24 }} />
                  </IconButton>
                  <IconButton
                    onClick={() => {}}
                    sx={{
                      border: "none",
                      "&:hover": {
                        bgcolor: "surface.2",
                      },
                    }}
                  >
                    <MoreVert sx={{ width: 24, height: 24 }} />
                  </IconButton>
                </Stack>
              </AccordionSummary>
              <Divider sx={{ borderColor: "surface.3" }} />
              <AccordionDetails
                sx={{
                  p: 0,
                }}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  p={"8px 16px 8px 24px"}
                >
                  <Typography>{prompt.title}</Typography>
                  <Button startIcon={<PlayCircle />}>Test run</Button>
                </Stack>
                <Typography
                  sx={{
                    p: "8px 16px 8px 24px",
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  Prompt Instructions:
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {!!templateData && (
          <SwipeableDrawer
            anchor={"left"}
            open={templateDrawerOpen}
            onClose={() => setTemplateDrawerOpen(false)}
            onOpen={() => setTemplateDrawerOpen(true)}
            PaperProps={{
              sx: {
                width: "430px",
                minWidth: "30svw",
              },
            }}
          >
            <Box
              sx={{
                bgcolor: "#FDFBFF",
                p: "24px 32px",
              }}
            >
              <TemplateForm
                type="edit"
                templateData={templateData}
                darkMode
                onSaved={() => window.location.reload()}
                onClose={() => setTemplateDrawerOpen(false)}
              />
            </Box>
          </SwipeableDrawer>
        )}
      </Box>
    </Box>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      title: "Promptify | Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
    },
  };
}
export default Builder;
