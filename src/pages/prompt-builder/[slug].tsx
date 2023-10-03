import React, { useEffect, useRef, useState } from "react";
import { usePublishTemplateMutation } from "@/core/api/templates";
import { Alert, Box, Snackbar, Stack, SwipeableDrawer, Typography } from "@mui/material";
import { Sidebar } from "@/components/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/core/store";
import { setOpenSidebar } from "@/core/store/sidebarSlice";
import { Header } from "@/components/builder/Header";
import TemplateForm from "@/components/common/forms/TemplateForm";
import { IEditPrompts } from "@/common/types/builder";
import { isPromptVariableValid } from "@/common/helpers/promptValidator";
import { updateTemplate } from "@/hooks/api/templates";
import { SidebarRight } from "@/components/SideBarRight";
import { Engine, Templates } from "@/core/api/dto/templates";
import { client } from "@/common/axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PromptList from "@/components/builder/PromptCardAccordion/PromptList";
import { useRouter } from "next/router";
import useToken from "@/hooks/useToken";

interface PromptBuilderProps {
  templateData: Templates;
  initPrompts: IEditPrompts[];
  engines: Engine[];
}

export const PromptBuilder = ({ templateData, initPrompts, engines }: PromptBuilderProps) => {
  const router = useRouter();

  if (!templateData?.id) {
    router.push("/404");
    return null;
  }

  const token = useToken();
  const sidebarOpen = useSelector((state: RootState) => state.sidebar.open);
  const promptsRefData = useRef(initPrompts);
  const [templateDrawerOpen, setTemplateDrawerOpen] = useState(Boolean(router.query.editor));
  const [publishTemplate] = usePublishTemplateMutation();
  const [messageSnackBar, setMessageSnackBar] = useState({ status: false, message: "" });
  const [errorSnackBar, setErrorSnackBar] = useState({ status: false, message: "" });
  const dispatch = useDispatch();
  const toggleSidebar = () => dispatch(setOpenSidebar(!sidebarOpen));
  const [openSideBarRight, setOpenSideBarRight] = useState(false);

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
    promptsRefData.current.map(prompt => {
      const validation = isPromptVariableValid(prompt.content);
      if (!validation.isValid) {
        invalids.push(validation.message);
      }
    });

    if (invalids.length) {
      setErrorSnackBar({ status: true, message: `You have entered an invalid prompt variable ${invalids.toString()}` });
      return;
    }

    const _template: any = {
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
      prompts_list: promptsRefData.current.map(prompt => ({
        ...prompt,
        parameters: prompt?.parameters?.map(params => ({
          parameter_id: params.parameter_id,
          score: params.score,
          is_visible: params.is_visible,
          is_editable: params.is_editable,
        })),
      })),
    };

    await updateTemplate(templateData.id, _template);
    setMessageSnackBar({ status: true, message: "Prompt template saved with success" });
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
        bgcolor: "surface.3",
        minHeight: "100svh",
      }}
    >
      <Sidebar
        open={sidebarOpen}
        toggleSideBar={toggleSidebar}
        fullHeight
      />
      <SidebarRight
        open={openSideBarRight}
        openSideBarRight={() => setOpenSideBarRight(true)}
        closeSideBarRight={() => setOpenSideBarRight(false)}
      />
      <Box
        sx={{
          ml: sidebarOpen ? "299px" : "86px",
          mr: openSideBarRight ? "352px" : "0px",
        }}
      >
        <Header
          status={templateData?.status || "DRAFT"}
          title={templateData?.title || ""}
          templateSlug={templateData?.slug}
          onPublish={handlePublishTemplate}
          onSave={handleSaveTemplate}
          onEditTemplate={() => setTemplateDrawerOpen(true)}
          profile
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
                promptsRefData={promptsRefData}
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
        engine_id: prompt.engine?.id || engines![0].id,
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
