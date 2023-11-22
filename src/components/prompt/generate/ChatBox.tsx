import { useState, useMemo, memo, useEffect, useRef } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useRouter } from "next/router";
import Add from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { ResPrompt } from "@/core/api/dto/prompts";
import { LogoApp } from "@/assets/icons/LogoApp";
import { useAppSelector, useAppDispatch } from "@/hooks/useStore";
import useToken from "@/hooks/useToken";
import useTimestampConverter from "@/hooks/useTimestampConverter";
import { ChatInterface } from "./ChatInterface";
import { ChatInput } from "./ChatInput";
import { TemplateQuestions, Templates, UpdatedQuestionTemplate } from "@/core/api/dto/templates";
import { IPromptInput, PromptLiveResponse, AnsweredInputType } from "@/common/types/prompt";
import { setAccordionChatMode, setGeneratingStatus, updateExecutionData } from "@/core/store/templatesSlice";
import { IAnswer, IMessage } from "@/common/types/chat";
import { executionsApi, useStopExecutionMutation } from "@/core/api/executions";
import VaryModal from "./VaryModal";
import { vary } from "@/common/helpers/varyValidator";
import { parseMessageData } from "@/common/helpers/parseMessageData";
import { useUploadFileMutation } from "@/core/api/uploadFile";
import { uploadFileHelper } from "@/common/helpers/uploadFileHelper";
import { setGeneratedExecution, setSelectedExecution } from "@/core/store/executionsSlice";
import { TemplateDetailsCard } from "./TemplateDetailsCard";
import useChatBox from "@/hooks/useChatBox";
import { randomId } from "@/common/helpers";
import { getExecutionById } from "@/hooks/api/executions";

interface Props {
  onError: (errMsg: string) => void;
  template: Templates;
}

