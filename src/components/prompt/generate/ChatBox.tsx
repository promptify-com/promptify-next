import React, { useState, useMemo, memo, useEffect, useRef } from "react";
import { Typography, Button, Stack, Box } from "@mui/material";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useRouter } from "next/router";
import { ResPrompt } from "@/core/api/dto/prompts";
import { LogoApp } from "@/assets/icons/LogoApp";
import { useAppSelector, useAppDispatch } from "@/hooks/useStore";
import useToken from "@/hooks/useToken";
import useTimestampConverter from "@/hooks/useTimestampConverter";
import { ChatInterface } from "./ChatInterface";
import { ChatInput } from "./ChatInput";
import { TemplateQuestions, Templates, TemplatesExecutions, UpdatedQuestionTemplate } from "@/core/api/dto/templates";
import { IPromptInput, PromptLiveResponse, AnsweredInputType } from "@/common/types/prompt";
import { setChatFullScreenStatus, setGeneratingStatus, updateExecutionData } from "@/core/store/templatesSlice";
import { IAnswer, IMessage } from "@/common/types/chat";
import { useStopExecutionMutation } from "@/core/api/executions";
import { vary } from "@/common/helpers/varyValidator";
import { parseMessageData } from "@/common/helpers/parseMessageData";
import { useUploadFileMutation } from "@/core/api/uploadFile";
import { uploadFileHelper } from "@/common/helpers/uploadFileHelper";
import { setGeneratedExecution, setSelectedExecution } from "@/core/store/executionsSlice";
import { getExecutionById } from "@/hooks/api/executions";
import { randomId } from "@/common/helpers";
import useChatBox from "@/hooks/useChatBox";

interface Props {
  onError: (errMsg: string) => void;
  template: Templates;
}

