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
import { skipToken } from "@reduxjs/toolkit/dist/query";
import materialDynamicColors from "material-dynamic-colors";
import { mix } from "polished";
import { useRouter } from "next/router";
import { useGetPromptTemplateBySlugQuery, useViewTemplateMutation } from "@/core/api/templates";
import { TemplatesExecutions, Templates } from "@/core/api/dto/templates";
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
import { isValidUserFn } from "@/core/store/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { updateTemplate, updateTemplateData } from "@/core/store/templatesSlice";
import { RootState } from "@/core/store";
import PromptPlaceholder from "@/components/placeholders/PromptPlaceHolder";
import { useAppSelector } from "@/hooks/useStore";
import ChatMode from "@/components/prompt/generate/ChatBox";
import { getExecutionByHash } from "@/hooks/api/executions";
import { ExpandMore } from "@mui/icons-material";
import ExecutionForm from "@/components/prompt/ExecutionForm";
import { GeneratorForm } from "@/components/prompt/GeneratorForm";

const Prompt = ({ hashedExecution }: { hashedExecution: TemplatesExecutions | null }) => {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const [selectedExecution, setSelectedExecution] = useState<TemplatesExecutions | null>(null);
  const [generatedExecution, setGeneratedExecution] = useState<PromptLiveResponse | null>(null);
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
        setGeneratedExecution(null);
        refetchTemplateExecutions();
      }
    }
  }, [isGenerating, generatedExecution]);

  useEffect(() => {
    if (isGenerating || hashedExecution?.id) {
      setMobileTab(2);
    }
  }, [isGenerating, hashedExecution]);

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
  const isTemplatePublished = fetchedTemplate ? fetchedTemplate.status === "PUBLISHED" : false;
  const templateInformationAccordionExpansion = isTemplatePublished
    ? { defaultExpanded: true }
    : { defaultExpanded: false };

  if (fetchedTemplateError) {
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
                <Stack
                  px={"4px"}
                  maxWidth={"430px"}
                  sx={{
                    borderRadius: "16px",
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
                  <DetailsCard templateData={fetchedTemplate} />
                  <Stack flex={1}>
                    <Box flex={1}>
                      <Accordion
                        key={fetchedTemplate?.id}
                        sx={{
                          boxShadow: "none",
                          bgcolor: "surface.1",
                          overflow: "hidden",
                          ".MuiAccordionDetails-root": {
                            p: "0",
                          },
                          ".MuiAccordionSummary-root": {
                            minHeight: "48px",
                            ":hover": {
                              cursor: isTemplatePublished ? "auto" : "pointer",
                              opacity: 0.8,
                              svg: {
                                color: "primary.main",
                              },
                            },
                          },
                          ".MuiAccordionSummary-content": {
                            m: 0,
                          },
                        }}
                        {...templateInformationAccordionExpansion}
                      >
                        <AccordionSummary expandIcon={isTemplatePublished ? null : <ExpandMore />}>
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 500,
                              color: "primary.main",
                            }}
                          >
                            More about template
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Details templateData={fetchedTemplate} />
                        </AccordionDetails>
                      </Accordion>
                      {!isTemplatePublished && (
                        <GeneratorForm
                          templateData={fetchedTemplate}
                          selectedExecution={selectedExecution}
                          setGeneratedExecution={setGeneratedExecution}
                          onError={setErrorMessage}
                        />
                      )}
                    </Box>
                  </Stack>
                </Stack>
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
              {windowWidth < 960 ? (
                !!fetchedTemplate?.questions?.length && isTemplatePublished ? (
                  <Grid
                    sx={{
                      display: {
                        xs: mobileTab === 1 ? "block" : "none",
                        md: "block",
                      },
                    }}
                  >
                    <ChatMode
                      setGeneratedExecution={setGeneratedExecution}
                      onError={setErrorMessage}
                      key={fetchedTemplate.id}
                    />
                  </Grid>
                ) : (
                  <Grid
                    sx={{
                      display: mobileTab === 1 ? "flex" : "none",
                      width: "100%",
                      justifyContent: "center",
                      height: "74%",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    Chat is unavailable
                  </Grid>
                )
              ) : null}

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
                    hashedExecution={hashedExecution}
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

export async function getServerSideProps({ params, query }: { params: { slug: string }; query: { hash: string } }) {
  const { slug } = params;
  const { hash } = query;

  try {
    let fetchedTemplate: Templates;
    let execution: TemplatesExecutions | null = null;

    if (hash) {
      const [_execution, _templatesResponse] = await Promise.all([
        getExecutionByHash(hash),
        authClient.get<Templates>(`/api/meta/templates/by-slug/${slug}/`),
      ]);

      execution = _execution;
      fetchedTemplate = _templatesResponse.data;
    } else {
      const _templatesResponse = await authClient.get<Templates>(`/api/meta/templates/by-slug/${slug}/`);
      fetchedTemplate = _templatesResponse.data;
    }

    return {
      props: {
        title: fetchedTemplate.meta_title || fetchedTemplate.title,
        description: fetchedTemplate.meta_description || fetchedTemplate.description,
        meta_keywords: fetchedTemplate.meta_keywords,
        image: fetchedTemplate.thumbnail,
        hashedExecution: execution,
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
