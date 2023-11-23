import React, { useEffect, useState } from "react";
import { usePublishTemplateMutation } from "@/core/api/templates";
import { Alert, Box, Snackbar, Stack, SwipeableDrawer, Typography } from "@mui/material";

import { setOpenDefaultSidebar } from "@/core/store/sidebarSlice";
import { Header } from "@/components/builder/Header";
import TemplateForm from "@/components/common/forms/TemplateForm";
import { IEditPrompts } from "@/common/types/builder";
import { isPromptVariableValid } from "@/common/helpers/promptValidator";
import { updateTemplate } from "@/hooks/api/templates";
import { BuilderSidebar } from "@/components/builderSidebar";
import { Engine, Templates } from "@/core/api/dto/templates";
import { client } from "@/common/axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PromptList from "@/components/builder/PromptCardAccordion/PromptList";
import { useRouter } from "next/router";
import useToken from "@/hooks/useToken";
import { IEditTemplate } from "@/common/types/editTemplate";
import { BUILDER_TYPE } from "@/common/constants";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { handleEngines, handlePrompts } from "@/core/store/builderSlice";
import Sidebar from "@/components/sidebar/Sidebar";
import { theme } from "@/theme";

interface PromptBuilderProps {
  templateData: Templates;
  initPrompts: IEditPrompts[];
  engines: Engine[];
}

