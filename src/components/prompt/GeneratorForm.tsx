import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Stack, Typography, alpha, useTheme } from "@mui/material";
import { PromptParams, ResInputs, ResOverrides, ResPrompt } from "@/core/api/dto/prompts";
import { IPromptInput, PromptLiveResponse } from "@/common/types/prompt";
import useToken from "@/hooks/useToken";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { GeneratorInput } from "./GeneratorInput";
import { GeneratorParam } from "./GeneratorParam";
import { getInputsFromString } from "@/common/helpers/getInputsFromString";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { LogoApp } from "@/assets/icons/LogoApp";
import { useRouter } from "next/router";
import { AllInclusive, Close, InfoOutlined } from "@mui/icons-material";
import TabsAndFormPlaceholder from "@/components/placeholders/TabsAndFormPlaceholder";
import Storage from "@/common/storage";
import { setGeneratingStatus, updateExecutionData } from "@/core/store/templatesSlice";
import ClientOnly from "../base/ClientOnly";
import useGenerateExecution from "@/hooks/useGenerateExecution";
import { useUploadFileMutation } from "@/core/api/uploadFile";
import { uploadFileHelper, FileReponse, SelectedFile } from "@/common/helpers/uploadFileHelper";

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

const deleteFileInputIfEmpty = (prompts: ResPrompt[], inputs: Input[]) => {
  for (const prompt of prompts) {
    const prompt_params = prompt.prompt_params;
    for (const key in prompt_params) {
      const showInputItem = inputs?.find(inputItem => inputItem.prompt === prompt.prompt && inputItem.name === key);
      if (showInputItem && showInputItem.type === "file" && prompt_params[key] === "") {
        delete prompt_params[key];
      }
    }
  }
};

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

  const [resPrompts, setResPrompts] = useState<ResPrompt[]>([]);
  const [nodeInputs, setNodeInputs] = useState<ResInputs[]>([]);
  const [nodeParams, setNodeParams] = useState<ResOverrides[]>([]);
  const [errors, setErrors] = useState<InputsErrors>({});
  const [shownInputs, setShownInputs] = useState<Input[] | null>(null);
  const [shownParams, setShownParams] = useState<Param[] | null>(null);

  const { generateExecution, generatingResponse, lastExecution } = useGenerateExecution(templateData?.id, onError);

  const answeredInputs = useAppSelector(state => state.template.answeredInputs);

  useEffect(() => {
    if (answeredInputs && answeredInputs.length > 0) {
      setNodeInputs(prevState => {
        const newState = [...prevState];

        answeredInputs.forEach(input => {
          const targetIndex = newState.findIndex(item => item.id === input.promptId);
          if (targetIndex !== -1 && newState[targetIndex].inputs[input.inputName]) {
            newState[targetIndex].inputs[input.inputName].value = input.value;
          }
        });

        return newState;
      });
    }
  }, [answeredInputs]);

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

  const handleFileUploads = async () => {
    const fileData = resPrompts.reduce((acc: SelectedFile[], resPrompt) => {
      const promptId = resPrompt.prompt;
      const fileDataEntries = Object.entries(resPrompt.prompt_params)
        .filter(([_, value]) => value instanceof File)
        .map(([key, file]) => ({ key, promptId, file: file as File }));

      return acc.concat(fileDataEntries);
    }, []);

    const results = await Promise.allSettled(fileData.map(fileObject => uploadFileHelper(uploadFile, fileObject)));

    const validNodeInputs: ResInputs[] = [];

    results.forEach(result => {
      if (result.status === "fulfilled" && result.value) {
        const { key, promptId, file } = result.value;
        const currentKey = key as keyof SelectedFile;
        const prompt = nodeInputs.find(inputs => inputs.id === promptId);

        if (prompt) {
          prompt.inputs[currentKey] = {
            ...prompt.inputs[currentKey],
            value: file || "",
          };
          setErrors({ ...errors, [currentKey]: file === undefined });
          validNodeInputs.push(prompt);
        }

        const matchingData = resPrompts.find(data => data.prompt === promptId);

        if (matchingData) {
          matchingData.prompt_params[currentKey] = file as string | number;
        }
      }
    });
    setNodeInputs(validNodeInputs);
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
      deleteFileInputIfEmpty(resPrompts, shownInputs!);
      await handleFileUploads();
    }
    setErrors({});
    dispatch(setGeneratingStatus(true));
    generateExecution(resPrompts);
  };

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
  const promptHasContent = templateData.prompts?.some(prompt => prompt.content);
  const hasContentOrFormFilled = !filledForm ? true : promptHasContent ? false : true;
  const isButtonDisabled = token ? (isGenerating ? true : hasContentOrFormFilled) : true;

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
                  nodeInputs={nodeInputs}
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
            <ClientOnly>
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
                disabled={isButtonDisabled}
                onClick={validateAndGenerateExecution}
              >
                {token ? (
                  <>
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
                  </>
                ) : (
                  <Typography
                    ml={2}
                    color={"inherit"}
                  >
                    Sign in or Create an account
                  </Typography>
                )}
              </Button>
            </ClientOnly>
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
