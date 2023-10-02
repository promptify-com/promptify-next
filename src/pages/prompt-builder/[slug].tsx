import React, { useRef, useState } from "react";
import { usePublishTemplateMutation } from "@/core/api/templates";
import { Alert, Box, Button, Snackbar, Stack, SwipeableDrawer, Typography } from "@mui/material";
import { Sidebar } from "@/components/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/core/store";
import { setOpenSidebar } from "@/core/store/sidebarSlice";
import { Header } from "@/components/builder/Header";
import TemplateForm from "@/components/common/forms/TemplateForm";
import { PromptCardAccordion } from "@/components/builder/PromptCardAccordion";
import { IEditPrompts } from "@/common/types/builder";
import { Add } from "@mui/icons-material";
import { promptRandomId } from "@/common/helpers";
import { isPromptVariableValid } from "@/common/helpers/promptValidator";
import { updateTemplate } from "@/hooks/api/templates";

import { Engine, Templates } from "@/core/api/dto/templates";
import { authClient } from "@/common/axios";
import { SidebarRight } from "@/components/builder/SideBarRight";

interface PromptBuilderProps {
  templateData: Templates;
  initPrompts: IEditPrompts[];
  engines: Engine[];
}

export const PromptBuilder = ({ templateData, initPrompts, engines }: PromptBuilderProps) => {
  const sidebarOpen = useSelector((state: RootState) => state.sidebar.open);
  const [prompts, setPrompts] = useState(initPrompts);
  const promptsData = useRef(initPrompts);
  const [templateDrawerOpen, setTemplateDrawerOpen] = useState(false);
  const [publishTemplate] = usePublishTemplateMutation();
  const [messageSnackBar, setMessageSnackBar] = useState({ status: false, message: "" });
  const [errorSnackBar, setErrorSnackBar] = useState({ status: false, message: "" });
  const dispatch = useDispatch();
  const toggleSidebar = () => dispatch(setOpenSidebar(!sidebarOpen));
  const [toggleSideBarRight, setToggleSideBarRight] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const toggleSidebarRight = (name: string) => {
    if (name === "help") {
      setToggleSideBarRight(true);
    }
  };
  const closeSidebarRight = () => {
    setToggleSideBarRight(false);
  };

  const changePrompt = (prompt: IEditPrompts) => {
    const _prompts = promptsData.current.map(prevPrompt => {
      if (
        (prompt.id && prevPrompt.id && prompt.id === prevPrompt.id) ||
        (prompt.temp_id && prevPrompt.temp_id && prompt.temp_id === prevPrompt.temp_id)
      ) {
        return prompt;
      }
      return prevPrompt;
    });

    promptsData.current = _prompts;
  };

  const createPrompt = (order: number) => {
    const temp_id = promptRandomId();
    const _newPrompt = {
      temp_id: temp_id,
      title: `Prompt #${order}`,
      content: "Describe here prompt parameters, for example {{name:text}} or {{age:number}}",
      engine_id: engines ? engines[0]?.id : 0,
      dependencies: [],
      parameters: [],
      order: order,
      output_format: "",
      model_parameters: null,
      is_visible: true,
      show_output: true,
      prompt_output_variable: `$temp_id_${temp_id}`,
    };

    let _prompts: IEditPrompts[] = [_newPrompt];
    if (promptsData.current.length) {
      _prompts = promptsData.current
        .map(prompt => {
          if (prompt.order === order - 1) {
            return [prompt, _newPrompt];
          }
          if (prompt.order >= order) {
            return { ...prompt, order: prompt.order + 1 };
          }
          return prompt;
        })
        .flat();
    }

    promptsData.current = _prompts;
    setPrompts(_prompts);
  };

  const duplicatePrompt = (duplicatedPrompt: IEditPrompts) => {
    const duplicateData = promptsData.current.find(
      prompt =>
        (duplicatedPrompt.id && prompt.id && duplicatedPrompt.id === prompt.id) ||
        (duplicatedPrompt.temp_id && prompt.temp_id && duplicatedPrompt.temp_id === prompt.temp_id),
    );
    if (!duplicateData) return;

    const temp_id = promptRandomId();
    const _newPrompt = {
      ...duplicateData,
      temp_id: temp_id,
      title: `${duplicateData.title} - Copy`,
      order: duplicateData.order + 1,
      dependencies: [],
    };

    const _prompts: IEditPrompts[] = promptsData.current
      .map(prompt => {
        if (prompt.order === duplicatedPrompt.order) {
          return [prompt, _newPrompt];
        }
        if (prompt.order >= _newPrompt.order) {
          return { ...prompt, order: prompt.order + 1 };
        }
        return prompt;
      })
      .flat();

    promptsData.current = _prompts;
    setPrompts(_prompts);
  };

  const deletePrompt = (deletePrompt: IEditPrompts) => {
    const _prompts = promptsData.current
      .filter(
        prompt =>
          (deletePrompt.id && prompt.id && deletePrompt.id !== prompt.id) ||
          (deletePrompt.temp_id && prompt.temp_id && deletePrompt.temp_id !== prompt.temp_id),
      )
      .map(prompt => {
        if (prompt.order > deletePrompt.order) {
          return { ...prompt, order: prompt.order - 1 };
        }
        return prompt;
      });

    promptsData.current = _prompts;
    setPrompts(_prompts);
  };

  const handleSaveTemplate = async () => {
    if (!templateData) {
      setErrorSnackBar({ status: true, message: "Please try again or refresh the page" });
      return;
    }

    const invalids: string[] = [];
    promptsData.current.map(prompt => {
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
      prompts_list: promptsData.current.map(prompt => ({
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

    setIsSaving(true);
    await publishTemplate(templateData.id);
    window.location.reload();
    setIsSaving(false);
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
      <SidebarRight
        open={toggleSideBarRight}
        toggleSideBarRight={(name: string) => toggleSidebarRight(name)}
        closeSideBarRight={() => closeSidebarRight()}
      />
      <Box
        sx={{
          ml: sidebarOpen ? "299px" : "86px",
          mr: toggleSideBarRight ? "352px" : "0px",
        }}
      >
        <Header
          status={templateData?.status || "DRAFT"}
          title={templateData?.title || ""}
          templateSlug={templateData?.slug}
          onPublish={handlePublishTemplate}
          onSave={handleSaveTemplate}
          onDrawerOpen={() => setTemplateDrawerOpen(true)}
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

          <Stack
            alignItems={"center"}
            gap={3}
          >
            {prompts.length ? (
              prompts.map((prompt, i) => {
                const order = i + 2;
                return (
                  <React.Fragment key={i}>
                    <Box width={"100%"}>
                      <PromptCardAccordion
                        key={prompt.id}
                        prompt={prompt}
                        setPrompt={changePrompt}
                        deletePrompt={() => deletePrompt(prompt)}
                        duplicatePrompt={() => duplicatePrompt(prompt)}
                        prompts={prompts}
                        engines={engines}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      sx={{
                        bgcolor: "surface.1",
                        color: "text.primary",
                        p: "6px 16px",
                        border: "none",
                        fontSize: 14,
                        fontWeight: 500,
                        ":hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                      onClick={() => createPrompt(order)}
                    >
                      New prompt
                    </Button>
                  </React.Fragment>
                );
              })
            ) : (
              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{
                  mt: "20svh",
                  bgcolor: "surface.1",
                  color: "text.primary",
                  p: "6px 16px",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  ":hover": {
                    bgcolor: "action.hover",
                  },
                }}
                onClick={() => createPrompt(1)}
              >
                New prompt
              </Button>
            )}
          </Stack>
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
    const _prompts = template.prompts.map(prompt => {
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
        order: 1,
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

  try {
    const _fetchedTemplate = await authClient.get<Templates>(`/api/meta/templates/by-slug/${slug}`);
    templateData = _fetchedTemplate.data;
    const _engines = await authClient.get<Engine[]>(`/api/meta/engines`);
    engines = _engines.data;
  } catch (error) {
    console.error("Template/engines request failed:", error);
  }

  return {
    props: {
      title: "Promptify | Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
      templateData,
      initPrompts: initPrompts(templateData, engines) ?? [],
      engines,
    },
  };
}
export default PromptBuilder;
