import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { AddOutlined, Replay } from "@mui/icons-material";
import {
  PromptParams,
  ResInputs,
  ResOverrides,
  ResPrompt,
} from "@/core/api/dto/prompts";
import { PromptLiveResponse } from "@/common/types/prompt";
import useToken from "@/hooks/useToken";
import { useAppDispatch } from "@/hooks/useStore";
import { templatesApi } from "@/core/api/templates";
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
import { DisplayHeader } from "./DisplayHeader";
import { pinSpark, unpinSpark } from "@/hooks/api/executions";
import SparkForm from "./SparkForm";

interface GeneratorFormProps {
  templateData: Templates;
  setNewExecutionData: (data: PromptLiveResponse) => void;
  isGenerating: boolean;
  setIsGenerating: (status: boolean) => void;
  onError: (errMsg: string) => void;
  exit: () => void;
  selectedExecution: TemplatesExecutions | null;
  setMobileTab: (value: number) => void;
  setActiveTab: (value: number) => void;
  onNewSpark: () => void;
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
  required: boolean;
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
  selectedExecution,
  setMobileTab,
  setActiveTab,
  onNewSpark,
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
  const [nodeInputs, setNodeInputs] = useState<ResInputs[]>([]);
  const [nodeParams, setNodeParams] = useState<ResOverrides[]>([]);
  const [errors, setErrors] = useState<InputsErrors>({});
  const [shownInputs, setShownInputs] = useState<Input[] | null>(null);
  const [shownParams, setShownParams] = useState<Param[] | null>(null);
  const [sparkFormOpen, setSparkFormOpen] = useState<boolean>(false);

  const setDefaultResPrompts = () => {
    const tempArr: ResPrompt[] = [...resPrompts];

    templateData.prompts.forEach((prompt) => {
      const tempObj: ResPrompt = {} as ResPrompt;

      tempObj.prompt = prompt.id;
      tempObj.contextual_overrides = [];
      tempObj.prompt_params = {};
      tempArr.push(tempObj);
    });
    setResPrompts([...tempArr]);
  };

  // Set default inputs values from selected execution parameters
  // Fetched execution also provides old / no more existed inputs values, needed to filter depending on shown inputs
  useEffect(() => {
    if (selectedExecution?.parameters && shownInputs) {
      const fetchedInputs = Object.values(selectedExecution.parameters).map(
        (param) => {
          let filteredFields = {} as ResInputs;
          for (const input of shownInputs) {
            if (param[input.name]) {
              filteredFields = {
                id: input.prompt,
                inputs: param || {},
              };
            }
          }

          return filteredFields;
        }
      );
      setNodeInputs(fetchedInputs);
    } else {
      setNodeInputs([]);
    }
  }, [selectedExecution, shownInputs]);

  useEffect(() => {
    if (selectedExecution?.contextual_overrides) {
      const overrides = Object.entries(selectedExecution.contextual_overrides)
        .map(([promptId, values]) => ({
          id: +promptId,
          contextual_overrides: values,
        }))
        .filter((override) => override.contextual_overrides.length > 0);
      setNodeParams(overrides);
    }
  }, [selectedExecution]);

  const changeResPrompts = () => {
    const tempArr = [...resPrompts];

    if (nodeInputs.length > 0) {
      tempArr.forEach((prompt, index) => {
        const obj = nodeInputs.find((inputs) => inputs.id === prompt.prompt);
        if (obj) {
          tempArr[index].prompt_params = obj.inputs;
        }
      });
    }

    if (nodeParams.length > 0) {
      tempArr.forEach((prompt, index) => {
        const obj = nodeParams.find(
          (overrides) => overrides.id === prompt.prompt
        );
        if (obj) {
          tempArr[index].contextual_overrides = obj.contextual_overrides;
        }
      });
    }

    setResPrompts([...tempArr]);
  };

  // Handling the case of no spark selected. Wait for new spark to be created/selected, then generate
  useEffect(() => {
    if (isGenerating && selectedSpark) {
      validateAndGenerateExecution();
    }
  }, [selectedSpark]);

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
    const unFilledInputs = isInputsFilled();

    if (!token) {
      setErrors({});
      return true;
    }

    if (Object.keys(unFilledInputs).length > 0) {
      setErrors({ ...unFilledInputs });
      return false;
    }

    setErrors({});
    return true;
  };

  const validateAndGenerateExecution = () => {
    if (!token) {
      savePathURL(window.location.pathname);
      return router.push("/signin");
    }

    if (!validateInputs()) return;

    setIsGenerating(true);

    setMobileTab(2);
    setActiveTab(2);

    if (selectedSpark?.id) {
      generateExecution(resPrompts);
    } else {
      setSparkFormOpen(true);
    }
  };

  const generateExecution = (executionData: ResPrompt[]) => {
    setLastExecution(JSON.parse(JSON.stringify(executionData)));

    if (windowWidth < 900) setTimeout(() => exit(), 2000);

    if (!selectedSpark?.id) {
      setErrors({});
      return;
    }

    let tempData: any[] = [];
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/meta/templates/${templateData.id}/execute/`;
    url += `?spark_id=${selectedSpark.id}`;

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
              onError(
                message
                  ? message.replace("[ERROR]", "")
                  : "Something went wrong during the execution of this prompt"
              );
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
  }, [nodeInputs, nodeParams]);

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
              templatesApi.endpoints.getPromptParams.initiate(prompt.id)
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

  const handlePinSpark = async () => {
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

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [handleKeyboard]);

  const filledForm = nodeInputs
    .filter((nodeInput) => nodeInput.inputs)
    .every((nodeInput) =>
      Object.values(nodeInput.inputs).every((input) => input)
    );

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
            onClick={onNewSpark}
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
                  resInputs={nodeInputs}
                  setResInputs={setNodeInputs}
                  errors={errors}
                />
              ))}
              {shownParams.map((param, i) => (
                <GeneratorParam
                  key={i}
                  params={[param.param]}
                  promptId={param.prompt}
                  resOverrides={nodeParams}
                  setResOverrides={setNodeParams}
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
              disabled={!token ? false : isGenerating ? true : !filledForm}
              onClick={validateAndGenerateExecution}
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

      <SparkForm
        type="new"
        isOpen={sparkFormOpen}
        close={() => setSparkFormOpen(false)}
        templateId={templateData?.id}
        onSparkCreated={(spark) => {
          // No Spark selected case, useEffect [selectedSpark] at the top will handle generating new execution after Spark is selected
          setSelectedSpark(spark);
        }}
      />
    </Box>
  );
};

const keysStyle = {
  padding: "2px 4px",
  letterSpacing: "1px",
  border: "1px solid #E1E2EC",
  borderRadius: "4px",
  boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.12)",
};
