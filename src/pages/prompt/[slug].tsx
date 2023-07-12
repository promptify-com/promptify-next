import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Palette,
  Snackbar,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  alpha,
  createTheme,
  useTheme,
} from "@mui/material";
import materialDynamicColors from "material-dynamic-colors";
import { mix } from "polished";
import { Header } from "@/components/blocks/VHeader";

import {
  useGetPromptTemplatesExecutionsQuery,
  useGetPromptTemplateBySlugQuery,
  useTemplateView,
} from "../../core/api/prompts";
import { Templates, TemplatesExecutions } from "../../core/api/dto/templates";
import { PageLoading } from "../../components/PageLoading";
import { useWindowSize } from "usehooks-ts";
import { Close, KeyboardArrowDown, Loop, MoreHoriz } from "@mui/icons-material";
import useToken from "../../hooks/useToken";
import { LogoApp } from "../../assets/icons/LogoApp";
import { useRouter } from "next/router";
import { GeneratorForm } from "@/components/prompt/GeneratorForm";
import { Executions } from "@/components/prompt/Executions";
import { Details } from "@/components/prompt/Details";
import { authClient } from "@/common/axios";
import { Sidebar } from "@/components/blocks/VHeader/Sidebar";
import { DetailsCard } from "@/components/prompt/DetailsCard";
import { Prompts } from "@/core/api/dto/prompts";

export interface PromptLiveResponseData {
  message: string;
  prompt: number;
  created_at: Date;
  isLoading?: boolean;
  isCompleted?: boolean;
  isFailed?: boolean;
}
export interface PromptLiveResponse {
  created_at: Date;
  data: PromptLiveResponseData[] | undefined;
}

