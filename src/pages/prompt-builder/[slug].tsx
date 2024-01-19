import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { theme } from "@/theme";
import Header from "@/components/builder/Header";
import TemplateForm from "@/components/common/forms/TemplateForm";
import { isPromptVariableValid } from "@/common/helpers/promptValidator";
import { useGetPromptTemplateBySlugQuery, usePublishTemplateMutation } from "@/core/api/templates";
import { updateTemplate } from "@/hooks/api/templates";
import { BuilderSidebar } from "@/components/builderSidebar";
import PromptList from "@/components/builder/PromptCardAccordion/PromptList";
import useToken from "@/hooks/useToken";
import { useAppSelector } from "@/hooks/useStore";
import Sidebar from "@/components/sidebar/Sidebar";
import { BUILDER_TYPE } from "@/common/constants";
import { useGetEnginesQuery } from "@/core/api/engines";
import { handleInitPrompt } from "@/common/helpers/initPrompt";
import type { IEditTemplate } from "@/common/types/editTemplate";
import type { Templates } from "@/core/api/dto/templates";
import type { IEditPrompts } from "@/common/types/builder";
import { useDispatch } from "react-redux";
import { setEngines, setIsTemplateOwner, setTemplate } from "@/core/store/builderSlice";

export const PromptBuilder = () => {
  const router = useRouter();
  const token = useToken();
  const dispatch = useDispatch();
  const [publishTemplate] = usePublishTemplateMutation();
  const currentUser = useAppSelector(state => state.user.currentUser);

  const slug = router.query.slug as string;

  const { data: engines } = useGetEnginesQuery();
  const { data: fetchedTemplateData, isLoading: isTemplateLoading } = useGetPromptTemplateBySlugQuery(slug, {
    skip: slug === "create",
  });

  const [prompts, setPrompts] = useState<IEditPrompts[]>([]);
  const [templateData, setTemplateData] = useState<Templates | undefined>(
    slug === "create" ? ({ title: "new_template_12345" } as Templates) : undefined,
  );

  useEffect(() => {
    if (engines && fetchedTemplateData) {
      dispatch(setEngines(engines));
      dispatch(setTemplate(fetchedTemplateData));
      if (currentUser) {
        dispatch(setIsTemplateOwner(fetchedTemplateData.created_by.id === currentUser?.id || currentUser?.is_admin));
      }

      setTemplateData(fetchedTemplateData);
      const processedPrompts = handleInitPrompt(fetchedTemplateData, engines) as IEditPrompts[];
      setPrompts(processedPrompts);
    }
  }, [fetchedTemplateData, engines]);

  const builderSidebarOpen = useAppSelector(state => state.sidebar.builderSidebarOpen);

  const [templateDrawerOpen, setTemplateDrawerOpen] = useState(Boolean(router.query.editor));
  const [messageSnackBar, setMessageSnackBar] = useState({ status: false, message: "" });
  const [errorSnackBar, setErrorSnackBar] = useState({ status: false, message: "" });

  const createMode = slug === "create" ? "create" : "edit";

  useEffect(() => {
    if (!token) {
      router.push("/signin");
    } else if (router.query.editor) {
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
      setErrorSnackBar({ status: true, message });
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
      setErrorSnackBar({ status: true, message: `You have entered an invalid prompt variable ${invalids.join(", ")}` });
      return;
    }

    const _prompts = prompts.map((prompt, index, array) => {
      if (prompt.output_format === "custom" && prompt.custom_output_format) {
        prompt.output_format = prompt.custom_output_format;
      }

      prompt.output_format = prompt.output_format !== "custom" ? prompt.output_format : "Markdown";

      const depend = array[index - 1]?.id || array[index - 1]?.temp_id;
      const { custom_output_format, ...restPrompt } = prompt;

      return {
        ...restPrompt,
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

    await updateTemplate(currentTemplateData.id, _template);
    setMessageSnackBar({ status: true, message: "Prompt template saved with success" });

    setTimeout(() => {
      if (newTemplate) {
        window.location.href = window.location.href.replace("create", newTemplate.slug);
      } else {
        window.location.reload();
      }
    }, 700);
  };

  const handlePublishTemplate = async () => {
    if (!templateData?.id) {
      let message = "Please try again or refresh the page";

      if (createMode === "create") {
        message = "Please try again, and make sure you've entered template information!";
        setTemplateDrawerOpen(true);
      }

      setErrorSnackBar({ status: true, message });
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
      <BuilderSidebar
        prompts={prompts}
        setPrompts={setPrompts}
      />
      <Box
        sx={{
          ml: theme.custom.leftClosedSidebarWidth,
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
          sidebarOpened={builderSidebarOpen}
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
            gap={1}
            mb={2}
          >
            <Typography sx={{ fontSize: 34, fontWeight: 400 }}>Chain of Thoughts Builder</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
              Structure your prompts for a productive and more deterministic AI. You chained prompts will guide AI
              content creation with focus and intent. Learn more
            </Typography>
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
                onSaved={template =>
                  router.query.slug === "create" ? handleSaveTemplate(template) : window.location.reload()
                }
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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

export async function getServerSideProps() {
  return {
    props: {
      title: "Promptify | Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
    },
  };
}
export default PromptBuilder;
