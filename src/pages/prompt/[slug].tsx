import React, { useEffect, useRef, useState } from "react";
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
  createTheme,
  useTheme,
} from "@mui/material";
import { ArtTrack, History as HistoryIcon } from "@mui/icons-material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import materialDynamicColors from "material-dynamic-colors";
import { mix } from "polished";
import { useRouter } from "next/router";

import {
  useGetPromptTemplateBySlugQuery,
  useTemplateView,
  useGetExecutionByIdQuery,
} from "@/core/api/prompts";
import {
  Spark,
  Templates,
  TemplatesExecutions,
} from "@/core/api/dto/templates";
import { PageLoading } from "../../components/PageLoading";
import { GeneratorForm } from "@/components/prompt/GeneratorForm";
import { Display } from "@/components/prompt/Display";
import { Details } from "@/components/prompt/Details";
import { authClient } from "@/common/axios";
import { DetailsCard } from "@/components/prompt/DetailsCard";
import { Prompts } from "@/core/api/dto/prompts";
import { createSparkWithExecution } from "@/hooks/api/executions";
import { PromptLiveResponse } from "@/common/types/prompt";
import { Layout } from "@/layout";
import useToken from "@/hooks/useToken";
import { useWindowSize } from "usehooks-ts";
import BottomTabs from "@/components/prompt/BottomTabs";
import { History } from "@/components/prompt/History";
import { useGetSparksByTemplateQuery } from "@/core/api/sparks";
import moment from "moment";

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
  const [selectedSpark, setSelectedSpark] = useState<Spark | null>(null);
  const [selectedExecution, setSelectedExecution] =
    useState<TemplatesExecutions | null>(null);
  const [newExecutionData, setNewExecutionData] =
    useState<PromptLiveResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGeneratedPrompt, setCurrentGeneratedPrompt] =
    useState<Prompts | null>(null);
  const [openTitleModal, setOpenTitleModal] = useState(false);
  const [sparkTitle, setSparkTitle] = useState("");
  const [defaultExecution, setDefaultExecution] =
    useState<TemplatesExecutions | null>(null);
  const [templateView] = useTemplateView();
  const [generatorOpened, setGeneratorOpened] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [activeTab, setActiveTab] = React.useState(0);
  const [sortedSparks, setSortedSparks] = useState<Spark[]>([]);

  const [tabsValue, setTabsValue] = useState(0);
  
  const [mobileTab, setMobileTab] = useState(0);

  const detailsElRef = useRef<HTMLDivElement | null>(null);
  const [hideDetailsImage, setHideDetailsImage] = useState(false);

  const router = useRouter();
  const token = useToken();
  const theme = useTheme();
  const [palette, setPalette] = useState(theme.palette);
  const { width: windowWidth } = useWindowSize();

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

  useEffect(() => {
    if (fetchedTemplate) {
      setTemplateData(fetchedTemplate);
    }
  }, [fetchedTemplate]);

  const {
    data: templateSparks,
    error: templateSparksError,
    isFetching: isFetchingExecutions,
    refetch: refetchTemplateSparks,
  } = useGetSparksByTemplateQuery(token ? (id ? id : skipToken) : skipToken);

  useEffect(() => {
    const sorted = [...(templateSparks || [])].sort((a, b) => (
      moment(b.current_version?.created_at).diff(moment(a.current_version?.created_at))
    ));
    setSortedSparks(sorted);
  }, [templateSparks]);
  
  useEffect(() => {
    setSelectedSpark(sortedSparks?.[0] || null);
  }, [sortedSparks]);
  
  useEffect(() => {
    setSelectedExecution(selectedSpark?.current_version || null);
  }, [selectedSpark]);

  const changeTab = (e: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };

  const handleScroll = () => {
    const scrollY = detailsElRef.current?.scrollTop || 0;
    setHideDetailsImage(scrollY > 226);
  };

  useEffect(() => {
    const detailsEl = detailsElRef.current;
    detailsEl?.addEventListener("scroll", handleScroll);
    return () => detailsEl?.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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
      setSelectedSpark(null);
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
        if (selectedSpark) refetchTemplateSparks();
        else setOpenTitleModal(true);
      }
    }
  }, [isGenerating, newExecutionData]);

  useEffect(() => {
    if (isGenerating) setMobileTab(2);
  }, [isGenerating]);

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
    setSparkTitle("");
    refetchTemplateSparks();
  };
  const saveSparkTitle = async () => {
    if (sparkTitle.length) {
      if (fetchedNewExecution?.id) {
        try {
          await createSparkWithExecution({
            title: sparkTitle,
            execution_id: fetchedNewExecution.id,
          });
        } catch (err) {
          console.error(err);
        }
      }

      refetchTemplateSparks();
      setNewExecutionData(null);
      setCurrentGeneratedPrompt(null);
      setOpenTitleModal(false);
      setSparkTitle("");
    }
  };

  const SparkTitleModal = (
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
          onChange={(e) => setSparkTitle(e.target.value)}
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
          disabled={!sparkTitle.length}
          onClick={saveSparkTitle}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (fetchedTemplateError || templateSparksError)
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
                height: {
                  xs: "calc(100svh - 56px)",
                  md: "calc(100svh - (90px + 32px))",
                },
                pb: {
                  xs: `calc(68px + ${mobileTab !== 0 ? "64" : "0"}px)`, // 64px fixed min card details + 68px bottom tabs. Hidden in details tab.
                  md: 0,
                },
                width: { md: "calc(100% - 65px)" },
                bgcolor: "surface.2",
                borderTopLeftRadius: { md: "16px" },
                borderTopRightRadius: { md: "16px" },
                overflow: "hidden",
                position: "relative",
              }}
            >
              {windowWidth > 960 && (
                <Grid
                  sx={{
                    height: "100%",
                    width: "401px",
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
                          label="(x) Variables"
                          {...a11yProps(0)}
                          sx={tabStyle}
                        />
                        <Tab
                          label="About"
                          {...a11yProps(1)}
                          icon={<ArtTrack />}
                          iconPosition="start"
                          sx={tabStyle}
                        />
                        <Tab
                          label="History"
                          {...a11yProps(1)}
                          icon={<HistoryIcon />}
                          iconPosition="start"
                          sx={tabStyle}
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
                              currentSparkId={selectedSpark?.id ?? null}
                              selectedExecution={selectedExecution}
                              setMobileTab={setMobileTab}
                              setActiveTab={setActiveTab}
                              resetNewExecution={resetNewExecution}
                              sparks={sortedSparks}
                              selectedSpark={selectedSpark}
                              setSelectedSpark={setSelectedSpark}
                              setSortedSparks={setSortedSparks}
                              sparksShown={false}
                            />
                          )}
                        </CustomTabPanel>
                        <CustomTabPanel value={tabsValue} index={1}>
                          <Details
                            templateData={templateData}
                            updateTemplateData={setTemplateData}
                          />
                        </CustomTabPanel>
                        <CustomTabPanel value={tabsValue} index={2}>
                          <History
                            spark={selectedSpark}
                            selectedExecution={selectedExecution}
                            setSelectedExecution={setSelectedExecution}
                          />
                        </CustomTabPanel>
                      </Box>
                    </Stack>
                  </Stack>
                </Grid>
              )}

              {windowWidth < 960 && (
                <>
                  {mobileTab !== 0 && (
                    <DetailsCard
                      templateData={templateData}
                      resetNewExecution={resetNewExecution}
                      min
                    />
                  )}

                  <Grid
                    ref={detailsElRef}
                    item
                    xs={12}
                    md={8}
                    sx={{
                      display: mobileTab === 0 ? "block" : "none",
                      height: "100%",
                      overflow: "auto",
                      bgcolor: "surface.1",
                      position: "relative",
                    }}
                  >
                    <DetailsCard
                      templateData={templateData}
                      resetNewExecution={resetNewExecution}
                    />
                    <Details
                      templateData={templateData}
                      updateTemplateData={setTemplateData}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={8}
                    sx={{
                      display: mobileTab === 1 ? "block" : "none",
                      height: "100%",
                      overflow: "auto",
                      bgcolor: "surface.1",
                    }}
                  >
                    <GeneratorForm
                      templateData={templateData}
                      setNewExecutionData={setNewExecutionData}
                      isGenerating={isGenerating}
                      setIsGenerating={setIsGenerating}
                      onError={setErrorMessage}
                      exit={() => setGeneratorOpened(false)}
                      currentSparkId={selectedSpark?.id ?? null}
                      selectedExecution={selectedExecution}
                      setMobileTab={setMobileTab}
                      setActiveTab={setActiveTab}
                      resetNewExecution={resetNewExecution}
                      sparks={sortedSparks}
                      selectedSpark={selectedSpark}
                      setSelectedSpark={setSelectedSpark}
                      setSortedSparks={setSortedSparks}
                      sparksShown
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={8}
                    sx={{
                      display: mobileTab === 3 ? "block" : "none",
                      height: "100%",
                      overflow: "auto",
                      bgcolor: "surface.1",
                    }}
                  >
                    <History
                      spark={selectedSpark}
                      selectedExecution={selectedExecution}
                      setSelectedExecution={setSelectedExecution}
                    />
                  </Grid>
                </>
              )}

              <Grid
                flex={1}
                sx={{
                  display: {
                    md: "block",
                    xs: mobileTab === 2 ? "block" : "none",
                  },
                  height: "100%",
                  overflow: "auto",
                  bgcolor: "surface.1",
                  borderLeft: "1px solid #ECECF4",
                  position: "relative",
                }}
              >
                <Display
                  templateData={templateData}
                  sparks={sortedSparks}
                  selectedSpark={selectedSpark}
                  setSelectedSpark={setSelectedSpark}
                  selectedExecution={selectedExecution}
                  isFetching={isFetchingExecutions}
                  newExecutionData={newExecutionData}
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

              <BottomTabs
                onChange={(tab) => setMobileTab(tab)}
                setActiveTab={setActiveTab}
                activeTab={activeTab}
              />
            </Grid>
          )}

          {SparkTitleModal}

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

const tabStyle = {
  fontSize: 13,
  fontWeight: 500,
  textTransform: "none",
  p: "16px",
  minHeight: "auto",
  bgcolor: "surface.1",
  opacity: 0.7,
  svg: {
    fontSize: 20,
  },
};
