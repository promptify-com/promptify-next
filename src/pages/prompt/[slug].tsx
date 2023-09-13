import React, { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Divider,
  Grid,
  Palette,
  Snackbar,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
  useTheme,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import materialDynamicColors from "material-dynamic-colors";
import { mix } from "polished";
import { useRouter } from "next/router";
import {
  useGetPromptTemplateBySlugQuery,
  useTemplateQuestionGeneratorMutation,
  useViewTemplateMutation,
} from "@/core/api/templates";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import { GeneratorForm } from "@/components/prompt/GeneratorForm";
import { Display } from "@/components/prompt/Display";
import { Details } from "@/components/prompt/Details";
import { authClient } from "@/common/axios";
import { DetailsCard } from "@/components/prompt/DetailsCard";
import { PromptLiveResponse } from "@/common/types/prompt";
import { Layout } from "@/layout";
import { useWindowSize } from "usehooks-ts";
import BottomTabs from "@/components/prompt/BottomTabs";
import { DetailsCardMini } from "@/components/prompt/DetailsCardMini";
import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";
import ExecutionForm from "@/components/prompt/ExecutionForm";
import { isValidUserFn } from "@/core/store/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { updateTemplate, updateTemplateData } from "@/core/store/templatesSlice";
import { RootState } from "@/core/store";
import PromptPlaceholder from "@/components/placeholders/PromptPlaceHolder";
import { useAppSelector } from "@/hooks/useStore";
import ChatMode from "@/components/prompt/generate/ChatBox";
import { TemplateQuestionGeneratorData } from "@/core/api/dto/prompts";

const Prompt = () => {
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const [selectedExecution, setSelectedExecution] = useState<TemplatesExecutions | null>(null);
  const [generatedExecution, setGeneratedExecution] = useState<PromptLiveResponse | null>(null);
  const [executionFormOpen, setExecutionFormOpen] = useState(false);
  const [updateViewTemplate] = useViewTemplateMutation();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [mobileTab, setMobileTab] = useState(0);
  const router = useRouter();
  const theme = useTheme();
  const [palette, setPalette] = useState(theme.palette);
  const disptach = useDispatch();
  const isValidUser = useSelector(isValidUserFn);
  const { width: windowWidth } = useWindowSize();
  const isSavedTemplateId = useSelector((state: RootState) => state.template.id);

  const routerSlug = router.query?.slug as string;
  if (!routerSlug) {
    router.push("/404");
    return;
  }

  const {
    data: fetchedTemplate,
    error: fetchedTemplateError,
    isLoading: isLoadingTemplate,
  } = useGetPromptTemplateBySlugQuery(routerSlug);

  const {
    data: templateExecutions,
    error: templateExecutionsError,
    isFetching: isFetchingExecutions,
    refetch: refetchTemplateExecutions,
  } = useGetExecutionsByTemplateQuery(isValidUser && fetchedTemplate?.id ? fetchedTemplate.id : skipToken);

  // We need to set initial template store only once.
  if (fetchedTemplate && (!isSavedTemplateId || isSavedTemplateId !== fetchedTemplate.id)) {
    disptach(updateTemplate(fetchedTemplate));
    disptach(
      updateTemplateData({
        id: fetchedTemplate.id,
        is_favorite: fetchedTemplate.is_favorite,
        likes: fetchedTemplate.favorites_count,
      }),
    );
  }

  useEffect(() => {
    if (fetchedTemplate?.id && isValidUser) {
      updateViewTemplate(fetchedTemplate.id);
    }
  }, [fetchedTemplate?.id, isValidUser]);

  // After new generated execution is completed - refetch the executions list and clear the generatedExecution state
  // All prompts should be completed - isCompleted: true
  useEffect(() => {
    if (!isGenerating && generatedExecution?.data?.length) {
      const promptNotCompleted = generatedExecution.data.find(execData => !execData.isCompleted);
      if (!promptNotCompleted) {
        setSelectedExecution(null);
        setExecutionFormOpen(true);
      }
    }
  }, [isGenerating, generatedExecution]);

  useEffect(() => {
    if (isGenerating) setMobileTab(2);
  }, [isGenerating]);

  // Keep tracking the current generated prompt
  const currentGeneratedPrompt = useMemo(() => {
    if (fetchedTemplate && generatedExecution?.data?.length) {
      const loadingPrompt = generatedExecution.data.find(prompt => prompt.isLoading);
      const prompt = fetchedTemplate.prompts.find(prompt => prompt.id === loadingPrompt?.prompt);
      if (prompt) return prompt;
    }
    return null;
  }, [fetchedTemplate, generatedExecution]);

  useEffect(() => {
    if (fetchedTemplate?.thumbnail) {
      fetchDynamicColors();
    }
  }, [fetchedTemplate]);

  const fetchDynamicColors = () => {
    materialDynamicColors(fetchedTemplate?.thumbnail)
      .then((imgPalette: IMaterialDynamicColorsTheme) => {
        const newPalette: Palette = {
          ...theme.palette,
          ...imgPalette.light,
          primary: {
            ...theme.palette.primary,
            main: imgPalette.light.primary,
          },
          secondary: {
            ...theme.palette.secondary,
            main: imgPalette.light.secondary,
          },
          error: {
            ...theme.palette.secondary,
            main: imgPalette.light.error,
          },
          background: {
            ...theme.palette.background,
            default: imgPalette.light.background,
          },
          surface: {
            1: imgPalette.light.surface,
            2: mix(0.3, imgPalette.light.surfaceVariant, imgPalette.light.surface),
            3: mix(0.6, imgPalette.light.surfaceVariant, imgPalette.light.surface),
            4: mix(0.8, imgPalette.light.surfaceVariant, imgPalette.light.surface),
            5: imgPalette.light.surfaceVariant,
          },
        };
        setPalette(newPalette);
      })
      .catch(() => {
        console.warn("Error fetching dynamic colors");
      });
  };

  const dynamicTheme = createTheme({ ...theme, palette });

  if (fetchedTemplateError || templateExecutionsError) {
    router.push("/404");
    return;
  }

  return (
    <>
      <ThemeProvider theme={dynamicTheme}>
        <Layout>
          {!fetchedTemplate || isLoadingTemplate ? (
            <PromptPlaceholder />
          ) : (
            <Grid
              mt={{ xs: 7, md: 0 }}
              gap={"8px"}
              container
              sx={{
                mx: "auto",
                height: {
                  xs: "calc(100svh - 56px)",
                  md: "calc(100svh - 90px)",
                },
                width: { md: "calc(100% - 65px)" },
                position: "relative",
                overflow: "auto",

                "&::-webkit-scrollbar": {
                  width: "6px",
                  p: 1,
                  backgroundColor: "surface.5",
                },
                "&::-webkit-scrollbar-track": {
                  webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "surface.1",
                  outline: "1px solid surface.1",
                  borderRadius: "10px",
                },
              }}
            >
              {windowWidth > 960 && (
                <Grid
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 999,
                    height: "100%",

                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                      width: "6px",
                      p: 1,
                      backgroundColor: "surface.5",
                    },
                    "&::-webkit-scrollbar-track": {
                      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "surface.1",
                      outline: "1px solid surface.1",
                      borderRadius: "10px",
                    },
                  }}
                >
                  <Grid
                    mr={1}
                    bgcolor={"surface.1"}
                    width={"396px"}
                    borderRadius={"16px"}
                    overflow={"hidden"}
                  >
                    <DetailsCard templateData={fetchedTemplate} />
                    <Stack flex={1}>
                      <Box flex={1}>
                        <Details templateData={fetchedTemplate} />
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              )}

              {windowWidth < 960 && (
                <>
                  {mobileTab !== 0 && <DetailsCardMini templateData={fetchedTemplate} />}

                  <Grid
                    item
                    xs={12}
                    md={8}
                    sx={{
                      display: mobileTab === 0 ? "block" : "none",
                      height: "100%",
                      overflow: "auto",
                      bgcolor: "surface.1",
                      position: "relative",
                      pb: "75px", // Bottom tab bar height
                    }}
                  >
                    <DetailsCard templateData={fetchedTemplate} />
                    <Details
                      templateData={fetchedTemplate}
                      setMobileTab={setMobileTab}
                      mobile
                    />
                  </Grid>
                </>
              )}
              {windowWidth < 960 && (
                <>
                  {mobileTab === 1 && (
                    <ChatMode
                      setGeneratedExecution={setGeneratedExecution}
                      onError={setErrorMessage}
                    />
                  )}
                </>
              )}

              <Grid
                flex={1}
                borderRadius={"16p"}
                sx={{
                  display: {
                    xs: mobileTab === 2 ? "block" : "none",
                    md: "block",
                  },
                }}
              >
                <Grid mr={1}>
                  <Display
                    templateData={fetchedTemplate}
                    executions={templateExecutions ?? []}
                    isFetching={isFetchingExecutions}
                    selectedExecution={selectedExecution}
                    setSelectedExecution={setSelectedExecution}
                    generatedExecution={generatedExecution}
                    setGeneratedExecution={setGeneratedExecution}
                    onError={setErrorMessage}
                  />
                  {currentGeneratedPrompt && (
                    <Box
                      sx={{
                        position: "sticky",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 998,
                        bgcolor: "surface.1",
                      }}
                    >
                      <Divider sx={{ borderColor: "surface.3" }} />
                      <Typography
                        sx={{
                          padding: "8px 16px 5px",
                          textAlign: "right",
                          fontSize: 11,
                          fontWeight: 500,
                          opacity: 0.3,
                        }}
                      >
                        Prompt #{currentGeneratedPrompt.order}: {currentGeneratedPrompt.title}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>

              <BottomTabs
                setActiveTab={setMobileTab}
                activeTab={mobileTab}
              />
            </Grid>
          )}

          <ExecutionForm
            type="new"
            isOpen={executionFormOpen}
            executionId={generatedExecution?.id}
            onClose={() => {
              setGeneratedExecution(null);
              setExecutionFormOpen(false);
            }}
            onCancel={() => refetchTemplateExecutions()}
          />

          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={errorMessage.length > 0}
            autoHideDuration={6000}
            onClose={() => setErrorMessage("")}
          >
            <Alert severity={"error"}>{errorMessage}</Alert>
          </Snackbar>
        </Layout>
      </ThemeProvider>
    </>
  );
};

export async function getServerSideProps({ params }: any) {
  const { slug } = params;

  try {
    const templatesResponse = await authClient.get(`/api/meta/templates/by-slug/${slug}/`);
    const fetchedTemplate = templatesResponse.data; // Extract the necessary data from the response

    return {
      props: {
        title: fetchedTemplate.meta_title || fetchedTemplate.title,
        description: fetchedTemplate.meta_description || fetchedTemplate.description,
        meta_keywords: fetchedTemplate.meta_keywords,
        image: fetchedTemplate.thumbnail,
      },
    };
  } catch (error) {
    return {
      props: {
        title: "Promptify | Boost Your Creativity",
        description:
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
      },
    };
  }
}
export default Prompt;