const Prompt = () => {
  const router = useRouter();
  const token = useToken();
  const [newExecutionData, setNewExecutionData] = useState<PromptLiveResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGeneratedPrompt, setCurrentGeneratedPrompt] = useState<Prompts | null>(null);
  const [openTitleModal, setOpenTitleModal] = useState(false);
  const [templateView] = useTemplateView();
  const theme = useTheme();
  const [palette, setPalette] = useState(theme.palette);
  const { width: windowWidth } = useWindowSize();
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [generatorOpened, setGeneratorOpened] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const slug = router.query?.slug;
  // TODO: redirect to 404 page if slug is not found
  const slugValue = ( Array.isArray(slug) ? slug[0] : slug || "" ) as string;

  const {
    data: fetchedTemplate,
    error: fetchedTemplateError,
    isLoading: isLoadingTemplate,
    isFetching: isFetchingTemplate,
  } = useGetPromptTemplateBySlugQuery(slugValue, {
    refetchOnMountOrArgChange: true,
  });

  const [templateData, setTemplateData] = useState<Templates>();
  const id = templateData?.id;

  const {
    data: templateExecutions,
    error: templateExecutionsError,
    isFetching: isFetchingExecutions,
    refetch: refetchTemplateExecutions,
  } = useGetPromptTemplatesExecutionsQuery(id ? +id : 1, {
      refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (fetchedTemplate) {
        setTemplateData(fetchedTemplate);
    }
  }, [fetchedTemplate]);


  useEffect(() => {
    if (id) {
      refetchTemplateExecutions();
      templateView(id);
    }
  }, [id]);

  useEffect(() => {
    if (windowWidth > 900) {
      // setDetailsOpened(true);
      setGeneratorOpened(true);
    } else {
      // setDetailsOpened(false);
      setGeneratorOpened(false);
    }
  }, [windowWidth]);


  // After new generated execution is completed - refetch the executions list and clear the newExecutionData state
  // All prompts should be completed - isCompleted: true
  useEffect(() => {
    if (!isGenerating && newExecutionData?.data?.length) {
      const promptNotCompleted = newExecutionData.data.find(execData => !execData.isCompleted);
      if (!promptNotCompleted) {
        refetchTemplateExecutions();
        setNewExecutionData(null);
        setCurrentGeneratedPrompt(null)
      }
    }
  }, [isGenerating, newExecutionData]);

  // Keep tracking the current generated prompt
  useEffect(() => {
    if(templateData && newExecutionData?.data?.length) {
      const loadingPrompt = newExecutionData.data.find(prompt => prompt.isLoading);
      const prompt = templateData.prompts.find((prompt) => prompt.id === loadingPrompt?.prompt);
      if(prompt) 
        setCurrentGeneratedPrompt(prompt)
    } else {
      setCurrentGeneratedPrompt(null)
    }
  }, [newExecutionData]);

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

  const dynamicTheme = createTheme({ ...theme, palette });

  const closeTitleModal = () => {
    setOpenTitleModal(false);
  }

  const ExecutionTitleModal = (
    <Dialog open={openTitleModal} onClose={closeTitleModal}
      PaperProps={{
        sx: { bgcolor: "surface.1" }
      }}
    >
      <DialogTitle sx={{ fontSize: 16, fontWeight: 400 }}>Enter a title for your new spark:</DialogTitle>
      <DialogContent>
        <TextField
          sx={{
            width: "100%",
            ".MuiInputBase-input": {
              p: 0,
              color: "onSurface",
              fontSize: 48,
              fontWeight: 400,
              "&::placeholder": {
                color: "grey.600",
                opacity: 1
              }
            },
            ".MuiOutlinedInput-notchedOutline": {
              border: 0,
            },
            ".MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: 0,
            },
          }}
          placeholder={"Title..."}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeTitleModal}>Skip</Button>
        <Button onClick={closeTitleModal}>Save</Button>
      </DialogActions>
    </Dialog>
  )

  if (fetchedTemplateError || templateExecutionsError)
    return <div>Something went wrong...</div>;

  return (
    <>
      <ThemeProvider theme={dynamicTheme}>
        <Box sx={{ bgcolor: "surface.3" }}>
          <Sidebar />
          <Box sx={{ 
            width: { md: 'calc(100% - 96px)' }, 
            ml: { md: 'auto' }
          }}
          >
            <Header transparent />
            {!templateData || isLoadingTemplate || isFetchingTemplate ? (
              <PageLoading />
            ) : (
              <Grid
                container
                sx={{
                  mx: { md: "32px" },
                  height: "calc(100svh - 90px)",
                  width: { md: "calc(100% - 65px)" },
                  bgcolor: "surface.2",
                  borderTopLeftRadius: "16px",
                  borderTopRightRadius: "16px",
                  position: "relative"
                }}
              >
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    display: `${generatorOpened ? "block" : "none"}`,
                    height: "100%",
                    overflow: "auto",
                    p: "16px",
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
                  <DetailsCard 
                    templateData={templateData} 
                    detailsOpened={detailsOpened} 
                    toggleDetails={() => setDetailsOpened(!detailsOpened)}
                  />
                  <GeneratorForm
                    templateData={templateData}
                    setNewExecutionData={setNewExecutionData}
                    isGenerating={isGenerating}
                    setIsGenerating={setIsGenerating}
                    onError={setErrorMessage}
                    exit={() => setGeneratorOpened(false)}
                  />
                  {detailsOpened && (
                    <Dialog
                      open={true}
                      onClose={() => setDetailsOpened(false)}
                      disablePortal 
                      hideBackdrop
                      PaperProps={{
                        sx: {
                          m: "16px",
                          width: "calc(100% - 32px)",
                          bgcolor: "surface.1",
                          borderRadius: "16px"
                        }
                      }}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 'fit-content'
                      }}
                    >
                      <DetailsCard 
                        templateData={templateData} 
                        detailsOpened={detailsOpened} 
                        toggleDetails={() => setDetailsOpened(!detailsOpened)}
                      />
                      <Details 
                        templateData={templateData}
                        updateTemplateData={setTemplateData}
                      />
                    </Dialog>
                  )}
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
                  md={8}
                  sx={{
                    height: { xs: "calc(100% - 148px)", md: "100%" },
                    overflow: "auto",
                    bgcolor: "surface.1",
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
                    position: "relative"
                  }}
                >
                  <Executions
                    templateData={templateData}
                    executions={templateExecutions || []}
                    isFetching={isFetchingExecutions}
                    newExecutionData={newExecutionData}
                    refetchExecutions={refetchTemplateExecutions}
                  />
                  {currentGeneratedPrompt && (
                    <Box sx={{ 
                        position: "sticky",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 998,
                        bgcolor: "surface.1" 
                      }}
                    >
                      <Divider sx={{ borderColor: "surface.3" }} />
                      <Typography sx={{
                          padding: "8px 16px 5px",
                          textAlign: "right",
                          fontSize: 11,
                          fontWeight: 500,
                          opacity: .3
                        }}
                      >
                        Prompt #{currentGeneratedPrompt.order}: {currentGeneratedPrompt.title}
                      </Typography>
                    </Box>
                  )}
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

                {/* <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{
                    display: `${detailsOpened ? "block" : "none"}`,
                    height: "100%",
                    overflow: "auto",
                    pr: { md: "10px" },
                    bgcolor: "surface.3",
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
                    templateData={templateData}
                    updateTemplateData={setTemplateData}
                  />
                </Grid> */}
              </Grid>
            )}

            {ExecutionTitleModal}

            <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              open={errorMessage.length > 0}
              autoHideDuration={6000}
              onClose={() => setErrorMessage("")}
            >
              <Alert severity={"error"}>{errorMessage}</Alert>
            </Snackbar>
          </Box>
        </Box>
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
