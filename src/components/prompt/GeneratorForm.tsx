import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Stack, Typography, alpha, useTheme } from "@mui/material";
import { PromptParams, ResInputs, ResOverrides, ResPrompt } from "@/core/api/dto/prompts";
import { IPromptInput, PromptLiveResponse } from "@/common/types/prompt";
import useToken from "@/hooks/useToken";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { templatesApi } from "@/core/api/templates";
import { GeneratorInput } from "./GeneratorInput";
import { GeneratorParam } from "./GeneratorParam";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { getInputsFromString } from "@/common/helpers/getInputsFromString";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { LogoApp } from "@/assets/icons/LogoApp";
import { useRouter } from "next/router";
import { AllInclusive, Close, InfoOutlined } from "@mui/icons-material";
import TabsAndFormPlaceholder from "@/components/placeholders/TabsAndFormPlaceholder";
import Storage from "@/common/storage";
import { setGeneratingStatus, updateExecutionData } from "@/core/store/templatesSlice";
import { useUploadFileMutation } from "@/core/api/uploadFile";

interface GeneratorFormProps {
  templateData: Templates;
  selectedExecution: TemplatesExecutions | null;
  setGeneratedExecution: (data: PromptLiveResponse) => void;
  onError: (errMsg: string) => void;
}

