import React, { useEffect, useState } from "react";
import Head from "next/head";
import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  Palette,
  Snackbar,
  Stack,
  ThemeProvider,
  Typography,
  alpha,
  createTheme,
  useTheme,
} from "@mui/material";
import materialDynamicColors from "material-dynamic-colors";
import { useWindowSize } from "usehooks-ts";
import { useRouter } from "next/router";
import { Close, KeyboardArrowDown, Loop, MoreHoriz } from "@mui/icons-material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { mix } from "polished";

import {
  useGetExecutionsByTemplateQuery,
  useTemplateView,
} from "@/core/api/templates";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { PageLoading } from "@/components/PageLoading";
import useToken from "@/hooks/useToken";
import { LogoApp } from "@/assets/icons/LogoApp";
import { PromptLiveResponse } from "@/common/types/prompt";
import { Header } from "@/components/Header";
import { GeneratorForm } from "@/components/collections/GeneratorForm";
import { Executions } from "@/components/collections/Executions";
import { Details } from "@/components/collections/Details";
import { authClient } from "@/common/axios";

export const Collection = ({ fetchedTemplate, fetchedTemplateError }: any) => {
  const router = useRouter();
  const token = useToken();
  const [templateView] = useTemplateView();
  const theme = useTheme();
  const { width: windowWidth } = useWindowSize();
  const id = router.query.id;
  const [NewExecutionData, setNewExecutionData] =
    useState<PromptLiveResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [templateData, setTemplateData] = useState<Templates>();
  const [, setRandomTemplate] = useState<TemplatesExecutions | null>(null);
  const [palette, setPalette] = useState(theme.palette);
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [generatorOpened, setGeneratorOpened] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    data: templateExecutions,
    error: templateExecutionsError,
    isFetching: isFetchingExecutions,
    refetch: refetchTemplateExecutions,
  } = useGetExecutionsByTemplateQuery(templateData?.id ? +templateData.id : 1);

  useEffect(() => {
    if (windowWidth > 900) {
      setDetailsOpened(true);
      setGeneratorOpened(true);
    } else {
      setDetailsOpened(false);
      setGeneratorOpened(false);
    }
  }, [windowWidth]);

  useEffect(() => {
    setTemplateData(fetchedTemplate?.prompt_templates[0]);
  }, [fetchedTemplate]);

  const changeSelectedTemplate = (template: Templates) => {
    if (!isGenerating) {
      setTemplateData(template);
    }
  };

  // After new generated execution is completed - refetch the executions list and clear the NewExecutionData state
  // All prompts should be completed - isCompleted: true
  useEffect(() => {
    if (!isGenerating && NewExecutionData?.data?.length) {
      const promptNotCompleted = NewExecutionData.data.find(
        (execData) => !execData.isCompleted
      );
      if (!promptNotCompleted) {
        refetchTemplateExecutions();
        setNewExecutionData(null);
      }
    }
  }, [isGenerating, NewExecutionData]);

  useEffect(() => {
    if (templateExecutions) {
      const filteredTemplate =
        templateExecutions?.filter((tpm) => !!tpm.prompt_executions.length) ||
        [];
      const indx = Math.floor(Math.random() * filteredTemplate.length);
      setRandomTemplate(filteredTemplate[indx]);
    }
  }, [templateExecutions]);

  useEffect(() => {
    templateView(id ? id : skipToken);
  }, []);

  useEffect(() => {
    if (templateData?.thumbnail) {
      fetchDynamicColors();
    }
  }, [templateData]);

  const fetchDynamicColors = () => {
    materialDynamicColors(templateData?.thumbnail)
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
            2: mix(
              0.3,
              imgPalette.light.surfaceVariant,
              imgPalette.light.surface
            ),
            3: mix(
              0.6,
              imgPalette.light.surfaceVariant,
              imgPalette.light.surface
            ),
            4: mix(
              0.8,
              imgPalette.light.surfaceVariant,
              imgPalette.light.surface
            ),
            5: imgPalette.light.surfaceVariant,
          },
        };
        setPalette(newPalette);
      })
      .catch(async () => {
        await fetchDynamicColors();
      });
  };

  // Keyboard shortcuts
  const handleKeyboard = (e: KeyboardEvent) => {
    // prevent trigger if typing inside input
    const target = e.target as HTMLElement;
    if (!["INPUT", "TEXTAREA"].includes(target.tagName)) {
      if (e.shiftKey && e.code === "ArrowRight") {
        const templateIndex = fetchedTemplate?.prompt_templates.findIndex(
          (temp: Templates) => temp.id === templateData?.id
        );
        if (
          templateIndex !== -1 &&
          templateIndex < fetchedTemplate?.prompt_templates.length - 1
        )
          changeSelectedTemplate(
            fetchedTemplate?.prompt_templates[templateIndex + 1]
          );
      }
      if (e.shiftKey && e.code === "ArrowLeft") {
        const templateIndex = fetchedTemplate?.prompt_templates.findIndex(
          (temp: Templates) => temp.id === templateData?.id
        );
        if (templateIndex !== -1 && templateIndex > 0)
          changeSelectedTemplate(
            fetchedTemplate?.prompt_templates[templateIndex - 1]
          );
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [handleKeyboard]);

  const newTheme = createTheme({ ...theme, palette });

  if (fetchedTemplateError || templateExecutionsError)
    return <div>Something went wrong...</div>;

  return (
    <>
      <Head>
        <title>Promptify | Boost Your Creativity</title>
        <meta
          name="description"
          content="Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeProvider theme={newTheme}>
        <Box sx={{ bgcolor: "background.default" }}>
          <Header transparent />
          {!templateData ? (
            <PageLoading />
          ) : (
            <Grid
              container
              columnSpacing={{ md: 4 }}
              sx={{
                height: "calc(100svh - 90px)",
                position: "relative",
              }}
            >
              <Grid
                item
                xs={12}
                md={3}
                sx={{
                  display: `${generatorOpened ? "block" : "none"}`,
                  height: "100%",
                  overflow: "auto",
                  p: { xs: "16px", md: 0 },
                  pr: { md: "10px" },
                  bgcolor: "background.default",
                  position: { xs: "absolute", md: "relative" },
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 999,
                }}
              >
                {windowWidth < 900 && (
                  <Button
                    sx={{
                      width: "100%",
                      p: "10px 14px",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 2,
                      bgcolor: "primary.main",
                      color: "onPrimary",
                      borderRadius: "16px",
                      ":hover": { bgcolor: "primary.main", color: "onPrimary" },
                    }}
                  >
                    <Box
                      component={"img"}
                      src={
                        templateData.thumbnail || "http://placehold.it/240x150"
                      }
                      alt={"alt"}
                      sx={{
                        width: 56,
                        height: 42,
                        objectFit: "cover",
                        borderRadius: "999px",
                      }}
                    />
                    <Stack alignItems={"flex-start"}>
                      <Typography
                        fontSize={14}
                        color={"inherit"}
                        dangerouslySetInnerHTML={{ __html: templateData.title }}
                      />
                      <Typography
                        fontSize={10}
                        fontWeight={400}
                        color={"inherit"}
                        dangerouslySetInnerHTML={{
                          __html: templateData.category.name,
                        }}
                      />
                    </Stack>
                    <Close
                      sx={{ ml: "auto", fontSize: 26 }}
                      onClick={() => setGeneratorOpened(false)}
                    />
                  </Button>
                )}
                <GeneratorForm
                  templateData={templateData}
                  setNewExecutionData={setNewExecutionData}
                  isGenerating={isGenerating}
                  setIsGenerating={setIsGenerating}
                  onError={setErrorMessage}
                  exit={() => setGeneratorOpened(false)}
                />
              </Grid>

              {windowWidth < 900 && (
                <Button
                  sx={{
                    width: "100%",
                    p: "10px 14px",
                    m: "10px 16px 0",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                    bgcolor: "surface.4",
                    color: "onSurface",
                    borderRadius: "16px",
                    ":hover": { bgcolor: "surface.4", color: "onSurface" },
                  }}
                  onClick={() => setDetailsOpened(true)}
                >
                  <Box
                    component={"img"}
                    src={
                      templateData.thumbnail || "http://placehold.it/240x150"
                    }
                    alt={"alt"}
                    sx={{
                      width: 56,
                      height: 42,
                      objectFit: "cover",
                      borderRadius: "999px",
                    }}
                  />
                  <Stack alignItems={"flex-start"}>
                    <Typography
                      fontSize={14}
                      color={"inherit"}
                      dangerouslySetInnerHTML={{ __html: templateData.title }}
                    />
                    <Typography
                      fontSize={10}
                      fontWeight={400}
                      color={"inherit"}
                      dangerouslySetInnerHTML={{
                        __html: templateData.category.name,
                      }}
                    />
                  </Stack>
                  <KeyboardArrowDown sx={{ ml: "auto", fontSize: 26 }} />
                </Button>
              )}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  height: { xs: "calc(100% - 148px)", md: "100%" },
                  overflow: "auto",
                  pr: { md: "10px" },
                }}
              >
                <Executions
                  templateData={templateData}
                  executions={templateExecutions || []}
                  isFetching={isFetchingExecutions}
                  newExecutionData={NewExecutionData}
                  refetchExecutions={refetchTemplateExecutions}
                />
              </Grid>

              {windowWidth < 900 && (
                <Stack
                  sx={{
                    width: "100%",
                    p: "24px 16px 16px 16px",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    bgcolor: alpha(palette.surface[1], 0.8),
                  }}
                >
                  <Button
                    sx={{
                      bgcolor: "primary.main",
                      color: "onPrimary",
                      fontSize: 13,
                      fontWeight: 500,
                      border: "none",
                      p: "8px 25px",
                      ":hover": {
                        bgcolor: "transparent",
                        color: "primary.main",
                      },
                    }}
                    startIcon={
                      token ? <LogoApp width={18} color="white" /> : null
                    }
                    variant={"contained"}
                    onClick={() => setGeneratorOpened(true)}
                  >
                    New Request
                  </Button>
                  <Loop
                    sx={{
                      width: "24px",
                      height: "24px",
                      color: "onSurface",
                      visibility: !isGenerating ? "hidden" : "visible",
                    }}
                  />
                  <IconButton
                    sx={{
                      flexDirection: { xs: "column", md: "row" },
                      bgcolor: "surface.1",
                      color: "onSurface",
                      border: "none",
                      ":hover": { bgcolor: "action.hover", color: "onSurface" },
                      svg: { width: "24px", height: "24px" },
                    }}
                  >
                    <MoreHoriz />
                  </IconButton>
                </Stack>
              )}

              <Grid
                item
                xs={12}
                md={3}
                sx={{
                  display: `${detailsOpened ? "block" : "none"}`,
                  height: "100%",
                  overflow: "auto",
                  pr: { md: "10px" },
                  bgcolor: "background.default",
                  position: { xs: "absolute", md: "relative" },
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 999,
                }}
              >
                <IconButton
                  sx={{
                    display: { xs: "flex", md: "none" },
                    position: "relative",
                    top: "15px",
                    ml: "auto",
                    right: "30px",
                    zIndex: 1,
                    bgcolor: "surface.1",
                    color: "onSurface",
                    border: "none",
                    ":hover": { bgcolor: "surface.1", color: "onSurface" },
                    svg: { width: "24px", height: "24px" },
                  }}
                  onClick={() => setDetailsOpened(false)}
                >
                  <Close />
                </IconButton>
                <Details
                  templateData={fetchedTemplate}
                  updateTemplateData={setTemplateData}
                  template={templateData}
                  setTemplate={changeSelectedTemplate}
                />
              </Grid>
            </Grid>
          )}

          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            autoHideDuration={6000}
            open={errorMessage.length > 0}
            onClose={() => setErrorMessage("")}
          >
            <Alert severity={"error"}>{errorMessage}</Alert>
          </Snackbar>
        </Box>
      </ThemeProvider>
    </>
  );
};

export async function getServerSideProps({ params }: any) {
  const { id } = params;

  try {
    const templatesResponse = await authClient.get(
      `/api/meta/collections/${id}`
    );
    const fetchedTemplate = templatesResponse.data; // Extract the necessary data from the response

    return {
      props: {
        fetchedTemplate,
        title: "Promptify | Boost Your Creativity",
        description:
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
      },
    };
  } catch (error) {
    console.error("Error fetching collections:", error);
    return {
      props: {
        fetchedTemplate: [],
        fetchedTemplateError: true,
        title: "Promptify | Boost Your Creativity",
        description:
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
      },
    };
  }
}

export default Collection;