const ChatMode: React.FC<Props> = ({ onError, template }) => {
  const token = useToken();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const [stopExecution] = useStopExecutionMutation();
  const [uploadFile] = useUploadFileMutation();
  const { convertedTimestamp } = useTimestampConverter();
  const createdAt = convertedTimestamp(new Date());
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);
  const [generatingResponse, setGeneratingResponse] = useState<PromptLiveResponse>({
    created_at: new Date(),
    data: [],
  });
  const [newExecutionId, setNewExecutionId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [queuedMessages, setQueuedMessages] = useState<IMessage[]>([]);
  const [isSimulationStreaming, setIsSimulationStreaming] = useState(false);
  const [disableChatInput, setDisableChatInput] = useState(false);
  const { prepareAndRemoveDuplicateInputs, preparePromptsData } = useChatBox();

  const abortController = useRef(new AbortController());
  const uploadedFiles = useRef(new Map<string, string>());

  const addToQueuedMessages = (messages: IMessage[]) => {
    setQueuedMessages(messages);
    setIsSimulationStreaming(true);
  };
  const initialMessages = (questions: UpdatedQuestionTemplate[]) => {
    const welcomeMessage: IMessage = {
      id: randomId(),
      text: `Hi, ${currentUser?.first_name ?? currentUser?.username ?? "There"}! Ready to work on ${template?.title} ?`,
      type: "text",
      createdAt: createdAt,
      fromUser: false,
    };

    if (questions.length > 0) {
      let allQuestions = questions.map(_q => _q.question);

      addToQueuedMessages([
        {
          id: randomId(),
          text: allQuestions.join(" "),
          type: "text",
          createdAt: createdAt,
          fromUser: false,
          noHeader: true,
        },
        {
          id: randomId(),
          text: "This is a list of information we need to execute this template:",
          type: "form",
          createdAt: createdAt,
          fromUser: false,
          noHeader: true,
        },
      ]);
    }

    setMessages([welcomeMessage]);
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
  const [templateQuestions, _inputs, promptHasContent]: [UpdatedQuestionTemplate[], IPromptInput[], Boolean] =
    useMemo(() => {
      if (!template) {
        return [[], [], false];
      }

      const questions: TemplateQuestions[] = template?.questions ?? [];
      const { inputs, promptHasContent } = prepareAndRemoveDuplicateInputs(template.prompts);
      const updatedQuestions: UpdatedQuestionTemplate[] = [];

      for (let index = 0; index < questions.length; index++) {
        const question = questions[index];
        const key = Object.keys(question)[0];

        if (inputs[index]) {
          const { type, required, choices, fileExtensions, name, fullName, prompt } = inputs[index];
          const updatedQuestion: UpdatedQuestionTemplate = {
            ...question[key],
            name,
            fullName,
            required,
            type,
            choices,
            fileExtensions,
            prompt: prompt!,
          };
          updatedQuestions.push(updatedQuestion);
        }
      }

      updatedQuestions.sort((a, b) => +b.required - +a.required);

      initialMessages(updatedQuestions);

      return [updatedQuestions, inputs, promptHasContent];
    }, [template]);

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
        createdAt: createdAt,
        fromUser: false,
        spark: _newExecution,
      };
      setMessages(prevMessages => prevMessages.concat(generatedExecutionMessage));
    }
  };

  const allRequiredQuestionsAnswered = (templateQuestions: UpdatedQuestionTemplate[], answers: IAnswer[]): boolean => {
    const requiredQuestionNames = templateQuestions
      .filter(question => question.required)
      .map(question => question.name);

    if (!requiredQuestionNames.length) {
      return true;
    }

    const answeredQuestionNamesSet = new Set(answers.map(answer => answer.inputName));

    return requiredQuestionNames.every(name => answeredQuestionNamesSet.has(name));
  };

  useEffect(() => {
    if (allRequiredQuestionsAnswered(templateQuestions, answers)) {
      setShowGenerateButton(true);
    } else {
      setShowGenerateButton(false);
    }
  }, [answers, templateQuestions]);

  const validateVary = async (variation: string) => {
    if (variation) {
      const userMessage: IMessage = {
        id: randomId(),
        text: variation,
        type: "text",
        createdAt: createdAt,
        fromUser: true,
      };
      setMessages(prevMessages => prevMessages.concat(userMessage));

      setIsValidatingAnswer(true);

      const questionAnswerMap: Record<string, string | number | File> = {};
      templateQuestions.forEach(question => {
        const matchingAnswer = answers.find(answer => answer.inputName === question.name);
        questionAnswerMap[question.name] = matchingAnswer?.answer || "";
      });

      const payload = {
        prompt: variation,
        variables: questionAnswerMap,
      };

      const varyResponse = await vary({ token, payload });

      if (typeof varyResponse === "string") {
        onError("Oops, Please try again!");
        setIsValidatingAnswer(false);
        return;
      }

      const answeredInputs: AnsweredInputType[] = [];
      const newAnswers = templateQuestions
        .map(question => {
          const answer = varyResponse[question.name];

          if (answer) {
            answeredInputs.push({
              promptId: question.prompt,
              inputName: question.name,
              value: answer,
              modifiedFrom: "chat",
            });
          }
          return {
            inputName: question.name,
            required: question.required,
            question: question.question,
            prompt: question.prompt,
            answer: answer || "",
          };
        })
        .filter(answer => answer.answer !== "");

      setAnswers(newAnswers);
      setIsValidatingAnswer(false);

      const isReady = allRequiredQuestionsAnswered(templateQuestions, newAnswers)
        ? " We are ready to create a new document."
        : "";
      const botMessage: IMessage = {
        id: randomId(),
        text: `Ok!${isReady} I have prepared the incoming parameters, please check!`,
        type: "form",
        createdAt: createdAt,
        fromUser: false,
      };

      setMessages(prevMessages => prevMessages.filter(msg => msg.type !== "form").concat(botMessage));
    }
  };

  const handleUserInput = async (value: string | File, currentQuestion: UpdatedQuestionTemplate) => {
    if (isSimulationStreaming) {
      return;
    }

    const { name: inputName, required, question, prompt } = currentQuestion;

    const _answers = [...answers.filter(answer => answer.inputName !== inputName)];

    if (!(!(value instanceof File) && value.trim() === "")) {
      const newAnswer: IAnswer = {
        question,
        required,
        inputName,
        prompt,
        answer: value,
        error: false,
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
        .map(answer => templateQuestions.find(question => question.name === answer.inputName)?.fullName);
      const botMessage: IMessage = {
        id: randomId(),
        text: `Please enter valid answers for "${invalids.join(", ")}"`,
        type: "form",
        createdAt: createdAt,
        fromUser: false,
      };

      setMessages(prevMessages => prevMessages.filter(msg => msg.type !== "form").concat(botMessage));
      return;
    }

    dispatch(setGeneratingStatus(true));

    const promptsData = preparePromptsData(uploadedFiles.current, answers, template.prompts);

    uploadedFiles.current.clear();

    dispatch(setChatFullScreenStatus(false));

    generateExecution(promptsData);
  };

  const regenerateHandler = async (execution: TemplatesExecutions) => {
    dispatch(setGeneratingStatus(true));

    const promptsData: ResPrompt[] = [];

    if (execution.parameters) {
      Object.entries(execution.parameters).forEach(param => {
        promptsData.push({
          contextual_overrides: [],
          prompt: +param[0],
          prompt_params: param[1],
        });
      });
    }

    dispatch(setChatFullScreenStatus(false));

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

  const canShowGenerateButton = Boolean(!templateQuestions.length || !templateQuestions[0]?.required);

  const disabledButton = _inputs.length !== 0 || promptHasContent;

  const showClearBtn = messages[messages.length - 1]?.type === "form" && answers.length > 0;

  return (
    <Box
      width={"100%"}
      height={"100%"}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        sx={{
          bgcolor: "surface.1",
          p: "24px 8px 24px 16px",
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
      <Stack
        justifyContent={"flex-end"}
        height={"calc(100% - 66px)"}
        gap={2}
      >
        <ChatInterface
          questions={templateQuestions}
          answers={answers}
          template={template}
          messages={messages}
          onChange={handleUserInput}
          setIsSimulationStreaming={setIsSimulationStreaming}
          regenerate={regenerateHandler}
        />
        {currentUser?.id ? (
          <ChatInput
            onSubmit={validateVary}
            disabled={isValidatingAnswer || disableChatInput}
            onClear={() => setAnswers([])}
            showClear={showClearBtn}
            showGenerate={
              (showGenerateButton && messages[messages.length - 1]?.type !== "spark") || canShowGenerateButton
            }
            onGenerate={generateExecutionHandler}
            isValidating={isValidatingAnswer}
            disabledButton={!disabledButton}
            abortGenerating={abortConnection}
          />
        ) : (
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={1}
            width={"100%"}
            p={"16px 8px 16px 16px"}
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

export default memo(ChatMode);