export interface InputsErrors {
  [key: string]: number | boolean;
}
interface Input extends IPromptInput {
  prompt: number;
}
interface Param {
  prompt: number;
  param: PromptParams;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  templateData,
  selectedExecution,
  setGeneratedExecution,
  onError,
}) => {
  const token = useToken();
  const { palette } = useTheme();
  const dispatch = useAppDispatch();
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const router = useRouter();
  const [generatingResponse, setGeneratingResponse] = useState<PromptLiveResponse | null>(null);
  const [newExecutionId, setNewExecutionId] = useState<number | null>(null);
  const [resPrompts, setResPrompts] = useState<ResPrompt[]>([]);
  const [lastExecution, setLastExecution] = useState<ResPrompt[] | null>(null);
  const [nodeInputs, setNodeInputs] = useState<ResInputs[]>([]);
  const [nodeParams, setNodeParams] = useState<ResOverrides[]>([]);
  const [errors, setErrors] = useState<InputsErrors>({});
  const [shownInputs, setShownInputs] = useState<Input[] | null>(null);
  const [shownParams, setShownParams] = useState<Param[] | null>(null);

  const [uploadFile] = useUploadFileMutation();

  const setDefaultResPrompts = () => {
    const _initPromptsData: ResPrompt[] = [...resPrompts];

    templateData.prompts?.forEach(prompt => {
      _initPromptsData.push({
        prompt: prompt.id,
        contextual_overrides: [],
        prompt_params: {},
      });
    });

    setResPrompts(_initPromptsData);
    dispatch(updateExecutionData(JSON.stringify(_initPromptsData)));
  };

  // Set default inputs values from selected execution parameters
  // Fetched execution also provides old / no more existed inputs values, needed to filter depending on shown inputs
  useEffect(() => {
    if (shownInputs) {
      const updatedInputs = new Map<number, ResInputs>();

      const storedData = Storage.get("nodeInputsParamsData");
      if (storedData) {
        setNodeInputs(storedData.inputs);
        setNodeParams(storedData.params);
        Storage.remove("nodeInputsParamsData");
        return;
      }

      shownInputs.forEach(input => {
        const inputName = input.name;

        if (selectedExecution?.parameters) {
          const inputValue = Object.values(selectedExecution.parameters).find(val => val[inputName]);
          updatedInputs.set(input.prompt, {
            id: input.prompt,
            inputs: {
              ...(updatedInputs.get(input.prompt)?.inputs || {}),
              [inputName]: {
                value: inputValue ? inputValue[inputName] : "",
                required: input.required,
              },
            },
          });
        } else {
          updatedInputs.set(input.prompt, {
            id: input.prompt,
            inputs: {
              ...(updatedInputs.get(input.prompt)?.inputs || {}),
              [inputName]: {
                value: "",
                required: input.required,
              },
            },
          });
        }
      });

      setNodeInputs(Array.from(updatedInputs.values()));
    } else {
      setNodeInputs([]);
    }
  }, [selectedExecution, shownInputs]);

  useEffect(() => {
    if (selectedExecution?.contextual_overrides) {
      const nodeParams = Object.entries(selectedExecution.contextual_overrides)
        .map(([promptId, values]) => ({
          id: +promptId,
          contextual_overrides: values,
        }))
        .filter(override => override.contextual_overrides.length > 0);

      setNodeParams(nodeParams);
    }
  }, [selectedExecution]);

  const changeResPrompts = () => {
    const _promptsData = [...resPrompts];

    if (nodeInputs.length > 0) {
      _promptsData.forEach((prompt, index) => {
        const obj = nodeInputs.find(inputs => inputs.id === prompt.prompt);
        if (obj) {
          // Extract inputs values from nodeInputs item and put it as { inputName: inputValue }
          const values = Object.fromEntries(Object.entries(obj.inputs).map(([key, value]) => [key, value.value]));
          _promptsData[index].prompt_params = values;
        }
      });
    }

    if (nodeParams.length > 0) {
      _promptsData.forEach((prompt, index) => {
        const obj = nodeParams.find(overrides => overrides.id === prompt.prompt);
        if (obj) {
          _promptsData[index].contextual_overrides = obj.contextual_overrides;
        }
      });
    }

    setResPrompts(_promptsData);
    dispatch(updateExecutionData(JSON.stringify(_promptsData)));
  };

  const isInputsFilled = () => {
    const tempErrors: InputsErrors = {};

    templateData.prompts.forEach(prompt => {
      const inputs = getInputsFromString(prompt.content);

      inputs.forEach(input => {
        if (!input.required) return;

        const checkParams = resPrompts.find(
          resPrompt => resPrompt.prompt_params && resPrompt.prompt_params[input.name],
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

  const validateAndGenerateExecution = async () => {
    if (!token) {
      if (allowReset) {
        const nodeInputsAndParams = { inputs: nodeInputs, params: nodeParams };
        Storage.set("nodeInputsParamsData", JSON.stringify(nodeInputsAndParams));
      }
      return router.push("/signin");
    }

    if (!validateInputs()) return;

    const hasTypeFile = shownInputs?.some(item => item.type === "file");

    if (hasTypeFile) {
      let filePath = null;
      let keyName: string = "";

      for (const key in resPrompts[0]?.prompt_params) {
        if (Object.prototype.hasOwnProperty.call(resPrompts[0]?.prompt_params, key)) {
          const value = resPrompts[0]?.prompt_params[key];
          if (value instanceof File) {
            filePath = value;
            keyName = key;
            break;
          }
        }
      }

      try {
        if (filePath) {
          const responseData = await uploadFile(filePath);
          if (responseData) {
            const { file_url } = responseData?.data;
            const newResPrompts = resPrompts.map(item => {
              if (item.prompt_params) {
                const updatedPromptParams = {
                  ...item.prompt_params,
                  [keyName]: file_url,
                };
                return {
                  ...item,
                  prompt_params: updatedPromptParams,
                };
              }
              return item;
            });
            dispatch(setGeneratingStatus(true));
            generateExecution(newResPrompts);
          }
        }
      } catch (_) {}
    } else {
      dispatch(setGeneratingStatus(true));
      generateExecution(resPrompts);
    }
  };

  const generateExecution = (executionData: ResPrompt[]) => {
    setLastExecution(JSON.parse(JSON.stringify(executionData)));

    let tempData: any[] = [];
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/meta/templates/${templateData.id}/execute/`;

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
          dispatch(setGeneratingStatus(true));
          setGeneratingResponse({ created_at: new Date(), data: [] });
        } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
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
              const activePrompt = tempArr.findIndex(template => template.prompt === +prompt);

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
              setGeneratingResponse(prevState => ({
                ...prevState,
                created_at: prevState?.created_at || new Date(),
                data: tempArr,
              }));
            }
          } else {
            const tempArr = [...tempData];
            const activePrompt = tempArr.findIndex(template => template.prompt === +prompt);

            if (message === "[C OMPLETED]" || message === "[COMPLETED]") {
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
                message ? message.replace("[ERROR]", "") : "Something went wrong during the execution of this prompt",
              );
            }

            tempData = [...tempArr];
            setGeneratingResponse(prevState => ({
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
        dispatch(setGeneratingStatus(false));
        onError("Something went wrong. Please try again later");
        throw err; // rethrow to stop the operation
      },
      onclose() {
        dispatch(setGeneratingStatus(false));
      },
    });
  };

  useEffect(() => {
    if (newExecutionId) {
      setGeneratingResponse(prevState => ({
        id: newExecutionId,
        created_at: prevState?.created_at || new Date(),
        data: prevState?.data || [],
      }));
    }
  }, [newExecutionId]);

  useEffect(() => {
    if (generatingResponse) setGeneratedExecution(generatingResponse);
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

    templateData.prompts?.forEach(prompt => {
      const inputs = getInputsFromString(prompt.content);

      inputs.forEach(input => {
        shownInputs.set(input.name, { ...input, prompt: prompt.id });
      });

      prompt.parameters
        .filter(param => param.is_visible)
        .forEach(param => {
          shownParams.set(param.parameter.id, { param, prompt: prompt.id });
        });
    });

    setShownInputs(Array.from(shownInputs.values()));
    setShownParams(Array.from(shownParams.values()));
  };

  const resetForm = () => {
    const resetedNodeInputs = nodeInputs.map(nodeInput => {
      const updatedInputs = Object.keys(nodeInput.inputs).reduce((inputs: ResInputs["inputs"], inputKey) => {
        inputs[inputKey] = {
          ...nodeInput.inputs[inputKey],
          value: "",
        };
        return inputs;
      }, {});

      return {
        ...nodeInput,
        inputs: updatedInputs,
      };
    });

    setNodeInputs(resetedNodeInputs);
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

  const filledForm = nodeInputs.every(nodeInput =>
    Object.values(nodeInput.inputs)
      .filter(input => input.required)
      .every(input => input.value),
  );

  const allowReset = nodeInputs.some(input => Object.values(input.inputs).some(input => input.value));

  return (
    <Stack
      sx={{
        minHeight: { xs: "100%", md: "40svh" },
        bgcolor: "surface.2",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ p: "16px 8px 16px 24px" }}
      >
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 500,
            color: "onSurface",
            opacity: 0.8,
          }}
        >
          Inputs
        </Typography>
        <Button
          disabled={isGenerating}
          variant="text"
          startIcon={<Close />}
          sx={{
            display: allowReset ? "inline-flex" : "none",
            border: `1px solid ${alpha(palette.primary.main, 0.15)}`,
            bgcolor: "surface.1",
            color: "onSurface",
            fontSize: 13,
            fontWeight: 500,
            p: "4px 12px",
            svg: {
              fontSize: "18px !important",
            },
          }}
          onClick={resetForm}
        >
          Reset
        </Button>
      </Stack>

      <Stack
        gap={1}
        sx={{
          flex: 1,
          p: "16px",
          pb: { xs: 0, md: "16px" },
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
            <TabsAndFormPlaceholder form={true} />
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
                  setNodeInputs={setNodeInputs}
                  errors={errors}
                />
              ))}
              {shownParams.map((param, i) => (
                <GeneratorParam
                  key={i}
                  params={[param.param]}
                  promptId={param.prompt}
                  nodeParams={nodeParams}
                  setNodeParams={setNodeParams}
                />
              ))}
            </React.Fragment>
          )}
        </Box>
        <Stack
          sx={{
            position: "sticky",
            bottom: 0,
            m: { xs: "0 -16px -3px", md: "0" },
            bgcolor: { xs: "surface.1", md: "initial" },
            color: { xs: "onSurface", md: "initial" },
            boxShadow: {
              xs: "0px -8px 40px 0px rgba(93, 123, 186, 0.09), 0px -8px 10px 0px rgba(98, 98, 107, 0.03)",
              md: "none",
            },
            borderRadius: "24px 24px 0 0",
            zIndex: 999,
            borderBottom: { xs: `1px solid ${palette.surface[5]}`, md: "none" },
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
            p={"16px 8px 16px 16px"}
          >
            <Button
              variant={"contained"}
              startIcon={
                token && isGenerating ? (
                  <CircularProgress size={16} />
                ) : (
                  token && (
                    <LogoApp
                      width={18}
                      color="white"
                    />
                  )
                )
              }
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
                  bgcolor: "surface.1",
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
                  {isGenerating ? (
                    <Typography>Generation in progress...</Typography>
                  ) : (
                    <>
                      <Typography sx={{ ml: 2, color: "inherit", fontSize: 15 }}>Generate</Typography>
                      <Typography sx={{ display: { md: "none" }, ml: "auto", color: "inherit", fontSize: 12 }}>
                        ~360s
                      </Typography>
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        gap={0.5}
                        sx={{ display: { xs: "none", md: "flex" }, ml: "auto", color: "inherit", fontSize: 12 }}
                      >
                        {templateData.executions_limit === -1 ? (
                          <AllInclusive fontSize="small" />
                        ) : (
                          <>
                            {templateData.executions_limit - templateData.executions_count} of{" "}
                            {templateData.executions_limit} left
                            <InfoOutlined sx={{ fontSize: 16 }} />
                          </>
                        )}
                      </Stack>
                    </>
                  )}
                </React.Fragment>
              ) : (
                <Typography
                  ml={2}
                  color={"inherit"}
                >
                  Sign in or Create an account
                </Typography>
              )}
            </Button>
            <Box
              sx={{
                position: "relative",
                display: { xs: "inline-flex", md: "none" },
              }}
            >
              <CircularProgress
                variant="determinate"
                value={100}
                sx={{ position: "absolute", color: "grey.400" }}
              />
              <CircularProgress
                variant="determinate"
                value={templateData.executions_limit === -1 ? 100 : templateData.executions_count}
              />
              <Box
                sx={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  position: "absolute",
                  width: 26,
                  height: 26,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "primary.main",
                  color: "onPrimary",
                  borderRadius: 99,
                  fontSize: 12,
                }}
              >
                {templateData.executions_limit === -1 ? (
                  <AllInclusive fontSize="small" />
                ) : (
                  templateData.executions_count
                )}
              </Box>
            </Box>
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
            display: { xs: "none", md: "flex" },
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
            <Box
              style={keysStyle}
              sx={{ fontSize: 12, fontWeight: 600 }}
            >
              SHIFT
            </Box>
            +
            <Box
              style={keysStyle}
              sx={{ fontSize: 12, fontWeight: 600 }}
            >
              R
            </Box>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};

const keysStyle = {
  padding: "2px 4px",
  letterSpacing: "1px",
  border: "1px solid #E1E2EC",
  borderRadius: "4px",
  boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.12)",
};
