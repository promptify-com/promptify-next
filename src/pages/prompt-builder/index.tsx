import React, { useEffect, useRef, useState } from "react";
import { useGetPromptTemplatesQuery } from "@/core/api/templates";
import { Box, Stack, SwipeableDrawer, Typography } from "@mui/material";
import { Sidebar } from "@/components/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/core/store";
import { setOpenSidebar } from "@/core/store/sidebarSlice";
import { Header } from "@/components/builder/Header";
import TemplateForm from "@/components/common/forms/TemplateForm";
import { PromptCardAccordion } from "@/components/builder/PromptCardAccordion";
import { IEditPrompts } from "@/common/types/builder";
import { useGetEnginesQuery } from "@/core/api/engines";

const templateId = 571;

export const Builder = () => {
  const sidebarOpen = useSelector((state: RootState) => state.sidebar.open);
  const dispatch = useDispatch();
  const toggleSidebar = () => {
    dispatch(setOpenSidebar(!sidebarOpen));
  };
  const { data: engines } = useGetEnginesQuery();
  const [templateDrawerOpen, setTemplateDrawerOpen] = React.useState(false);
  const { data: fetchedTemplate } = useGetPromptTemplatesQuery(templateId);
  const [templateData, setTemplateData] = useState(fetchedTemplate);
  const [prompts, setPrompts] = useState<IEditPrompts[]>([]);

  useEffect(() => {
    setTemplateData(fetchedTemplate);
    initPrompts();
  }, [fetchedTemplate]);

  const initPrompts = () => {
    if (fetchedTemplate?.prompts) {
      const _prompts = fetchedTemplate.prompts.map(prompt => {
        const initialParams = prompt.parameters.map(param => ({
          parameter_id: param.parameter.id,
          score: param.score,
          name: param.parameter.name,
          is_visible: param.is_visible,
          is_editable: param.is_editable,
          descriptions: param.parameter.score_descriptions,
        }));

        return {
          id: prompt.id,
          count: prompts.toString(),
          title: prompt.title || `Prompt #1`,
          content: prompt.content || "Describe here prompt parameters, for example {{name:John Doe}}",
          engine_id: prompt.engine?.id || engines![0].id,
          dependencies: prompt.dependencies || [],
          parameters: initialParams,
          order: 1,
          output_format: prompt.output_format,
          model_parameters: prompt.model_parameters,
          is_visible: prompt.is_visible,
          show_output: prompt.show_output,
          prompt_output_variable: prompt.prompt_output_variable,
        };
      });

      setPrompts(_prompts);
    }
  };

  const changePrompt = (prompt: IEditPrompts) => {
    const _prompts = prompts.map(prevPrompt => {
      if (
        prevPrompt.id === prompt.id ||
        prevPrompt.id === prompt.temp_id ||
        prevPrompt.temp_id === prompt.id ||
        prevPrompt.temp_id === prompt.temp_id
      ) {
        return prompt;
      }
      return prevPrompt;
    });
    console.log(_prompts);

    setPrompts(_prompts);
  };

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
            width: "70%",
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

          {prompts.map(prompt => {
            return (
              <PromptCardAccordion
                key={prompt.id}
                prompt={prompt}
                setPrompt={changePrompt}
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
