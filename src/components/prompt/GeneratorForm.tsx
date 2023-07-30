import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  AddOutlined,
  ArrowDropDown,
  ArrowDropUp,
  AutoFixHigh,
  Close,
  Replay,
} from "@mui/icons-material";
import {
  PromptParams,
  ResInputs,
  ResOverrides,
  ResPrompt,
} from "@/core/api/dto/prompts";
import { PromptLiveResponse } from "@/common/types/prompt";
import useToken from "@/hooks/useToken";
import { useAppDispatch } from "@/hooks/useStore";
import { promptsApi } from "@/core/api/prompts";
import { GeneratorInput } from "./GeneratorInput";
import { GeneratorParam } from "./GeneratorParam";
import { savePathURL } from "@/common/utils";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { getArrayFromString } from "@/common/helpers/getArrayFromString";
import {
  Spark,
  Templates,
  TemplatesExecutions,
} from "@/core/api/dto/templates";
import { LogoApp } from "@/assets/icons/LogoApp";
import { useWindowSize } from "usehooks-ts";
import { useRouter } from "next/router";
import { useParametersPresets } from "@/hooks/api/parametersPresets";
import { DisplayHeader } from "./DisplayHeader";
import { pinSpark, unpinSpark } from "@/hooks/api/executions";

interface GeneratorFormProps {
  templateData: Templates;
  setNewExecutionData: (data: PromptLiveResponse) => void;
  isGenerating: boolean;
  setIsGenerating: (status: boolean) => void;
  onError: (errMsg: string) => void;
  exit: () => void;
  currentSparkId: number | null;
  selectedExecution: TemplatesExecutions | null;
  setMobileTab: (value: number) => void;
  setActiveTab: (value: number) => void;
  mobileTab?: number;
  resetNewExecution: () => void;
  sparks: Spark[];
  selectedSpark: Spark | null;
  setSelectedSpark: (spark: Spark) => void;
  setSortedSparks: (value: Spark[]) => void;
  sparksShown: boolean;
}