export const PromptBuilder = ({ templateData, initPrompts, engines }: PromptBuilderProps) => {
  const router = useRouter();
  const token = useToken();
  const defaultSidebarOpen = useAppSelector(state => state.sidebar.defaultSidebarOpen);
  const builderSidebarOpen = useAppSelector(state => state.sidebar.builderSidebarOpen);
  const [prompts, setPrompts] = useState(initPrompts);
  const [templateDrawerOpen, setTemplateDrawerOpen] = useState(Boolean(router.query.editor));
  const [publishTemplate] = usePublishTemplateMutation();
  const [messageSnackBar, setMessageSnackBar] = useState({ status: false, message: "" });
  const [errorSnackBar, setErrorSnackBar] = useState({ status: false, message: "" });
  const dispatch = useAppDispatch();
  const toggleSidebar = () => dispatch(setOpenDefaultSidebar(!defaultSidebarOpen));

  const storedPrompts = useAppSelector(state => state.builder.prompts);
  const storedEngines = useAppSelector(state => state.builder.engines);
  useEffect(() => {
    if (!storedPrompts.length) {
      dispatch(handlePrompts(initPrompts));
    }

    if (!storedEngines.length) {
      dispatch(handleEngines(engines));
    }
  }, [initPrompts, engines]);

  useEffect(() => {
    setPrompts(storedPrompts);
  }, [storedPrompts]);

  useEffect(() => {
    if (!templateData?.id) {
      router.push("/404");
      return;
    }

    toggleSidebar();
  }, []);

  useEffect(() => {
    if (!token) {
      router.push("/signin");
    }

    if (router.query.editor) {
      const { editor, ...restQueryParams } = router.query;

      router.replace(
        {
          pathname: router.pathname,
          query: restQueryParams,
        },
        undefined,
        { scroll: false, shallow: true },
      );
    }
  }, [router.query]);

  const handleSaveTemplate = async () => {
    if (!templateData) {
      setErrorSnackBar({ status: true, message: "Please try again or refresh the page" });
      return;
    }

    const invalids: string[] = [];
    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];
      const validation = isPromptVariableValid(prompt.content);
      if (!validation.isValid) {
        invalids.push(validation.message);
        break;
      }
    }

    if (invalids.length) {
      setErrorSnackBar({ status: true, message: `You have entered an invalid prompt variable ${invalids.toString()}` });
      return;
    }

    const _prompts = prompts.map((prompt, index, array) => {
      const depend = array[index - 1]?.id || array[index - 1]?.temp_id;
      return {
        ...prompt,
        dependencies: depend ? [depend] : [],
        parameters: prompt?.parameters?.map(params => ({
          parameter_id: params.parameter_id,
          score: params.score,
          is_visible: params.is_visible,
          is_editable: params.is_editable,
        })),
      };
    });

    const _template: IEditTemplate = {
      title: templateData.title,
      description: templateData.description,
      example: templateData.example,
      thumbnail: templateData.thumbnail,
      is_visible: templateData.is_visible,
      language: templateData.language,
      duration: templateData.duration.toString(),
      category: templateData.category.id,
      difficulty: templateData.difficulty,
      status: templateData.status,
      prompts_list: _prompts,
      context: templateData.context,
      tags: templateData.tags,
      executions_limit: templateData.executions_limit,
      meta_title: templateData.meta_title,
      meta_description: templateData.meta_description,
      meta_keywords: templateData.meta_keywords,
    };

    await updateTemplate(templateData.id, _template);
    setMessageSnackBar({ status: true, message: "Prompt template saved with success" });
    setTimeout(() => {
      window.location.reload();
    }, 700);
  };

  const handlePublishTemplate = async () => {
    if (!templateData) {
      setErrorSnackBar({ status: true, message: "Please try again or refresh the page" });
      return;
    }

    await publishTemplate(templateData.id);
    window.location.reload();
  };

  return (
    <Box
      sx={{
        bgcolor: "surface.4",
        minHeight: "100svh",
      }}
    >
      <Sidebar />
      <BuilderSidebar />
      <Box
        sx={{
          ml: theme.custom.leftClosedSidebarWidth,
          mr: builderSidebarOpen ? "352px" : "0px",
        }}
      >
        <Header
          status={templateData?.status || "DRAFT"}
          title={templateData?.title || ""}
          templateSlug={templateData.slug}
          onPublish={handlePublishTemplate}
          onSave={handleSaveTemplate}
          onEditTemplate={() => setTemplateDrawerOpen(true)}
          type={BUILDER_TYPE.USER}
        />

        <Box
          sx={{
            width: "70%",
            mx: "auto",
            p: "24px 0 40px",
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

          <Box>
            <DndProvider backend={HTML5Backend}>
              <PromptList
                prompts={prompts}
                setPrompts={setPrompts}
                engines={engines}
              />
            </DndProvider>
          </Box>
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
      <Snackbar
        open={messageSnackBar.status}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={3000}
        message="Prompt template saved with success"
        onClose={() => setMessageSnackBar({ status: false, message: "" })}
      />
      <Snackbar
        open={errorSnackBar.status}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={4000}
        onClose={() => setErrorSnackBar({ status: false, message: "" })}
      >
        <Alert
          onClose={() => setErrorSnackBar({ status: false, message: "" })}
          severity="error"
          sx={{ width: "100%", bgcolor: "errorContainer", color: "onErrorContainer" }}
        >
          {errorSnackBar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const initPrompts = (template: Templates, engines: Engine[]) => {
  const textEngine = engines.find(engine => engine.output_type === "TEXT");

  if (template?.prompts) {
    const _prompts = template.prompts.map((prompt, index) => {
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
        title: prompt.title || `Prompt #1`,
        content: prompt.content || "Describe here prompt parameters, for example {{name:text}}",
        engine_id: prompt.engine?.id || textEngine?.id,
        dependencies: prompt.dependencies || [],
        parameters: initialParams,
        order: index + 1,
        output_format: prompt.output_format,
        model_parameters: prompt.model_parameters,
        is_visible: prompt.is_visible,
        show_output: prompt.show_output,
        prompt_output_variable: prompt.prompt_output_variable,
      };
    });

    return _prompts;
  }
};

export async function getServerSideProps({ params }: { params: { slug: string } }) {
  const { slug } = params;
  let engines: Engine[] = [];
  let templateData: Templates = {} as Templates;
  let _initPrompts: ReturnType<typeof initPrompts> = [];

  try {
    const [_fetchedTemplate, _engines] = await Promise.all([
      client.get<Templates>(`/api/meta/templates/by-slug/${slug}/`),
      client.get<Engine[]>(`/api/meta/engines`),
    ]);
    templateData = _fetchedTemplate.data;
    engines = _engines.data;
    _initPrompts = initPrompts(templateData, engines) ?? [];
  } catch (error) {
    console.error("Template/engines request failed:", error);
  }

  return {
    props: {
      title: "Promptify | Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
      templateData,
      initPrompts: _initPrompts,
      engines,
    },
  };
}
export default PromptBuilder;
