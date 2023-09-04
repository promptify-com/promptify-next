import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import { PromptParams, ResInputs, ResOverrides, ResPrompt } from "@/core/api/dto/prompts";
import { IPromptInput, PromptLiveResponse } from "@/common/types/prompt";
import useToken from "@/hooks/useToken";
import { useAppDispatch } from "@/hooks/useStore";
import { templatesApi } from "@/core/api/templates";
import { getInputsFromString } from "@/common/helpers/getInputsFromString";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { ChatMode } from "./ChatMode";
import { InputMode } from "./InputMode";

interface GeneratePromptsProps {
  type: "chat" | "input";
  templateData: Templates;
  selectedExecution: TemplatesExecutions | null;
  setGeneratedExecution: (data: PromptLiveResponse) => void;
  isGenerating: boolean;
  setIsGenerating: (status: boolean) => void;
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

export const GeneratePrompts: React.FC<GeneratePromptsProps> = ({
  type,
  templateData,
  selectedExecution,
  setGeneratedExecution,
  isGenerating,
  setIsGenerating,
  onError,
}) => {
  const token = useToken();
  const dispatch = useAppDispatch();
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

  const setDefaultResPrompts = () => {
    const tempArr: ResPrompt[] = [...resPrompts];

    templateData.prompts.forEach(prompt => {
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
    if (shownInputs) {
      const updatedInputs = new Map<number, ResInputs>();

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
      const overrides = Object.entries(selectedExecution.contextual_overrides)
        .map(([promptId, values]) => ({
          id: +promptId,
          contextual_overrides: values,
        }))
        .filter(override => override.contextual_overrides.length > 0);
      setNodeParams(overrides);
    }
  }, [selectedExecution]);

  const changeResPrompts = () => {
    const tempArr = [...resPrompts];

    if (nodeInputs.length > 0) {
      tempArr.forEach((prompt, index) => {
        const obj = nodeInputs.find(inputs => inputs.id === prompt.prompt);
        if (obj) {
          // Extract inputs values from nodeInputs item and put it as { inputName: inputValue }
          const values = Object.fromEntries(Object.entries(obj.inputs).map(([key, value]) => [key, value.value]));
          tempArr[index].prompt_params = values;
        }
      });
    }

    if (nodeParams.length > 0) {
      tempArr.forEach((prompt, index) => {
        const obj = nodeParams.find(overrides => overrides.id === prompt.prompt);
        if (obj) {
          tempArr[index].contextual_overrides = obj.contextual_overrides;
        }
      });
    }

    setResPrompts([...tempArr]);
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

  const validateAndGenerateExecution = () => {
    if (!token) {
      return router.push("/signin");
    }

    if (!validateInputs()) return;

    setIsGenerating(true);

    generateExecution(resPrompts);
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
          setIsGenerating(true);
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
    await Promise.all(
      [...templateData.prompts]
        .sort((a, b) => a.order - b.order)
        .map(async prompt => {
          const inputs = getInputsFromString(prompt.content);
          inputs.forEach(input => {
            shownInputs.set(input.name, { ...input, prompt: prompt.id });
          });

          const params = (await dispatch(templatesApi.endpoints.getPromptParams.initiate(prompt.id))).data;
          params
            ?.filter(param => param.is_visible)
            .forEach(param => {
              shownParams.set(param.parameter.id, { param, prompt: prompt.id });
            });
        }),
    );
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
    <>
      {type === "chat" && (
        <ChatMode
          inputs={shownInputs}
          params={shownParams}
          nodeInputs={nodeInputs}
          generate={validateAndGenerateExecution}
          isGenerating={isGenerating}
          isFormFilled={filledForm}
          templateData={templateData}
          onReset={resetForm}
          allowReset={allowReset}
          errors={errors}
        />
      )}

      {type === "input" && (
        <InputMode
          inputs={shownInputs}
          params={shownParams}
          nodeInputs={nodeInputs}
          setNodeInputs={setNodeInputs}
          nodeParams={nodeParams}
          setNodeParams={setNodeParams}
          generate={validateAndGenerateExecution}
          isGenerating={isGenerating}
          isFormFilled={filledForm}
          templateData={templateData}
          onReset={resetForm}
          allowReset={allowReset}
          errors={errors}
        />
      )}
    </>
  );
};
