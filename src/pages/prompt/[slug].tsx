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
  Palette,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  ThemeProvider,
  Typography,
  alpha,
  createTheme,
  useTheme,
} from "@mui/material";
import { ArtTrack } from "@mui/icons-material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import materialDynamicColors from "material-dynamic-colors";
import { mix } from "polished";
import { useRouter } from "next/router";

import {
  useGetExecutionsByTemplateQuery,
  useGetPromptTemplateBySlugQuery,
  useTemplateView,
  useGetExecutionByIdQuery,
} from "@/core/api/prompts";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { PageLoading } from "../../components/PageLoading";
import { GeneratorForm } from "@/components/prompt/GeneratorForm";
import { Executions } from "@/components/prompt/Executions";
import { Details } from "@/components/prompt/Details";
import { authClient } from "@/common/axios";
import { DetailsCard } from "@/components/prompt/DetailsCard";
import { Prompts } from "@/core/api/dto/prompts";
import { updateExecution } from "@/hooks/api/executions";
import { PromptLiveResponse } from "@/common/types/prompt";
import { Layout } from "@/layout";
import useToken from "@/hooks/useToken";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      sx={{ height: "100%", width: "100%" }}
      {...other}
    >
      {children}
    </Box>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const Prompt = () => {
  const [newExecutionData, setNewExecutionData] =
    useState<PromptLiveResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGeneratedPrompt, setCurrentGeneratedPrompt] =
    useState<Prompts | null>(null);
  const [openTitleModal, setOpenTitleModal] = useState(false);
  const [executionTitle, setExecutionTitle] = useState("");
  const [defaultExecution, setDefaultExecution] =
    useState<TemplatesExecutions | null>(null);
  const [templateView] = useTemplateView();
  const [generatorOpened, setGeneratorOpened] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();
  const token = useToken();
  const theme = useTheme();
  const [palette, setPalette] = useState(theme.palette);
  const slug = router.query?.slug;
  // TODO: redirect to 404 page if slug is not found
  const slugValue = (Array.isArray(slug) ? slug[0] : slug || "") as string;

  // Fetch new execution data after generating and retrieving its id
  const { data: fetchedNewExecution } = useGetExecutionByIdQuery(
    newExecutionData?.id ? newExecutionData?.id : skipToken
  );

  const {
    data: fetchedTemplate,
    error: fetchedTemplateError,
    isLoading: isLoadingTemplate,
    isFetching: isFetchingTemplate,
  } = useGetPromptTemplateBySlugQuery(slugValue);

  const [templateData, setTemplateData] = useState<Templates>();
  const id = templateData?.id;

  const {
    data: templateExecutions,
    error: templateExecutionsError,
    isFetching: isFetchingExecutions,
    refetch: refetchTemplateExecutions,
  } = useGetExecutionsByTemplateQuery(
    token ? (id ? id : skipToken) : skipToken
  );

  const [tabsValue, setTabsValue] = React.useState(0);
  const changeTab = (e: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };

  useEffect(() => {
    if (fetchedTemplate) {
      setTemplateData(fetchedTemplate);
    }
  }, [fetchedTemplate]);

  useEffect(() => {
    if (id) {
      templateView(id);
    }
  }, [id]);

  const resetNewExecution = () => {
    if (!isGenerating) {
      setGeneratorOpened(false);
      setTimeout(() => setGeneratorOpened(true));
      setDefaultExecution({
        ...(defaultExecution as TemplatesExecutions),
        title: "Untitled",
      });
    }
  };

  // After new generated execution is completed - refetch the executions list and clear the newExecutionData state
  // All prompts should be completed - isCompleted: true
  useEffect(() => {
    if (!isGenerating && newExecutionData?.data?.length) {
      const promptNotCompleted = newExecutionData.data.find(
        (execData) => !execData.isCompleted
      );
      if (!promptNotCompleted) {
        setOpenTitleModal(true);
      }
    }
  }, [isGenerating, newExecutionData]);

  // Keep tracking the current generated prompt
  useEffect(() => {
    if (templateData && newExecutionData?.data?.length) {
      const loadingPrompt = newExecutionData.data.find(
        (prompt) => prompt.isLoading
      );
      const prompt = templateData.prompts.find(
        (prompt) => prompt.id === loadingPrompt?.prompt
      );
      if (prompt) setCurrentGeneratedPrompt(prompt);
    } else {
      setCurrentGeneratedPrompt(null);
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
      .catch(() => {
        fetchDynamicColors();
      });
  };

  const dynamicTheme = createTheme({ ...theme, palette });

  const closeTitleModal = () => {
    setOpenTitleModal(false);
    setExecutionTitle("");
    refetchTemplateExecutions();
  };
  const saveExecutionTitle = async () => {
    if (executionTitle.length) {
      if (fetchedNewExecution?.id) {
        try {
          await updateExecution(fetchedNewExecution?.id, {
            ...fetchedNewExecution,
            title: executionTitle,
          });
        } catch (err) {
          console.error(err);
        }
      }

      refetchTemplateExecutions();
      setNewExecutionData(null);
      setCurrentGeneratedPrompt(null);
      setOpenTitleModal(false);
      setExecutionTitle("");
    }
  };

  const ExecutionTitleModal = (
    <Dialog
      open={openTitleModal}
      PaperProps={{
        sx: { bgcolor: "surface.1" },
      }}
    >
      <DialogTitle sx={{ fontSize: 16, fontWeight: 400 }}>
        Enter a title for your new spark:
      </DialogTitle>
      <DialogContent>
        <TextField
          sx={{
            ".MuiInputBase-input": {
              p: 0,
              color: "onSurface",
              fontSize: 48,
              fontWeight: 400,
              "&::placeholder": { color: "grey.600" },
            },
            ".MuiOutlinedInput-notchedOutline": { border: 0 },
            ".MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: 0,
            },
          }}
          placeholder={"Title..."}
          onChange={(e) => setExecutionTitle(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ p: "16px", gap: 2 }}>
        <Button
          sx={{ minWidth: "auto", p: 0, color: "grey.600" }}
          onClick={closeTitleModal}
        >
          Skip
        </Button>
        <Button
          sx={{
            ":disabled": { color: "grey.600" },
            ":hover": { bgcolor: "action.hover" },
          }}
          disabled={!executionTitle.length}
          onClick={saveExecutionTitle}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (fetchedTemplateError || templateExecutionsError)
    return <div>Something went wrong...</div>;

  return (
    <>
      <ThemeProvider theme={dynamicTheme}>
        <Layout>
          {!templateData || isLoadingTemplate || isFetchingTemplate ? (
            <PageLoading />
          ) : (
            <Grid
              mt={{ xs: 7, md: 0 }}
              container
              sx={{
                mx: "auto",
                height: "calc(100svh - (90px + 32px))",
                width: { md: "calc(100% - 65px)" },
                bgcolor: "surface.2",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Grid
                className="prompt-grid"
                sx={{
                  height: "100%",
                  maxWidth: "430px",
                  overflow: "auto",
                  position: "relative",
                  top: 0,
                  left: 0,
                  scrollbarColor: "red",
                  right: 0,
                  zIndex: 999,
                  "&::-webkit-scrollbar": {
                    width: "0.4em",
                  },
                  "&::-webkit-scrollbar-track": {
                    boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
                    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "surface.3",
                    outline: "1px solid surface.3",
                    borderRadius: "10px",
                  },
                }}
              >
                <Stack height={"100%"}>
                  <DetailsCard
                    templateData={templateData}
                    resetNewExecution={resetNewExecution}
                  />
                  <Stack flex={1}>
                    <Tabs
                      value={tabsValue}
                      onChange={changeTab}
                      textColor="primary"
                      indicatorColor="primary"
                      variant="fullWidth"
                      sx={{
                        minHeight: "auto",
                        boxShadow: "0px -1px 0px 0px #ECECF4 inset",
                      }}
                    >
                      <Tab
                        label="(X) Variables"
                        {...a11yProps(0)}
                        sx={{
                          fontSize: 13,
                          fontWeight: 500,
                          textTransform: "none",
                          p: "16px",
                          minHeight: "auto",
                          bgcolor: "surface.1",
                          color: `${alpha(palette.onSurface, 0.5)}`,
                        }}
                      />
                      <Tab
                        label="About"
                        {...a11yProps(1)}
                        icon={<ArtTrack />}
                        iconPosition="start"
                        sx={{
                          fontSize: 13,
                          fontWeight: 500,
                          textTransform: "none",
                          p: "16px",
                          minHeight: "auto",
                          bgcolor: "surface.1",
                          color: `${alpha(palette.onSurface, 0.5)}`,
                        }}
                      />
                    </Tabs>
                    <Box flex={1}>
                      <CustomTabPanel value={tabsValue} index={0}>
                        {generatorOpened && (
                          <GeneratorForm
                            templateData={templateData}
                            setNewExecutionData={setNewExecutionData}
                            isGenerating={isGenerating}
                            setIsGenerating={setIsGenerating}
                            onError={setErrorMessage}
                            exit={() => setGeneratorOpened(false)}
                          />
                        )}
                      </CustomTabPanel>
                      <CustomTabPanel value={tabsValue} index={1}>
                        <Details
                          templateData={templateData}
                          updateTemplateData={setTemplateData}
                        />
                      </CustomTabPanel>
                    </Box>
                  </Stack>
                </Stack>
              </Grid>

              <Grid
                flex={1}
                sx={{
                  height: "100%",
                  overflow: "auto",
                  bgcolor: "surface.1",
                  borderLeft: "1px solid #ECECF4",
                  position: "relative",
                }}
              >
                <Executions
                  templateData={templateData}
                  executions={templateExecutions || []}
                  isFetching={isFetchingExecutions}
                  defaultExecution={defaultExecution}
                  newExecutionData={newExecutionData}
                  refetchExecutions={refetchTemplateExecutions}
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
                      Prompt #{currentGeneratedPrompt.order}:{" "}
                      {currentGeneratedPrompt.title}
                    </Typography>
                  </Box>
                )}
              </Grid>
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
        </Layout>
      </ThemeProvider>
    </>
  );
};

export async function getServerSideProps({ params }: any) {
  const { slug } = params;

  try {
    const templatesResponse = await authClient.get(
      `/api/meta/templates/by-slug/${slug}/`
    );
    const fetchedTemplate = templatesResponse.data; // Extract the necessary data from the response

    return {
      props: {
        title: fetchedTemplate.meta_title || fetchedTemplate.title,
        description:
          fetchedTemplate.meta_description || fetchedTemplate.description,
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