const ChatMode: React.FC<Props> = ({ onError, template }) => {
  const token = useToken();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const isSidebarExpanded = useAppSelector(state => state.template.isSidebarExpanded);
  const [stopExecution] = useStopExecutionMutation();
  const [uploadFile] = useUploadFileMutation();
  const { convertedTimestamp } = useTimestampConverter();
  const createdAt = convertedTimestamp(new Date());
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
  const [isSimulaitonStreaming, setIsSimulaitonStreaming] = useState(false);
  const [disableChatInput, setDisableChatInput] = useState(false);
  const [standingQuestions, setStandingQuestions] = useState<IPromptInput[]>([]);
  const [varyOpen, setVaryOpen] = useState(false);
  const currentAnsweredInputs = useAppSelector(state => state.template.answeredInputs);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);

  const { preparePromptsData, prepareAndRemoveDuplicateInputs } = useChatBox();

  const abortController = useRef(new AbortController());
  const uploadedFiles = useRef(new Map<string, string>());

  const addToQueuedMessages = (messages: IMessage[]) => {
    setQueuedMessages(messages);

    setIsSimulaitonStreaming(true);
  };

  const initialMessages = ({ inputs, startOver = false }: { inputs: IPromptInput[]; startOver?: boolean }) => {
    const welcomeMessage: IMessage[] = [];

    if (!startOver) {
      let allQuestions = inputs.map(input => input.question);

      welcomeMessage.push({
        id: randomId(),
        text: `Hi, ${
          currentUser?.first_name ?? currentUser?.username ?? "There"
        }! Ready to work on ${template?.title} ? ${allQuestions.join(" ")}`,
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
  const [_inputs, promptHasContent]: [IPromptInput[], Boolean] = useMemo(() => {
    if (!template) {
      return [[], false];
    }

    let { inputs, promptHasContent } = prepareAndRemoveDuplicateInputs(template.prompts);

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

    initialMessages({ inputs });

    return [inputs, promptHasContent];
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
    if (!isSimulaitonStreaming && !!queuedMessages.length) {
      const nextQueuedMessage = queuedMessages.pop()!;

      setMessages(prevMessages => prevMessages.concat(nextQueuedMessage));
      addToQueuedMessages(queuedMessages);
    }
  }, [isSimulaitonStreaming]);

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
        createdAt: createdAt,
        fromUser: false,
        spark: _newExecution,
      };
      setMessages(prevMessages => prevMessages.concat(generatedExecutionMessage));
    }
  };

  const allRequiredQuestionsAnswered = (inputs: IPromptInput[], answers: IAnswer[]): boolean => {
    const requiredInputs = inputs.filter(input => input.required).map(input => input.name);

    if (!requiredInputs.length) {
      return true;
    }

    const answeredInputsSet = new Set(answers.map(answer => answer.inputName));

    return requiredInputs.every(name => answeredInputsSet.has(name));
  };

  useEffect(() => {
    if (allRequiredQuestionsAnswered(_inputs, answers)) {
      setShowGenerateButton(true);
    } else {
      setShowGenerateButton(false);
    }
  }, [answers]);

  const disabledButton = _inputs.length !== 0 || promptHasContent;

  const addNewPrompt = ({ startOver = false }: { startOver: boolean }) => {
    dispatch(setAccordionChatMode("input"));
    if (startOver) {
      setAnswers([]);
    } else {
      const botMessage: IMessage = {
        id: randomId(),
        text: `Good! Let’s imagine something like this! Prepared request for you, please check input information and we are ready to start!  `,
        type: "text",
        createdAt: createdAt,
        fromUser: false,
      };
      setMessages(prevMessages => prevMessages.filter(msg => msg.type !== "form").concat(botMessage));
    }

    addToQueuedMessages([
      {
        id: randomId(),
        text: "",
        type: "form",
        createdAt: createdAt,
        fromUser: false,
        noHeader: true,
      },
    ]);
  };

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
      _inputs.forEach(input => {
        const matchingAnswer = answers.find(answer => answer.inputName === input.name);
        questionAnswerMap[input.name] = matchingAnswer?.answer || "";
      });

      const payload = {
        prompt: variation,
        variables: questionAnswerMap,
      };

      const varyResponse = await vary({ token, payload });

      if (typeof varyResponse === "string") {
        onError("Oopps, something happened. Please try again!");
        setIsValidatingAnswer(false);
        return;
      }

      const newAnswers = _inputs
        .map(input => {
          const answer = varyResponse[input.name];

          return {
            inputName: input.name,
            required: input.required,
            question: input.question!,
            prompt: input.prompt!,
            answer,
          };
        })
        .filter(answer => answer.answer !== "");

      setAnswers(newAnswers);
      setIsValidatingAnswer(false);

      addNewPrompt({ startOver: false });
    }
  };

  const handleUserInput = async (value: string | File, input: IPromptInput) => {
    if (isSimulaitonStreaming) {
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
    new Promise<boolean>(async resolve => {
      for (const answer of answers) {
        if (answer.answer instanceof File && !uploadedFiles.current.has(answer.inputName)) {
          const res = await uploadFileHelper(uploadFile, { file: answer.answer });
          const fileUrl = res?.file;

          if (typeof fileUrl === "string" && fileUrl) {
            uploadedFiles.current.set(answer.inputName, fileUrl);
          } else {
            handleAnswerClear(answer, true);
            if (answer.required) {
              resolve(false);
              return;
            }
          }
        }
      }
      resolve(true);
    });

  const generateExecutionHandler = async () => {
    if (!token) {
      return router.push("/signin");
    }

    const NextMessages: IMessage[] = [
      {
        id: randomId(),
        text: `Run Prompt`,
        type: "text",
        createdAt: createdAt,
        fromUser: true,
      },
      {
        id: randomId(),
        text: "",
        type: "form",
        createdAt: createdAt,
        fromUser: false,
        noHeader: true,
      },
    ];

    setMessages(prevMessages => prevMessages.filter(msg => msg.type !== "form").concat(NextMessages));

    const filesUploaded = await validateAndUploadFiles();
    if (!filesUploaded) return;

    dispatch(setGeneratingStatus(true));

    const promptsData = preparePromptsData(uploadedFiles.current, answers, template.prompts);

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

  const handleAnswerClear = (selectedAnswer: IAnswer, invalid = false) => {
    if (isSimulaitonStreaming) {
      return;
    }

    const answer: IAnswer = {
      question: selectedAnswer.question,
      required: selectedAnswer.required,
      inputName: selectedAnswer.inputName,
      prompt: selectedAnswer.prompt,
      answer: "",
    };

    const input = _inputs.find(_input => _input.name === selectedAnswer.inputName);
    const newStandingQuestions = standingQuestions.concat(input!).sort((a, b) => +a.required - +b.required);
    const askedQuestion = newStandingQuestions[newStandingQuestions.length - 1];

    setStandingQuestions(newStandingQuestions);

    const invalidTxt =
      invalid && input?.type === "file" ? `The uploaded file for "${selectedAnswer.inputName}" is invalid. ` : "";
    const nextBotMessage: IMessage = {
      id: randomId(),
      text: invalidTxt + "Let's give it another go. " + askedQuestion.question,
      choices: askedQuestion.choices,
      fileExtensions: askedQuestion.fileExtensions,
      type: "text",
      createdAt: createdAt,
      fromUser: false,
    };

    setMessages(prevMessages => prevMessages.concat(nextBotMessage));

    const newAnswers: IAnswer[] = answers.filter(answer => answer.inputName !== selectedAnswer.inputName);

    setAnswers(newAnswers);
    dispatchNewExecutionData(newAnswers, _inputs);
  };

  return (
    <Box
      width={isSidebarExpanded ? "100%" : "80%"}
      mx={"auto"}
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
          setMessages={setMessages}
          setIsSimulaitonStreaming={setIsSimulaitonStreaming}
          inputs={_inputs}
          answers={answers}
          showGenerate={showGenerateButton}
          onChange={handleUserInput}
          onGenerate={generateExecutionHandler}
          onAbort={abortConnection}
          onClear={() => setAnswers([])}
        />
        {currentUser?.id ? (
          <ChatInput
            addNewPrompt={() => addNewPrompt({ startOver: true })}
            onSubmit={validateVary}
            disabled={isValidatingAnswer || disableChatInput}
            isValidating={isValidatingAnswer}
            disabledButton={!disabledButton}
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
