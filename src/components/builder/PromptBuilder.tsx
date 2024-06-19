import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import useToken from "@/hooks/useToken";
import { useTheme } from "@mui/material/styles";
import { setToast } from "@/core/store/toastSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { isPromptVariableValid } from "@/common/helpers/promptValidator";
import { useGetEnginesQuery } from "@/core/api/engines";
import { updateTemplate } from "@/hooks/api/templates";
import { setOpenBuilderSidebar } from "@/core/store/sidebarSlice";
import { useGetPromptTemplateBySlugQuery, usePublishTemplateMutation } from "@/core/api/templates";
import builderSlice, { setEngines, setIsTemplateOwner, setTemplate } from "@/core/store/builderSlice";
import { handleInitPrompt } from "@/common/helpers/initPrompt";
import { BUILDER_DESCRIPTION, BUILDER_TYPE } from "@/common/constants";
import { Layout } from "@/layout";
import Header from "@/components/builder/Header";
import PromptList from "@/components/builder/PromptCardAccordion/PromptList";
import TemplateForm from "@/components/common/forms/TemplateForm";
import { BuilderSidebar } from "@/components/builderSidebar";
import Sidebar from "@/components/sidebar/Sidebar";
import type { IEditTemplate } from "@/common/types/editTemplate";
import type { Templates } from "@/core/api/dto/templates";
import type { IEditPrompts } from "@/common/types/builder";
import { DesktopIcon } from "@/assets/icons/DesktopIcon";
import useBrowser from "@/hooks/useBrowser";
import store from "@/core/store";