export interface InputsErrors {
  [key: string]: number | boolean;
}
interface Input {
  prompt: number;
  name: string;
  fullName: string;
  type: string;
  defaultValue?: string | number | null;
}
interface Param {
  prompt: number;
  param: PromptParams;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  templateData,
  setNewExecutionData,
  isGenerating,
  setIsGenerating,
  onError,
  exit,
  currentSparkId,
  selectedExecution,
  setMobileTab,
  setActiveTab,
  mobileTab,
  resetNewExecution,
  sparks,
  selectedSpark,
  setSelectedSpark,
  setSortedSparks,
  sparksShown,
}) => {
  const token = useToken();
  const { palette } = useTheme();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { width: windowWidth } = useWindowSize();

  const [generatingResponse, setGeneratingResponse] =
    useState<PromptLiveResponse | null>(null);
  const [newExecutionId, setNewExecutionId] = useState<number | null>(null);
  const [resPrompts, setResPrompts] = useState<ResPrompt[]>([]);
  const [lastExecution, setLastExecution] = useState<ResPrompt[] | null>(null);
  const [resInputs, setResInputs] = useState<ResInputs[]>([]);
  const [resOverrides, setResOverrides] = useState<ResOverrides[]>([]);
  const [errors, setErrors] = useState<InputsErrors>({});
  const [shownInputs, setShownInputs] = useState<Input[] | null>(null);
  const [shownParams, setShownParams] = useState<Param[] | null>(null);
  const [presets] = useParametersPresets();
  const [presetsAnchor, setPresetsAnchor] = useState<HTMLElement | null>(null);
  const [allowGenerate, setAllowGenerate] = useState<boolean>(false);

  const setDefaultResPrompts = () => {
    const tempArr: ResPrompt[] = [...resPrompts];

    templateData.prompts.forEach((prompt) => {
      const tempObj: ResPrompt = {} as ResPrompt;

      tempObj.prompt = prompt.id;
      tempObj.contextual_overrides = [];
      tempObj.prompt_params = { Scope: "", Field: "aa" };
      tempArr.push(tempObj);
    });
    setResPrompts([...tempArr]);
  };

  useEffect(() => {
    if (selectedExecution?.parameters) {
      const inputs = Object.entries(selectedExecution.parameters).map(
        ([promptId, values]) => ({
          id: +promptId,
          inputs: values,
        })
      );
      setResInputs(inputs);
    }
  }, [shownInputs?.length, selectedExecution]);

  useEffect(() => {
    console.log("Set new overrides");
    if (selectedExecution?.contextual_overrides) {
      const overrides = Object.entries(selectedExecution.contextual_overrides)
        .map(([promptId, values]) => ({
          id: +promptId,
          contextual_overrides: values,
        }))
        .filter((override) => override.contextual_overrides.length > 0);
      setResOverrides(overrides);
    }
  }, [selectedExecution]);

  const changeResPrompts = () => {
    const tempArr = [...resPrompts];

    if (resInputs.length > 0) {
      tempArr.forEach((prompt, index) => {
        const obj = resInputs.find((inputs) => inputs.id === prompt.prompt);
        if (obj) {
          tempArr[index].prompt_params = obj.inputs;
        }
      });
    }

    if (resOverrides.length > 0) {
      tempArr.forEach((prompt, index) => {
        const obj = resOverrides.find(
          (overrides) => overrides.id === prompt.prompt
        );
        if (obj) {
          tempArr[index].contextual_overrides = obj.contextual_overrides;
        }
      });
    }

    setResPrompts([...tempArr]);
  };

  // Prompts params values tracker to validate generating allowed or not
  useEffect(() => {
    if (Object.keys(isInputsFilled()).length > 0) setAllowGenerate(false);
    else setAllowGenerate(true);
  }, [resPrompts]);

  const isInputsFilled = () => {
    const tempErrors: InputsErrors = {};

    templateData.prompts.forEach((prompt) => {
      const inputs = getArrayFromString(prompt.content);

      inputs.forEach((input) => {
        const checkParams = resPrompts.find(
          (resPrompt) =>
            resPrompt.prompt_params && resPrompt.prompt_params[input.name]
        );

        if (!checkParams || !checkParams.prompt_params[input.name]) {
          tempErrors[input.name] = prompt.id;
        }
      });
    });

    return tempErrors;
  };

  const validateInputs = () => {
    const emptyInputs = isInputsFilled();

    if (!token) {
      setErrors({});
      return true;
    }

    if (Object.keys(emptyInputs).length > 0) {
      setErrors({ ...emptyInputs });
      return false;
    }

    setErrors({});
    return true;
  };

  const handlePostPrompt = () => {
    if (!token) {
      savePathURL(window.location.pathname);
      return router.push("/signin");
    }

    if (!validateInputs()) return;

    setMobileTab(2);
    setActiveTab(2);
    generateExecution(resPrompts);
  };

  const generateExecution = (executionData: ResPrompt[]) => {
    if (isGenerating) return;

    setLastExecution(JSON.parse(JSON.stringify(executionData)));

    setIsGenerating(true);

    if (windowWidth < 900) setTimeout(() => exit(), 2000);

    let tempData: any[] = [];
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/meta/templates/${templateData.id}/execute/`;
    if (currentSparkId) url += `?spark_id=${currentSparkId}`;
    fetchEventSource(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(executionData),
      openWhenHidden: true,

      async onopen(res) {
        if (res.ok && res.status === 200) {
          setIsGenerating(true);
          setGeneratingResponse({ created_at: new Date(), data: [] });
        } else if (
          res.status >= 400 &&
          res.status < 500 &&
          res.status !== 429
        ) {
          console.error("Client side error ", res);
          onError("Something went wrong. Please try again later");
        }
      },
      onmessage(msg) {
        try {
          const parseData = JSON.parse(msg.data.replace(/'/g, '"'));
          const message = parseData.message;
          const prompt = parseData.prompt_id;
          const executionId = parseData.template_execution_id;

          if (executionId) setNewExecutionId(executionId);

          if (msg.event === "infer" && msg.data) {
            if (message) {
              const tempArr = [...tempData];
              const activePrompt = tempArr.findIndex(
                (template) => template.prompt === +prompt
              );

              if (activePrompt === -1) {
                tempArr.push({
                  message,
                  prompt,
                });
              } else {
                tempArr[activePrompt] = {
                  ...tempArr[activePrompt],
                  message: tempArr[activePrompt].message + message,
                  prompt,
                };
              }

              tempData = [...tempArr];
              setGeneratingResponse((prevState) => ({
                ...prevState,
                created_at: prevState?.created_at || new Date(),
                data: tempArr,
              }));
            }
          } else {
            const tempArr = [...tempData];
            const activePrompt = tempArr.findIndex(
              (template) => template.prompt === +prompt
            );

            if (message === "[COMPLETED]") {
              tempArr[activePrompt] = {
                ...tempArr[activePrompt],
                prompt,
                isLoading: false,
                isCompleted: true,
              };
            }

            if (message === "[INITIALIZING]") {
              if (activePrompt === -1) {
                tempArr.push({
                  message: "",
                  prompt,
                  isLoading: true,
                  created_at: new Date(),
                });
              } else {
                tempArr[activePrompt] = {
                  ...tempArr[activePrompt],
                  prompt,
                  isLoading: true,
                };
              }
            }

            if (message.includes("[ERROR]")) {
              onError(message);
            }

            tempData = [...tempArr];
            setGeneratingResponse((prevState) => ({
              ...prevState,
              created_at: prevState?.created_at || new Date(),
              data: tempArr,
            }));
          }
        } catch {
          console.error(msg);
          // TODO: this is triggered event when there is no error
          // onError(msg.data.slice(0, 100));
        }
      },
      onerror(err) {
        console.error(err);
        setIsGenerating(false);
        onError("Something went wrong. Please try again later");
        throw err; // rethrow to stop the operation
      },
      onclose() {
        setIsGenerating(false);
      },
    });
  };

  useEffect(() => {
    if (newExecutionId) {
      setGeneratingResponse((prevState) => ({
        id: newExecutionId,
        created_at: prevState?.created_at || new Date(),
        data: prevState?.data || [],
      }));
    }
  }, [newExecutionId]);

  useEffect(() => {
    if (generatingResponse) setNewExecutionData(generatingResponse);
  }, [generatingResponse]);

  useEffect(() => {
    if (templateData) {
      setDefaultResPrompts();
    }
  }, [templateData]);

  useEffect(() => {
    if (resPrompts.length > 0) {
      changeResPrompts();
    }
    console.log(resInputs);
  }, [resInputs, resOverrides]);

  useEffect(() => {
    removeDuplicates();
  }, [templateData]);

  const removeDuplicates = async () => {
    const shownInputs = new Map<string, Input>();
    const shownParams = new Map<number, Param>();
    await Promise.all(
      [...templateData.prompts]
        .sort((a, b) => a.order - b.order)
        .map(async (prompt) => {
          const inputs = getArrayFromString(prompt.content);
          inputs.forEach((input) => {
            shownInputs.set(input.name, { ...input, prompt: prompt.id });
          });

          const params = (
            await dispatch(
              promptsApi.endpoints.getPromptParams.initiate(prompt.id)
            )
          ).data;
          params
            ?.filter((param) => param.is_visible)
            .forEach((param) => {
              shownParams.set(param.parameter.id, { param, prompt: prompt.id });
            });
        })
    );
    setShownInputs(Array.from(shownInputs.values()));
    setShownParams(Array.from(shownParams.values()));
  };

  // Keyboard shortcuts
  const handleKeyboard = (e: KeyboardEvent) => {
    // prevent trigger if typing inside input
    const target = e.target as HTMLElement;
    if (!["INPUT", "TEXTAREA"].includes(target.tagName)) {
      if (e.shiftKey && e.code === "KeyR" && lastExecution) {
        generateExecution(lastExecution);
      }
    }
  };

  const handlePinSpark = async () => {
    // console.log(selectedSpark)
    if (selectedSpark === null) return;

    try {
      if (selectedSpark.is_favorite) {
        await unpinSpark(selectedSpark.id);
      } else {
        await pinSpark(selectedSpark.id);
      }

      // Update state after API call is successful and avoid unnecessary refetch of sparks
      const updatedSparks = sparks.map((spark) => {
        if (spark.id === selectedSpark?.id) {
          return {
            ...spark,
            is_favorite: !selectedSpark.is_favorite,
          };
        }
        return spark;
      });
      setSortedSparks(updatedSparks);
      setSelectedSpark({
        ...selectedSpark,
        is_favorite: !selectedSpark.is_favorite,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [handleKeyboard]);

  return (
    <Box
      sx={{
        minHeight: "calc(100% - 32px)",
        bgcolor: "surface.2",
      }}
    >
      {sparksShown && (
        <DisplayHeader
          sparks={sparks}
          selectedSpark={selectedSpark}
          changeSelectedSpark={setSelectedSpark}
          pinSpark={handlePinSpark}
          showSearchBar={false}
        />
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{
            display: { md: "none" },
            p: "16px",
            fontSize: 24,
            fontWeight: 500,
            color: "onSurface",
            opacity: 0.8,
          }}
        >
          Inputs
        </Typography>

        {windowWidth < 960 && (
          <Button
            sx={{
              m: "16px",
              bgcolor: "transparent",
              color: "primary.main",
              fontSize: 14,
              border: `1px solid ${alpha(palette.primary.main, 0.3)}`,
              "&:hover": {
                bgcolor: "action.hover",
                color: "primary.main",
              },
            }}
            startIcon={<AddOutlined />}
            variant={"outlined"}
            onClick={() => {
              if (resetNewExecution) {
                resetNewExecution();
              }
              if (setMobileTab) {
                setMobileTab(1);
              }
              if (setActiveTab) {
                setActiveTab(1);
              }
            }}
          >
            Spark
          </Button>
        )}
      </Box>

      <Stack
        gap={1}
        sx={{
          p: "16px",
        }}
      >
        <Stack direction={"row"} justifyContent={"space-between"} py={"8px"}>
          <Button
            sx={textButtonStyle}
            startIcon={<AutoFixHigh />}
            endIcon={
              Boolean(presetsAnchor) ? <ArrowDropUp /> : <ArrowDropDown />
            }
            variant={"text"}
            onClick={(e) => setPresetsAnchor(e.currentTarget)}
          >
            Presets
          </Button>
          {false && (
            <Button
              sx={textButtonStyle}
              startIcon={<Close />}
              variant={"text"}
              disabled={!allowGenerate}
              onClick={() => {
                setResInputs([]);
              }}
            >
              Clear
            </Button>
          )}
          <Popper
            open={Boolean(presetsAnchor)}
            anchorEl={presetsAnchor}
            transition
            disablePortal
            sx={{ zIndex: 9 }}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{ transformOrigin: "center top" }}
              >
                <Paper
                  sx={{
                    bgcolor: "surface.1",
                    border: "1px solid #E3E3E3",
                    borderRadius: "10px",
                    maxHeight: "30svh",
                    overflow: "auto",
                    overscrollBehavior: "contain",
                  }}
                  elevation={0}
                >
                  <ClickAwayListener onClickAway={() => setPresetsAnchor(null)}>
                    <MenuList sx={{ paddingRight: "3rem", width: "100%" }}>
                      {presets.map((preset) => (
                        <MenuItem
                          key={preset.id}
                          sx={{ borderTop: "1px solid #E3E3E3" }}
                          onClick={() => setPresetsAnchor(null)}
                        >
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: 14,
                              ml: "1rem",
                              color: "onSurface",
                            }}
                          >
                            {preset.name}
                          </Typography>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Stack>

        <Box
          sx={{
            flex: 1,
            bgcolor: "surface.2",
            borderRadius: "16px",
            position: "relative",
          }}
        >
          {!shownInputs || !shownParams ? (
            <Box
              sx={{
                width: "100%",
                mt: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress size={20} />
            </Box>
          ) : shownInputs.length === 0 && shownParams.length === 0 ? (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                textAlign: "center",
                color: "onSurface",
                fontSize: 14,
              }}
            >
              No parameters available for this template
            </Box>
          ) : (
            <React.Fragment>
              {shownInputs.map((input, i) => (
                <GeneratorInput
                  key={i}
                  promptId={input.prompt}
                  inputs={[input]}
                  resInputs={resInputs}
                  setResInputs={setResInputs}
                  errors={errors}
                />
              ))}
              {shownParams.map((param, i) => (
                <GeneratorParam
                  key={i}
                  params={[param.param]}
                  promptId={param.prompt}
                  resOverrides={resOverrides}
                  setResOverrides={setResOverrides}
                />
              ))}
            </React.Fragment>
          )}
        </Box>

        <Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
            m={"20px 10px"}
          >
            <Button
              variant={"contained"}
              startIcon={token ? <LogoApp width={18} color="white" /> : null}
              sx={{
                flex: 1,
                p: "10px 25px",
                fontWeight: 500,
                borderColor: "primary.main",
                borderRadius: "999px",
                bgcolor: "primary.main",
                color: "onPrimary",
                whiteSpace: "pre-line",
                ":hover": {
                  bgcolor: "transparent",
                  color: "primary.main",
                },
                ":disabled": {
                  bgcolor: "surface.4",
                  color: "onTertiary",
                  borderColor: "transparent",
                },
              }}
              disabled={!token ? false : !allowGenerate || isGenerating}
              onClick={handlePostPrompt}
            >
              {token ? (
                <React.Fragment>
                  <Typography ml={2} color={"inherit"}>
                    Start
                  </Typography>
                  <Typography ml={"auto"} color={"inherit"}>
                    ~360s
                  </Typography>
                </React.Fragment>
              ) : (
                <Typography ml={2} color={"inherit"}>
                  Sign in or Create an account
                </Typography>
              )}
            </Button>
            <Replay
              sx={{
                width: "16px",
                height: "16px",
                p: "16px",
                color: "onSurface",
                visibility: isGenerating ? "visible" : "hidden",
              }}
            />
          </Stack>
        </Stack>

        {Object.keys(errors).length > 0 && (
          <Typography
            color={"error.main"}
            sx={{
              textAlign: "center",
            }}
          >
            Fill all the inputs
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            color: "grey.600",
            fontSize: 14,
            fontWeight: 400,
            my: "20px",
          }}
        >
          Repeat last:
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Box style={keysStyle} sx={{ fontSize: 12, fontWeight: 600 }}>
              SHIFT
            </Box>
            +
            <Box style={keysStyle} sx={{ fontSize: 12, fontWeight: 600 }}>
              R
            </Box>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

const textButtonStyle = {
  bgcolor: "surface.3",
  color: "onSurface",
  fontSize: 13,
  fontWeight: 500,
  p: "5px 12px",
  svg: {
    fontSize: "16px !important",
  },
};
const keysStyle = {
  padding: "2px 4px",
  letterSpacing: "1px",
  border: "1px solid #E1E2EC",
  borderRadius: "4px",
  boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.12)",
};
