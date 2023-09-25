import React, { useEffect, useRef, useState } from "react";
import { useGetPromptTemplatesQuery } from "@/core/api/templates";
import { Box, Stack, SwipeableDrawer, Typography } from "@mui/material";
import { Sidebar } from "@/components/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/core/store";
import { setOpenSidebar } from "@/core/store/sidebarSlice";
import { Header } from "@/components/builder/Header";
import TemplateForm from "@/components/common/forms/TemplateForm";
import { useGetEnginesQuery } from "@/core/api/engines";
import { PromptCardAccordion } from "@/components/builder/PromptCardAccordion";

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
  const { data: engines } = useGetEnginesQuery();

  useEffect(() => {
    setTemplateData(fetchedTemplate);
    prompts.current = fetchedTemplate?.prompts;
  }, [fetchedTemplate]);
  console.log(prompts.current);

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

          {prompts.current?.map(prompt => {
            return (
              <PromptCardAccordion
                key={prompt.id}
                prompt={prompt}
              />
            );
          })}
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