export const PromptBuilder = ({ isNewTemplate = false }) => {
  const router = useRouter();
  const token = useToken();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [publishTemplate] = usePublishTemplateMutation();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const removedEditorQS = useRef(false);
  const { isMobile } = useBrowser();

  const slug = router.query.slug as string;

  const { data: engines } = useGetEnginesQuery(undefined, { skip: isMobile });
  const { data: fetchedTemplateData, isLoading: isTemplateLoading } = useGetPromptTemplateBySlugQuery(slug, {
    skip: isNewTemplate,
  });

  const [prompts, setPrompts] = useState<IEditPrompts[]>([]);
  const [templateData, setTemplateData] = useState<Templates | undefined>(
    isNewTemplate ? ({ title: "new_template_12345" } as Templates) : undefined,
  );

  useEffect(() => {
    if (!store) {
      return;
    }
    store.injectReducers([{ key: "builder", asyncReducer: builderSlice }]);
  }, [store]);

  useEffect(() => {
    if (engines) {
      dispatch(setEngines(engines));
    }
    if (fetchedTemplateData) {
      dispatch(setTemplate(fetchedTemplateData));
      if (currentUser) {
        dispatch(setIsTemplateOwner(fetchedTemplateData.created_by.id === currentUser?.id || currentUser?.is_admin));
      }

      setTemplateData(fetchedTemplateData);
    }

    if (fetchedTemplateData && engines) {
      const processedPrompts = handleInitPrompt(fetchedTemplateData, engines) as IEditPrompts[];
      setPrompts(processedPrompts);
    }
  }, [fetchedTemplateData, engines]);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      dispatch(setOpenBuilderSidebar(false));
    };
    router.events.on("routeChangeStart", handleRouteChangeStart);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router.events]);

  const builderSidebarOpen = useAppSelector(state => state.sidebar.builderSidebarOpen);

  const [templateDrawerOpen, setTemplateDrawerOpen] = useState(Number(router.query.editor) === 1);

  const createMode = isNewTemplate ? "create" : "edit";

  useEffect(() => {
    if (!token) {
      router.push("/signin");
    } else if (router.query.editor && !removedEditorQS.current) {
      const { editor, ...restQueryParams } = router.query;
      removedEditorQS.current = true;

      router.replace(
        {
          pathname: router.pathname,
          query: Object.keys(restQueryParams).length ? restQueryParams : null,
        },
        undefined,
        { scroll: false, shallow: true },
      );
    }
  }, [router.query]);

  const handleSaveTemplate = async (newTemplate?: Templates) => {
    let currentTemplateData = newTemplate || templateData;
    if (!currentTemplateData) return;

    if (newTemplate) {
      setTemplateData(newTemplate);
    }

    if (!currentTemplateData.id) {
      let message = "Please try again or refresh the page";
      if (createMode === "create") {
        message = "Please try again, and make sure you've entered template information!";
        setTemplateDrawerOpen(true);
      }
      dispatch(
        setToast({
          message,
          severity: "error",
          duration: 4000,
          position: { vertical: "top", horizontal: "center" },
        }),
      );
      return;
    }

    // Validate prompts
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
      dispatch(
        setToast({
          message: `You have entered an invalid prompt variable ${invalids.join(", ")}`,
          severity: "error",
          duration: 4000,
          position: { vertical: "top", horizontal: "center" },
        }),
      );
      return;
    }

    const _prompts = prompts.map((prompt, index, array) => {
      if (prompt.output_format === "custom" && prompt.custom_output_format) {
        prompt.output_format = prompt.custom_output_format;
      }

      const depend = array[index - 1]?.id || array[index - 1]?.temp_id;
      const { custom_output_format, ...restPrompt } = prompt;

      return {
        ...restPrompt,
        order: index,
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
      title: currentTemplateData.title,
      description: currentTemplateData.description,
      example: currentTemplateData.example,
      thumbnail: currentTemplateData.thumbnail,
      is_visible: currentTemplateData.is_visible,
      language: currentTemplateData.language,
      duration: currentTemplateData.duration.toString(),
      category: currentTemplateData.category.id,
      difficulty: currentTemplateData.difficulty,
      status: currentTemplateData.status,
      prompts_list: _prompts,
      context: currentTemplateData.context,
      tags: currentTemplateData.tags,
      executions_limit: currentTemplateData.executions_limit,
      meta_title: currentTemplateData.meta_title,
      meta_description: currentTemplateData.meta_description,
      meta_keywords: currentTemplateData.meta_keywords,
    };

    const updatedTemplate = await updateTemplate(currentTemplateData.id, _template);

    const updatedPrompts = updatedTemplate.prompts.map((prompt: IEditPrompts) => {
      return {
        id: prompt.id,
        title: prompt.title,
        content: prompt.content,
        engine: (prompt.engine as unknown as { id: number }).id,
        dependencies: prompt.dependencies,
        parameters: prompt.parameters,
        order: prompt.order,
        output_format: prompt.output_format,
        model_parameters: prompt.model_parameters,
        is_visible: prompt.is_visible,
        show_output: prompt.show_output,
        prompt_output_variable: prompt.prompt_output_variable,
      };
    });

    setPrompts(updatedPrompts);

    dispatch(
      setToast({
        message: "Prompt template saved with success",
        severity: "success",
        duration: 3000,
        position: { vertical: "bottom", horizontal: "right" },
      }),
    );

    if (newTemplate) {
      window.location.href = window.location.href.replace("create", newTemplate.slug);
    }
  };

  const handlePublishTemplate = async () => {
    if (!templateData?.id) {
      let message = "Please try again or refresh the page";

      if (createMode === "create") {
        message = "Please try again, and make sure you've entered template information!";
        setTemplateDrawerOpen(true);
      }
      dispatch(
        setToast({
          message,
          severity: "error",
          duration: 4000,
          position: { vertical: "top", horizontal: "center" },
        }),
      );
      return;
    }

    await publishTemplate(templateData.id);
    window.location.reload();
  };

  return (
    <Layout>
      {!isMobile ? (
        <Box
          sx={{
            mt: "-10px",
            bgcolor: "surface.4",
            minHeight: "100svh",
          }}
        >
          <Sidebar />
          <BuilderSidebar
            prompts={prompts}
            setPrompts={setPrompts}
          />

          <Box
            sx={{
              mr: builderSidebarOpen ? "352px" : "0px",
            }}
          >
            <Header
              templateLoading={isTemplateLoading}
              status={templateData?.status || "DRAFT"}
              title={templateData?.title!}
              templateSlug={templateData?.slug}
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

                ...(router.pathname.includes("/prompt-builder/") && { mt: theme.custom.promptBuilder.headerHeight }),
              }}
            >
              <Stack
                mt={"72px"}
                gap={1}
                mb={2}
              >
                <Typography sx={{ fontSize: 34, fontWeight: 400 }}>Chain of Thoughts Builder</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 400 }}>{BUILDER_DESCRIPTION}</Typography>
              </Stack>

              <Box>
                <DndProvider backend={HTML5Backend}>
                  <PromptList
                    templateLoading={isTemplateLoading}
                    prompts={prompts}
                    setPrompts={setPrompts}
                  />
                </DndProvider>
              </Box>
            </Box>

            {!!templateData && templateDrawerOpen && (
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
                    type={createMode}
                    templateData={templateData}
                    darkMode
                    onSaved={template => (isNewTemplate ? handleSaveTemplate(template) : window.location.reload())}
                    onClose={() => setTemplateDrawerOpen(false)}
                  />
                </Box>
              </SwipeableDrawer>
            )}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            backgroundColor: "var(--surfaceContainerLowest, #FDFBFF)",
            width: { xs: "auto", sm: "107svh", md: "auto" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              padding: "var(--1, 8px) 16px",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <DesktopIcon />
            <Typography
              sx={{
                color: "var(--onSurface, var(--onSurface, #1B1B1F))",
                textAlign: "center",
                fontFeatureSettings: "'clig' off, 'liga' off",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "120%",
                letterSpacing: "0.17px",
              }}
            >
              Your browser too small
            </Typography>

            <Typography
              sx={{
                color: "var(--onSurface, var(--onSurface, #1B1B1F))",
                textAlign: "center",
                fontFeatureSettings: "'clig' off, 'liga' off",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "160%",
                letterSpacing: "0.17px",
              }}
            >
              Resize your browser to be at least 900px wide to get back into editor
            </Typography>
          </Box>
        </Box>
      )}
    </Layout>
  );
};

export default PromptBuilder;
