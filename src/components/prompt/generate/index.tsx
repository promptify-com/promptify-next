import { useState, useMemo, memo, useEffect, useRef } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { LogoApp } from "@/assets/icons/LogoApp";
import { useAppSelector, useAppDispatch } from "@/hooks/useStore";
import useToken from "@/hooks/useToken";
import { ChatInterface } from "./ChatInterface";
import { ChatInput } from "./ChatInput";
import type { Templates } from "@/core/api/dto/templates";
import type { IPromptInput, PromptLiveResponse } from "@/common/types/prompt";
import type { PromptParams, ResOverrides, ResPrompt } from "@/core/api/dto/prompts";
import type { IAnswer, IMessage, VaryValidatorResponse } from "@/common/types/chat";
import { setAccordionChatMode, setGeneratingStatus, updateExecutionData } from "@/core/store/templatesSlice";
import { executionsApi, useStopExecutionMutation } from "@/core/api/executions";
import { vary } from "@/common/helpers/varyValidator";
import { parseMessageData } from "@/common/helpers/parseMessageData";
import { useUploadFileMutation } from "@/core/api/uploadFile";
import { uploadFileHelper } from "@/common/helpers/uploadFileHelper";
import { setGeneratedExecution, setSelectedExecution } from "@/core/store/executionsSlice";
import useChatBox from "@/hooks/useChatBox";
import { randomId } from "@/common/helpers";
import { getExecutionById } from "@/hooks/api/executions";

interface Props {
  onError: (errMsg: string) => void;
  template: Templates;
  questionPrefixContent: string;
}

