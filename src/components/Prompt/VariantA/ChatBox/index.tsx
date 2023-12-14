import { useState, useMemo, memo, useEffect, useRef } from "react";
import { Typography, Stack } from "@mui/material";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useRouter } from "next/router";
import { PromptParams, ResOverrides, ResPrompt } from "@/core/api/dto/prompts";
import { useAppSelector, useAppDispatch } from "@/hooks/useStore";
import useToken from "@/hooks/useToken";
import { ChatInterface } from "./ChatInterface";
import { ChatInput } from "./ChatInput";
import { Templates } from "@/core/api/dto/templates";
import { IPromptInput, PromptLiveResponse, AnsweredInputType } from "@/common/types/prompt";
import { setGeneratingStatus, updateExecutionData } from "@/core/store/templatesSlice";
import { IAnswer, IMessage, VaryValidatorResponse } from "@/common/types/chat";
import { executionsApi, useStopExecutionMutation } from "@/core/api/executions";
import { vary } from "@/common/helpers/varyValidator";
import { parseMessageData } from "@/common/helpers/parseMessageData";
import { useUploadFileMutation } from "@/core/api/uploadFile";
import { uploadFileHelper } from "@/common/helpers/uploadFileHelper";
import { setGeneratedExecution, setSelectedExecution } from "@/core/store/executionsSlice";
import { getExecutionById } from "@/hooks/api/executions";
import { isDesktopViewPort, randomId } from "@/common/helpers";
import useChatBox from "@/hooks/useChatBox";
import SigninButton from "@/components/common/buttons/SigninButton";
import { setAnswers, setInputs, setIsSimulationStreaming, setParams, setparamsValues } from "@/core/store/chatSlice";

interface Props {
  onError: (errMsg: string) => void;
  template: Templates;
  questionPrefixContent: string;
}

