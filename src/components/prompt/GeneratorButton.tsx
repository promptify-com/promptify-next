import { useEffect, useState } from "react";
import { Typography, Button, CircularProgress } from "@mui/material";
import { PromptParams, ResInputs, ResOverrides, ResPrompt } from "@/core/api/dto/prompts";
import { IPromptInput, PromptLiveResponse } from "@/common/types/prompt";
import useToken from "@/hooks/useToken";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { getInputsFromString } from "@/common/helpers/getInputsFromString";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { PlayCircle } from "@mui/icons-material";
import Storage from "@/common/storage";

import { setGeneratingStatus, updateExecutionData } from "@/core/store/templatesSlice";

interface GeneratorButtonProps {
  templateData: Templates;
  selectedExecution: TemplatesExecutions | null;
  setGeneratedExecution: (data: PromptLiveResponse) => void;
  onError: (errMsg: string) => void;
}

interface Input extends IPromptInput {
  prompt: number;
}
interface Param {
  prompt: number;
  param: PromptParams;
}

export const GeneratorButton: React.FC<GeneratorButtonProps> = ({
  templateData,
  selectedExecution,
  setGeneratedExecution,
  onError,
}) => {
  const token = useToken();
  const dispatch = useAppDispatch();
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const [generatingResponse, setGeneratingResponse] = useState<PromptLiveResponse | null>(null);
  const [newExecutionId, setNewExecutionId] = useState<number | null>(null);
  const [resPrompts, setResPrompts] = useState<ResPrompt[]>([]);
  const [lastExecution, setLastExecution] = useState<ResPrompt[] | null>(null);
  const [nodeInputs, setNodeInputs] = useState<ResInputs[]>([]);
  const [nodeParams, setNodeParams] = useState<ResOverrides[]>([]);
  const [shownInputs, setShownInputs] = useState<Input[] | null>(null);
  const [shownParams, setShownParams] = useState<Param[] | null>(null);

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

  const validateAndGenerateExecution = () => {
    dispatch(setGeneratingStatus(true));
    generateExecution(resPrompts);
  };

  const generateExecution = (executionData: ResPrompt[]) => {
    setLastExecution([...executionData]);

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

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // prevent trigger if typing inside input
      const target = e.target as HTMLElement;
      if (!["INPUT", "TEXTAREA"].includes(target.tagName)) {
        if (e.shiftKey && e.code === "KeyR" && lastExecution) {
          generateExecution(lastExecution);
        }
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [lastExecution]);

  const prompts = templateData.prompts;
  const promptHasContent = prompts.some(prompt => prompt.content);
  const nodeInputsRequired = nodeInputs.some(input =>
    Object.values(input.inputs).some(input => input.required === true),
  );
  const hasContentAndNodeRequired = promptHasContent && nodeInputsRequired;

  const isButtonDisabled = isGenerating ? true : !hasContentAndNodeRequired;

  return (
    <Button
      onClick={validateAndGenerateExecution}
      startIcon={
        isGenerating ? (
          <CircularProgress size={16} />
        ) : (
          <PlayCircle
            sx={{ color: "onPrimary" }}
            fontSize={"small"}
          />
        )
      }
      sx={{
        bgcolor: "primary.main",
        borderColor: "primary.main",
        borderRadius: "999px",
        height: "2px",
        p: "15px",
        ml: "0px",
        color: "15px",
        fontWeight: 500,
        ":hover": {
          opacity: 0.9,
          bgcolor: "primary.main",
          color: "onPrimary",
        },
      }}
      variant="contained"
      disabled={isButtonDisabled}
    >
      {isGenerating ? (
        <Typography> Generation in progress...</Typography>
      ) : (
        <>
          <Typography sx={{ color: "inherit", fontSize: 15, lineHeight: "22px" }}>Generate</Typography>
          <Typography sx={{ ml: 1.5, color: "inherit", fontSize: 12 }}>~360s</Typography>
        </>
      )}
    </Button>
  );
};