const GeneratorChat: React.FC<Props> = ({ onError, template, questionPrefixContent }) => {
  const token = useToken();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [stopExecution] = useStopExecutionMutation();
  const [uploadFile] = useUploadFileMutation();

  const currentUser = useAppSelector(state => state.user.currentUser);
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const isSidebarExpanded = useAppSelector(state => state.template.isSidebarExpanded);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const AccordionChatMode = useAppSelector(state => state.template.accordionChatMode);

  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);
  const [newExecutionId, setNewExecutionId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [paramsValues, setParamsValues] = useState<ResOverrides[]>([]);
  const [queuedMessages, setQueuedMessages] = useState<IMessage[]>([]);
  const [isSimulationStreaming, setIsSimulationStreaming] = useState(false);
  const [disableChatInput, setDisableChatInput] = useState(false);
  const [generatingResponse, setGeneratingResponse] = useState<PromptLiveResponse>({
    created_at: new Date(),
    data: [],
  });

  const { preparePromptsData, prepareAndRemoveDuplicateInputs } = useChatBox();

  const abortController = useRef(new AbortController());
  const uploadedFiles = useRef(new Map<string, string>());

  const addToQueuedMessages = (messages: IMessage[]) => {
    setQueuedMessages(messages);

    setIsSimulationStreaming(true);
  };

  const createdAt = new Date();

  const initialMessages = ({ inputs, startOver = false }: { inputs: IPromptInput[]; startOver?: boolean }) => {
    const welcomeMessage: IMessage[] = [];
    const prefixedContent =
      questionPrefixContent ?? `Hi, ${currentUser?.first_name ?? currentUser?.username ?? "There"}! Ready to work on`;

    if (!startOver) {
      let allQuestions = inputs.map(input => input.question);

      welcomeMessage.push({
        id: randomId(),
        text: `${prefixedContent} ${template?.title} ? ${allQuestions.join(" ")}`,
        type: "text",
        createdAt: createdAt,
        fromUser: false,
      });
    }

    addToQueuedMessages([
      {
        id: randomId(),
        text: "This is a list of information we need to execute this template:",
        type: "form",
        createdAt: createdAt,
        fromUser: false,
        noHeader: true,
      },
    ]);

    setMessages(welcomeMessage);
    setAnswers([]);
    setShowGenerateButton(false);
  };
  const dispatchNewExecutionData = (answers: IAnswer[], inputs: IPromptInput[]) => {
    const promptsData: Record<number, ResPrompt> = {};

    inputs.forEach(_input => {
      const _promptId = _input.prompt!;

      if (promptsData[_promptId]) {
        promptsData[_promptId].prompt_params = { ...promptsData[_promptId].prompt_params, [_input.name]: "" };
      } else {
        promptsData[_promptId] = {
          prompt: _promptId,
          contextual_overrides: [],
          prompt_params: { [_input.name]: "" },
        };
      }
    });

    answers.forEach(_answer => {
      promptsData[_answer.prompt].prompt_params = {
        ...promptsData[_answer.prompt].prompt_params,
        [_answer.inputName]: _answer.answer,
      };
    });

    dispatch(updateExecutionData(JSON.stringify(Object.values(promptsData))));
  };
  const [_inputs, _params, promptHasContent]: [IPromptInput[], PromptParams[], Boolean] = useMemo(() => {
    if (!template) {
      return [[], [], false];
    }

    let { inputs, params, promptHasContent } = prepareAndRemoveDuplicateInputs(template.prompts);

    if (template.questions?.length) {
      const normalizeQuestions: Record<string, string> = template.questions.reduce(
        (acc, question) => {
          const key = Object.keys(question)[0];
          acc[key] = question[key].question;

          return acc;
        },
        {} as Record<string, string>,
      );

      inputs = inputs.map(input => {
        input.question = normalizeQuestions[input.name] ?? "";

        return input;
      });
    }
    inputs.sort((a, b) => +b.required - +a.required);

    initialMessages({ inputs });

    const valuesMap = new Map<number, ResOverrides>();
    params.forEach(_param => {
      valuesMap.set(_param.prompt, { id: _param.prompt, contextual_overrides: [] });
    });
    setParamsValues(Array.from(valuesMap.values()));

    return [inputs, params, promptHasContent];
  }, [template]);

  const disabledButton = _inputs.length !== 0 || promptHasContent;

  const showGenerate =
    !isSimulationStreaming && (showGenerateButton || Boolean(!_inputs.length || !_inputs[0]?.required));

  useEffect(() => {
    dispatchNewExecutionData(answers, _inputs);
  }, [template]);

  useEffect(() => {
    if (answers.length) {
      dispatch(setGeneratedExecution(generatingResponse));
    }
  }, [generatingResponse]);

  useEffect(() => {
    if (!isSimulationStreaming && !!queuedMessages.length) {
      const nextQueuedMessage = queuedMessages.pop()!;

      setMessages(prevMessages => prevMessages.concat(nextQueuedMessage));
      addToQueuedMessages(queuedMessages);
    }
  }, [isSimulationStreaming]);

  useEffect(() => {
    if (!isGenerating && generatedExecution?.data?.length) {
      const allPromptsCompleted = generatedExecution.data.every(execData => execData.isCompleted);

      if (allPromptsCompleted) {
        selectGeneratedExecution();
        dispatch(setGeneratedExecution(null));
        dispatch(executionsApi.util.invalidateTags(["Executions"]));
      }
    }
  }, [isGenerating, generatedExecution]);

  useEffect(() => {
    if (allRequiredInputsAnswered(_inputs, answers)) {
      setShowGenerateButton(true);
    } else {
      setShowGenerateButton(false);
    }
  }, [answers]);

  const selectGeneratedExecution = async () => {
    if (generatedExecution?.id) {
      const _newExecution = await getExecutionById(generatedExecution.id);
      dispatch(setSelectedExecution(_newExecution));

      const generatedExecutionMessage: IMessage = {
        id: randomId(),
        text: "",
        type: "spark",
        createdAt: createdAt,
        fromUser: false,
        spark: _newExecution,
      };
      setMessages(prevMessages => prevMessages.concat(generatedExecutionMessage));
    }
  };

  const allRequiredInputsAnswered = (inputs: IPromptInput[], answers: IAnswer[]): boolean => {
    const requiredInputs = inputs.filter(input => input.required).map(input => input.name);

    if (!requiredInputs.length) {
      return true;
    }

    const answeredInputsSet = new Set(answers.map(answer => answer.inputName));

    return requiredInputs.every(name => answeredInputsSet.has(name));
  };

  const messageAnswersForm = (message: string) => {
    const createdAt = new Date(new Date().getTime() - 1000);

    const botMessage: IMessage = {
      id: randomId(),
      text: message,
      type: "text",
      createdAt,
      fromUser: false,
    };

    addToQueuedMessages([
      {
        id: randomId(),
        text: "",
        type: "form",
        createdAt,
        fromUser: false,
        noHeader: true,
      },
    ]);

    setMessages(prevMessages => prevMessages.filter(msg => msg.type !== "form").concat(botMessage));
  };

  const addNewPrompt = () => {
    dispatch(setAccordionChatMode("input"));
    dispatch(setSelectedExecution(null));
    setAnswers([]);
    setIsSimulationStreaming(false);
  };

  const validateVary = async (variation: string) => {
    dispatch(setAccordionChatMode("input"));
    if (variation) {
      const userMessage: IMessage = {
        id: randomId(),
        text: variation,
        type: "text",
        createdAt: new Date(new Date().getTime() - 1000),
        fromUser: true,
      };
      setMessages(prevMessages => prevMessages.concat(userMessage));

      setIsValidatingAnswer(true);

      const questionAnswerMap: Record<string, string | number | File> = {};
      _inputs.forEach(input => {
        const matchingAnswer = answers.find(answer => answer.inputName === input.name);
        questionAnswerMap[input.name] = matchingAnswer?.answer || "";
      });

      const payload = {
        prompt: variation,
        variables: questionAnswerMap,
      };

      let varyResponse: VaryValidatorResponse | string;
      try {
        varyResponse = await vary({ token, payload });
      } catch (err) {
        varyResponse = "error";
      }

      if (typeof varyResponse === "string") {
        console.log("first");
        setIsValidatingAnswer(false);
        messageAnswersForm("Oops! I couldn't get your reponse, Please try again.");
        return;
      }

      const validatedAnswers = varyResponse;

      const newAnswers: IAnswer[] = _inputs
        .map(input => {
          const { name: inputName, required, question, prompt } = input;
          const answer = validatedAnswers[input.name];
          const promptId = prompt!;

          return {
            inputName,
            required,
            question: question ?? "",
            prompt: promptId,
            answer,
          };
        })
        .filter(answer => answer.answer);

      setAnswers(newAnswers);
      setIsValidatingAnswer(false);

      const isReady = allRequiredInputsAnswered(_inputs, newAnswers)
        ? " Let’s imagine something like this! Prepared request for you"
        : "";
      messageAnswersForm(`Ok!${isReady}, please check input information and we are ready to start!`);
    }
  };

  const handleUserParam = (value: number, param: PromptParams) => {
    const paramId = param.parameter.id;
    setParamsValues(prevValues =>
      prevValues.map(paramValue => {
        if (paramValue.id === param.prompt) {
          const others = paramValue.contextual_overrides.filter(val => val.parameter !== paramId);
          paramValue.contextual_overrides = others.concat({ parameter: paramId, score: value });
        }
        return paramValue;
      }),
    );
  };

  const handleUserInput = async (value: string | File, input: IPromptInput) => {
    if (isSimulationStreaming) {
      return;
    }

    const { name: inputName, required } = input;

    const _answers = [...answers.filter(answer => answer.inputName !== inputName)];

    if (!(!(value instanceof File) && value.trim() === "")) {
      const newAnswer: IAnswer = {
        question: input.question!,
        required,
        inputName,
        prompt: input.prompt!,
        answer: value,
      };
      _answers.push(newAnswer);
    }

    setAnswers(_answers);

    dispatchNewExecutionData(_answers, _inputs);
  };

  const validateAndUploadFiles = () =>
    new Promise<{ status: boolean; answers: IAnswer[] }>(async resolve => {
      let status = true;
      const _answers = await Promise.all(
        [...answers].map(async answer => {
          if (answer.answer instanceof File && !uploadedFiles.current.has(answer.inputName)) {
            const res = await uploadFileHelper(uploadFile, { file: answer.answer });
            const fileUrl = res?.file;

            if (typeof fileUrl === "string" && fileUrl) {
              uploadedFiles.current.set(answer.inputName, fileUrl);
            } else {
              answer.error = true;
              if (answer.required) {
                status = false;
              }
            }
          }
          return answer;
        }),
      );
      setAnswers(_answers);
      resolve({ status, answers: _answers });
    });

  const generateExecutionHandler = async () => {
    if (!token) {
      return router.push("/signin");
    }

    const filesUploaded = await validateAndUploadFiles();
    if (!filesUploaded.status) {
      const invalids = filesUploaded.answers
        .filter(answers => answers.error)
        .map(answer => _inputs.find(input => input.name === answer.inputName)?.fullName);

      messageAnswersForm(`Please enter valid answers for "${invalids.join(", ")}"`);
      return;
    }

    dispatch(setGeneratingStatus(true));

    const promptsData = preparePromptsData(uploadedFiles.current, answers, paramsValues, template.prompts);

    uploadedFiles.current.clear();

    generateExecution(promptsData);
  };

  const generateExecution = (executionData: ResPrompt[]) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/meta/templates/${template!.id}/execute/`;

    fetchEventSource(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(executionData),
      openWhenHidden: true,
      signal: abortController.current.signal,
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
          const parseData = parseMessageData(msg.data);
          const message = parseData.message;
          const prompt = parseData.prompt_id;
          const executionId = parseData.template_execution_id;

          // event: status, data:{"message": "[CONNECTED]"}
          if (message === "[CONNECTED]") {
            return;
          }

          if (executionId) {
            setNewExecutionId(executionId);
            setGeneratingResponse(prevState => ({
              id: executionId,
              created_at: prevState.created_at,
              data: prevState.data,
            }));
          }

          if (msg.event === "infer" && msg.data) {
            if (message) {
              setGeneratingResponse(prevState => {
                const newState = { ...prevState, data: [...prevState.data] };
                const activePromptIndex = newState.data.findIndex(promptData => promptData.prompt === +prompt);

                if (activePromptIndex === -1) {
                  newState.data.push({ message, prompt, created_at: new Date() });
                } else {
                  newState.data[activePromptIndex] = {
                    ...newState.data[activePromptIndex],
                    message: newState.data[activePromptIndex].message + message,
                  };
                }

                return newState;
              });
            }
          } else {
            if (message.includes("[ERROR]")) {
              onError(
                message ? message.replace("[ERROR]", "") : "Something went wrong during the execution of this prompt",
              );

              return;
            }

            setGeneratingResponse(prevState => {
              const newState = { ...prevState, data: [...prevState.data] };
              const activePromptIndex = newState.data.findIndex(promptData => promptData.prompt === +prompt);

              if (message === "[INITIALIZING]") {
                if (activePromptIndex === -1) {
                  newState.data.push({
                    message: "",
                    prompt,
                    isLoading: true,
                    created_at: new Date(),
                  });
                } else {
                  newState.data[activePromptIndex] = {
                    ...newState.data[activePromptIndex],
                    isLoading: true,
                  };
                }
              }

              if (message === "[COMPLETED]") {
                newState.data[activePromptIndex] = {
                  ...newState.data[activePromptIndex],
                  isLoading: false,
                  isCompleted: true,
                };
              }

              return newState;
            });
          }
        } catch {
          console.info("invalid incoming msg:", msg);
        }
      },
      onerror(err) {
        setDisableChatInput(false);
        dispatch(setGeneratingStatus(false));

        if (abortController.current.signal.aborted) {
          return;
        }

        onError("Something went wrong. Please try again later");
        throw err; // rethrow to stop the operation
      },
      onclose() {
        setDisableChatInput(false);
        dispatch(setGeneratingStatus(false));
      },
    });
  };

  const abortConnection = () => {
    abortController.current.abort();
    if (newExecutionId) {
      stopExecution(newExecutionId);
    }
  };

  return (
    <Box
      width={{ md: isSidebarExpanded ? "100%" : "80%" }}
      mx={{ md: "auto" }}
      height={"100%"}
    >
      <Stack
        justifyContent={"flex-end"}
        height={"calc(100% - 20px)"}
        gap={2}
      >
        <ChatInterface
          template={template}
          messages={messages}
          setIsSimulationStreaming={setIsSimulationStreaming}
          inputs={_inputs}
          params={_params}
          paramsValues={paramsValues}
          answers={answers}
          showGenerate={showGenerate}
          onChangeInput={handleUserInput}
          onChangeParam={handleUserParam}
          onGenerate={generateExecutionHandler}
          onAbort={abortConnection}
          onClear={() => setAnswers([])}
        />
        {currentUser?.id ? (
          <ChatInput
            addNewPrompt={addNewPrompt}
            onSubmit={validateVary}
            disabled={isValidatingAnswer || disableChatInput}
            isValidating={isValidatingAnswer}
            disabledButton={!disabledButton}
            showGenerate={showGenerateButton}
            onGenerate={generateExecutionHandler}
          />
        ) : (
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={1}
            width={{ md: "100%" }}
            p={{ md: "16px 8px 16px 16px" }}
          >
            <Button
              onClick={() => {
                router.push("/signin");
              }}
              variant={"contained"}
              startIcon={
                <LogoApp
                  width={18}
                  color="white"
                />
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
              }}
            >
              <Typography
                ml={2}
                color={"inherit"}
              >
                Sign in or Create an account
              </Typography>
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default memo(GeneratorChat);