const ChatBox: React.FC<Props> = ({ onError, template, questionPrefixContent }) => {
  const token = useToken();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const isDesktopView = isDesktopViewPort();
  const [stopExecution] = useStopExecutionMutation();
  const [uploadFile] = useUploadFileMutation();
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const repeatedExecution = useAppSelector(state => state.executions.repeatedExecution);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);
  const [generatingResponse, setGeneratingResponse] = useState<PromptLiveResponse>({
    created_at: new Date(),
    data: [],
  });

  const answers = useAppSelector(state => state.chat.answers);
  const isSimulationStreaming = useAppSelector(state => state.chat.isSimulationStreaming);
  const paramsValues = useAppSelector(state => state.chat.paramsValues);

  const [newExecutionId, setNewExecutionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [queuedMessages, setQueuedMessages] = useState<IMessage[]>([]);
  const [disableChatInput, setDisableChatInput] = useState(false);
  const { prepareAndRemoveDuplicateInputs, preparePromptsData } = useChatBox();

  const abortController = useRef(new AbortController());
  const uploadedFiles = useRef(new Map<string, string>());

  const addToQueuedMessages = (messages: IMessage[]) => {
    setQueuedMessages(messages);
    dispatch(setIsSimulationStreaming(true));
  };

  const initialMessages = (questions: IPromptInput[]) => {
    const createdAt = new Date(new Date().getTime() - 1000);
    const prefixedContent =
      questionPrefixContent ?? `Hi, ${currentUser?.first_name ?? currentUser?.username ?? "There"}! Ready to work on`;

    const welcomeMessage: IMessage = {
      id: randomId(),
      text: `${prefixedContent} ${template?.title} ?`,
      type: "text",
      createdAt,
      fromUser: false,
    };

    if (questions.length > 0) {
      let allQuestions = questions.map(_q => _q.question);

      addToQueuedMessages([
        {
          id: randomId(),
          text: allQuestions.join(" "),
          type: "text",
          createdAt,
          fromUser: false,
          noHeader: true,
        },
        {
          id: randomId(),
          text: "",
          type: "form",
          createdAt,
          fromUser: false,
          noHeader: true,
        },
        {
          id: randomId(),
          text: "This is a list of information we need to execute this template:",
          type: "text",
          createdAt,
          fromUser: false,
          noHeader: true,
        },
      ]);
    }

    setMessages([welcomeMessage]);
    dispatch(setAnswers([]));

    setShowGenerateButton(false);
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

  const [_inputs, _params]: [IPromptInput[], PromptParams[]] = useMemo(() => {
    if (!template) {
      return [[], []];
    }

    let { inputs, params } = prepareAndRemoveDuplicateInputs(template.prompts);

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

    initialMessages(inputs);

    const valuesMap = new Map<number, ResOverrides>();
    params.forEach(_param => {
      const paramId = _param.parameter.id;
      valuesMap.set(_param.prompt, {
        id: _param.prompt,
        contextual_overrides: (valuesMap.get(_param.prompt)?.contextual_overrides || []).concat({
          parameter: paramId,
          score: _param.score,
        }),
      });
    });
    dispatch(setparamsValues(Array.from(valuesMap.values())));
    dispatch(setParams(params));
    dispatch(setInputs(inputs));

    return [inputs, params];
  }, [template]);

  useEffect(() => {
    if (!repeatedExecution) return;
    const isReady = allRequiredInputsAnswered(_inputs, answers) ? " We are ready to create a new document." : "";
    messageAnswersForm(`Ok!${isReady} I have prepared the incoming parameters, please check!`);
  }, [repeatedExecution]);

  useEffect(() => {
    dispatchNewExecutionData(answers, _inputs);
  }, [template, answers]);

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

  const selectGeneratedExecution = async () => {
    if (generatedExecution?.id) {
      const _newExecution = await getExecutionById(generatedExecution.id);
      dispatch(setSelectedExecution(_newExecution));

      const generatedExecutionMessage: IMessage = {
        id: randomId(),
        text: "",
        type: "spark",
        createdAt: new Date(new Date().getTime() - 1000),
        fromUser: false,
        spark: _newExecution,
      };
      setMessages(prevMessages => prevMessages.concat(generatedExecutionMessage));
    }
  };

  const allRequiredInputsAnswered = (inputs: IPromptInput[], answers: IAnswer[]): boolean => {
    const requiredQuestionNames = inputs.filter(question => question.required).map(question => question.name);

    if (!requiredQuestionNames.length) {
      return true;
    }

    const answeredQuestionNamesSet = new Set(answers.map(answer => answer.inputName));

    return requiredQuestionNames.every(name => answeredQuestionNamesSet.has(name));
  };

  useEffect(() => {
    if (allRequiredInputsAnswered(_inputs, answers)) {
      setShowGenerateButton(true);
    } else {
      setShowGenerateButton(false);
    }
  }, [answers, _inputs]);

  const validateVary = async (variation: string) => {
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
        setIsValidatingAnswer(false);
        messageAnswersForm("Oops! I couldn't get your reponse, Please try again.");
        return;
      }

      const answeredInputs: AnsweredInputType[] = [];
      const validatedAnswers = varyResponse;
      const newAnswers: IAnswer[] = _inputs
        .map(input => {
          const { name: inputName, type, required, question, prompt } = input;
          const answer = validatedAnswers[inputName];
          const promptId = prompt!;
          const toNumber = type === "number" && typeof answer === "string";
          const value = toNumber ? Number(answer.toString().replace(/[^\d]+/g, "")) : answer;

          if (answer) {
            answeredInputs.push({
              promptId,
              inputName,
              value,
              modifiedFrom: "chat",
            });
          }
          return {
            inputName,
            required,
            question: question || "",
            prompt: promptId,
            answer: value,
          };
        })
        .filter(answer => answer.answer);
      dispatch(setAnswers(newAnswers));
      setIsValidatingAnswer(false);

      const isReady = allRequiredInputsAnswered(_inputs, newAnswers) ? " We are ready to create a new document." : "";
      messageAnswersForm(`Ok!${isReady} I have prepared the incoming parameters, please check!`);
    }
  };

  const handleUserInput = (value: string | File, input: IPromptInput) => {
    if (isSimulationStreaming) {
      return;
    }

    const { name: inputName, required, question, prompt } = input;
    const promptId = prompt!;

    const _answers = [...answers.filter(answer => answer.inputName !== inputName)];

    if (!(!(value instanceof File) && value.trim() === "")) {
      const newAnswer: IAnswer = {
        question: question || "",
        required,
        inputName,
        prompt: promptId,
        answer: value,
        error: false,
      };
      _answers.push(newAnswer);
    }

    dispatch(setAnswers(_answers));
  };

  const handleUserParam = (value: number, param: PromptParams) => {
    const paramId = param.parameter.id;
    const updatedParamsValues = paramsValues.map(paramValue => {
      if (paramValue.id !== param.prompt) {
        return paramValue;
      }

      return {
        id: paramValue.id,
        contextual_overrides: paramValue.contextual_overrides.map(ctx =>
          ctx.parameter === paramId ? { parameter: paramId, score: value } : ctx,
        ),
      };
    });

    dispatch(setparamsValues(updatedParamsValues));
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

      dispatch(setAnswers(_answers));
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

    // dispatch(setChatFullScreenStatus(false));

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

  const showGenerate =
    !isSimulationStreaming &&
    ((showGenerateButton && messages[messages.length - 1]?.type !== "spark") ||
      Boolean(!_inputs.length || !_inputs[0]?.required));

  const showClearBtn = messages[messages.length - 1]?.type === "form" && answers.length > 0;

  return (
    <Stack
      gap={"1px"}
      width={"100%"}
      height={"calc(100% - 1px)"}
      bgcolor={"surface.3"}
    >
      {isDesktopView && (
        <Stack
          direction={"row"}
          alignItems={"center"}
          sx={{
            bgcolor: "surface.1",
            p: "24px 8px 24px 28px",
          }}
        >
          <Typography
            fontSize={12}
            fontWeight={500}
            letterSpacing={2}
            textTransform={"uppercase"}
          >
            Chat With Promptify
          </Typography>
        </Stack>
      )}
      <Stack
        justifyContent={"flex-end"}
        gap={2}
        height={{ xs: "100%", md: "calc(100% - 66px)" }}
        bgcolor={"surface.1"}
      >
        <ChatInterface
          template={template}
          messages={messages}
          onChangeInput={handleUserInput}
          onChangeParam={handleUserParam}
        />
        {currentUser?.id ? (
          <ChatInput
            onSubmit={validateVary}
            disabled={isValidatingAnswer || isGenerating || disableChatInput || _inputs.length === 0}
            showGenerate={showGenerate}
            onGenerate={generateExecutionHandler}
            isValidating={isValidatingAnswer}
            abortGenerating={abortConnection}
          />
        ) : (
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={1}
            p={"16px 8px 16px 16px"}
          >
            <SigninButton />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default memo(ChatBox);
