import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
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
import { useViewTemplateMutation } from "@/core/api/templates";
import { TemplatesExecutions, Templates } from "@/core/api/dto/templates";
import { Display } from "@/components/prompt/Display";
import { Details } from "@/components/prompt/Details";
import { authClient } from "@/common/axios";
import { DetailsCard } from "@/components/prompt/DetailsCard";
import { PromptLiveResponse } from "@/common/types/prompt";
import { Layout } from "@/layout";
import BottomTabs from "@/components/prompt/BottomTabs";
import { DetailsCardMini } from "@/components/prompt/DetailsCardMini";
import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";
import { isValidUserFn } from "@/core/store/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { updateTemplateData, updateExecutionData, setGeneratingStatus } from "@/core/store/templatesSlice";
import { RootState } from "@/core/store";
import PromptPlaceholder from "@/components/placeholders/PromptPlaceHolder";
import { useAppSelector } from "@/hooks/useStore";
import ChatMode from "@/components/prompt/generate/ChatBox";
import { getExecutionByHash } from "@/hooks/api/executions";
import { ExpandMore, PlayCircle } from "@mui/icons-material";
import { GeneratorForm } from "@/components/prompt/GeneratorForm";
import { isDesktopViewPort } from "@/common/helpers";
import GeneratedExecutionFooter from "@/components/prompt/GeneratedExecutionFooter";
import { GeneratorButton } from "@/components/prompt/GeneratorButton";

interface TemplateProps {
  hashedExecution: TemplatesExecutions | null;
  fetchedTemplate: Templates;
}

const Template = ({ hashedExecution, fetchedTemplate }: TemplateProps) => {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const [selectedExecution, setSelectedExecution] = useState<TemplatesExecutions | null>(null);
  const [generatedExecution, setGeneratedExecution] = useState<PromptLiveResponse | null>(null);
  const [updateViewTemplate] = useViewTemplateMutation();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [mobileTab, setMobileTab] = useState(1);
  const router = useRouter();
  const theme = useTheme();
  const [palette, setPalette] = useState(theme.palette);
  const dispatch = useDispatch();
  const isValidUser = useSelector(isValidUserFn);
  const savedTemplateId = useSelector((state: RootState) => state.template.id);
  const {
    data: templateExecutions,
    isFetching: isFetchingExecutions,
    refetch: refetchTemplateExecutions,
  } = useGetExecutionsByTemplateQuery(isValidUser ? fetchedTemplate.id : skipToken);

  useEffect(() => {
    if (!fetchedTemplate?.id) {
      router.push("/404");
      return;
    }

    if (!savedTemplateId || savedTemplateId !== fetchedTemplate.id) {
      dispatch(updateExecutionData(JSON.stringify([])));
      dispatch(
        updateTemplateData({
          id: fetchedTemplate.id,
          is_favorite: fetchedTemplate.is_favorite,
          likes: fetchedTemplate.favorites_count,
        }),
      );

      if (fetchedTemplate.thumbnail) {
        fetchDynamicColors();
      }
    }

    if (isValidUser) {
      updateViewTemplate(fetchedTemplate.id);
    }
  }, [fetchedTemplate, savedTemplateId]);

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

  const fetchDynamicColors = () => {
    materialDynamicColors(fetchedTemplate.thumbnail)
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
  const isTemplatePublished = fetchedTemplate.status === "PUBLISHED";
  const desktopViewPort = isDesktopViewPort();

  return (
    <>
      <ThemeProvider theme={dynamicTheme}>
        <Layout>
          {!fetchedTemplate ? (
            <PromptPlaceholder />
          ) : (
            <Grid
              mt={{ xs: 7, md: 0 }}
              gap={"8px"}
              container
              flexWrap={{ md: "nowrap" }}
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
              {desktopViewPort && (
                <Stack
                  px={"4px"}
                  maxWidth={"430px"}
                  width={{ md: "38%" }}
                  sx={{
                    borderRadius: "16px",
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
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
                          mb: -1,
                          boxShadow: "none",
                          borderRadius: "16px",
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
                      >
                        <AccordionSummary expandIcon={<ExpandMore />}>
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
                      <GeneratorForm
                        templateData={fetchedTemplate}
                        selectedExecution={selectedExecution}
                        setGeneratedExecution={setGeneratedExecution}
                        onError={setErrorMessage}
                      />
                    </Box>
                  </Stack>
                </Stack>
              )}

              {!desktopViewPort && (
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
              {!desktopViewPort ? (
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
                      template={fetchedTemplate}
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
                    <GeneratorButton
                      templateData={fetchedTemplate}
                      selectedExecution={selectedExecution}
                      setGeneratedExecution={setGeneratedExecution}
                      onError={setErrorMessage}
                    />
                  </Grid>
                )
              ) : null}

              <Grid
                flex={1}
                borderRadius={"16px"}
                width={{ md: "62%" }}
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
                  {!desktopViewPort && (
                    <GeneratedExecutionFooter
                      execution={generatedExecution}
                      template={fetchedTemplate}
                    />
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

export async function getServerSideProps({
  params,
  query,
}: {
  params: {
    slug: string;
  };
  query: { hash: string };
}) {
  const { slug } = params;
  const { hash } = query;
  let fetchedTemplate: Templates = {} as Templates;

  try {
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
        fetchedTemplate,
      },
    };
  } catch (error) {
    return {
      props: {
        title: "Promptify | Boost Your Creativity",
        description:
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
        fetchedTemplate,
      },
    };
  }
}

export default Template;
