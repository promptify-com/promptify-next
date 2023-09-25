import React, { useState, useMemo, memo, useEffect, useRef } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography, Button, Stack } from "@mui/material";
import { Block, ExpandLess, ExpandMore } from "@mui/icons-material";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { ResPrompt } from "@/core/api/dto/prompts";
import { LogoApp } from "@/assets/icons/LogoApp";
import { useAppSelector, useAppDispatch } from "@/hooks/useStore";
import useToken from "@/hooks/useToken";
import { generate } from "@/common/helpers/chatAnswersValidator";
import useTimestampConverter from "@/hooks/useTimestampConverter";
import { ChatInterface } from "./ChatInterface";
import { ChatInput } from "./ChatInput";
import { useRouter } from "next/router";
import { TemplateQuestions, UpdatedQuestionTemplate } from "@/core/api/dto/templates";
import { getInputsFromString } from "@/common/helpers";
import { IPromptInput, PromptLiveResponse, InputType } from "@/common/types/prompt";
import { setGeneratingStatus, updateExecutionData } from "@/core/store/templatesSlice";
import { AnswerValidatorResponse, IAnswer, IMessage } from "@/common/types/chat";
import { determineIsMobile } from "@/common/helpers/determineIsMobile";
import { useStopExecutionMutation } from "@/core/api/executions";

interface Props {
  setGeneratedExecution: (data: PromptLiveResponse | null) => void;
  onError: (errMsg: string) => void;
}

const BottomTabsMobileHeight = "240px";

const ChatMode: React.FC<Props> = ({ setGeneratedExecution, onError }) => {
  const IS_MOBILE = determineIsMobile();
  const token = useToken();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const template = useAppSelector(state => state.template.template);
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const [stopExecution] = useStopExecutionMutation();

  const { convertedTimestamp } = useTimestampConverter();
  const createdAt = convertedTimestamp(new Date());
  const [chatExpanded, setChatExpanded] = useState(true);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [isValidatingAnswer, setInValidatingAnswer] = useState(false);
  const [generatingResponse, setGeneratingResponse] = useState<PromptLiveResponse | null>(null);
  const [newExecutionId, setNewExecutionId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [queuedMessages, setQueuedMessages] = useState<IMessage[]>([]);
  const [isSimulaitonStreaming, setIsSimulaitonStreaming] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [disableChatInput, setDisableChatInput] = useState(false);
  const [standingQuestions, setStandingQuestions] = useState<UpdatedQuestionTemplate[]>([]);
  let abortController = useRef(new AbortController());

  const addToQueuedMessages = (message: IMessage[]) => {
    setQueuedMessages(prevMessages => prevMessages.concat(message));
    setIsSimulaitonStreaming(true);
  };
  const initialMessages = ({
    questions,
    startOver = false,
  }: {
    questions: UpdatedQuestionTemplate[];
    startOver?: boolean;
  }) => {
    const welcomeMessage: IMessage[] = [];

    if (!startOver) {
      welcomeMessage.push({
        text: `Hi, ${
          currentUser?.first_name ?? currentUser?.username ?? "There"
        }. Welcome. I can help you with the ${template?.title} template.`,
        type: "text" as InputType,
        createdAt: createdAt,
        fromUser: false,
      });
    }

    if (questions.length > 0) {
      const firstQuestion = questions[currentQuestionIndex];
      const firstQuestionMessage: IMessage = {
        text: firstQuestion.question,
        type: firstQuestion.type,
        createdAt: createdAt,
        fromUser: false,
      };

      if (!!welcomeMessage.length) {
        addToQueuedMessages([firstQuestionMessage]);
      } else {
        welcomeMessage.push(firstQuestionMessage);
      }
    }

    setCurrentQuestionIndex(0);
    setMessages(_messages => _messages.concat(welcomeMessage));
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
  const [templateQuestions, _inputs]: [UpdatedQuestionTemplate[], IPromptInput[]] = useMemo(() => {
    if (!template) {
      dispatchNewExecutionData([], []);
      return [[], []];
    }

    const questions: TemplateQuestions[] = template?.questions ?? [];
    const inputs: IPromptInput[] = [];

    template.prompts.forEach(prompt => {
      inputs.push(...getInputsFromString(prompt.content).map(obj => ({ ...obj, prompt: prompt.id })));
    });

    dispatchNewExecutionData([], inputs);
    const updatedQuestions: UpdatedQuestionTemplate[] = [];

    for (let index = 0; index < questions.length; index++) {
      const question = questions[index];
      const key = Object.keys(question)[0];

      if (inputs[index]) {
        const { type, required, choices, name, prompt } = inputs[index];
        const updatedQuestion: UpdatedQuestionTemplate = {
          ...question[key],
          name,
          required: required,
          type: type,
          choices: choices,
          prompt: prompt!,
        };
        updatedQuestions.push(updatedQuestion);
      }
    }

    updatedQuestions.sort((a, b) => +b.required - +a.required);

    initialMessages({ questions: updatedQuestions });

    return [updatedQuestions, inputs];
  }, [template]);

  useEffect(() => {
    setGeneratedExecution(generatingResponse);
  }, [generatingResponse]);

  useEffect(() => {
    if (newExecutionId) {
      setGeneratingResponse(prevState => ({
        id: newExecutionId,
        created_at: prevState?.created_at ?? new Date(),
        data: prevState?.data ?? [],
      }));
    }
  }, [newExecutionId]);

  useEffect(() => {
    if (currentQuestion && (currentQuestion.type === "choices" || currentQuestion.type === "code")) {
      setUserAnswer("");
      setDisableChatInput(true);
    } else setDisableChatInput(false);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (!isGenerating && answers.length) {
      const newBotMessage: IMessage = {
        text: "Do you want to run this template again?",
        fromUser: false,
        type: "choices",
        choices: ["Yes", "No"],
        createdAt: createdAt,
        startOver: true,
      };
      setShowGenerateButton(false);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setMessages(prevMessages => prevMessages.concat(newBotMessage));
    }
  }, [isGenerating]);

  useEffect(() => {
    if (!isSimulaitonStreaming && !!queuedMessages.length) {
      const nextQueuedMessage = queuedMessages.pop()!;

      setMessages(prevMessages => prevMessages.concat(nextQueuedMessage));
      addToQueuedMessages(queuedMessages);
    }
  }, [isSimulaitonStreaming]);

  const canShowGenerateButton = Boolean(templateQuestions.length && !templateQuestions[0].required);
  const disableChat = Boolean(!templateQuestions.length && !_inputs.length && template?.prompts.length);
  const currentQuestion = standingQuestions.length
    ? standingQuestions[standingQuestions.length - 1]
    : templateQuestions[currentQuestionIndex];

  const validateAnswer = async () => {
    if (currentQuestion) {
      const payload = {
        question: currentQuestion.question,
        answer: userAnswer,
      };

      return await generate({ token, payload });
    }
  };

  const handleUserResponse = async () => {
    if (userAnswer.trim() === "" || isSimulaitonStreaming) {
      return;
    }
    setUserAnswer("");

    if (currentQuestion) {
      setInValidatingAnswer(true);

      const newUserMessage: IMessage = {
        text: userAnswer,
        type: currentQuestion.type,
        createdAt: createdAt,
        fromUser: true,
      };

      setMessages(prevMessages => prevMessages.concat(newUserMessage));

      let response: AnswerValidatorResponse | undefined | string = { approved: true, answer: "", feedback: "" };

      if (currentQuestion.type !== "choices" && currentQuestion.type !== "code" && currentQuestion.required) {
        response = await validateAnswer();

        if (typeof response === "string") {
          onError("Oopps, something happened. Please try again!");
          return;
        }
      }

      let nextBotMessage: IMessage;

      if (response?.approved) {
        const newAnswer: IAnswer = {
          question: currentQuestion.question,
          answer: userAnswer,
          required: currentQuestion.required,
          inputName: currentQuestion.name,
          prompt: currentQuestion.prompt,
        };
        let newAnswers: IAnswer[] = [];

        setAnswers(prevAnswers => {
          newAnswers = prevAnswers.concat(newAnswer);

          return newAnswers;
        });
        dispatchNewExecutionData(newAnswers, _inputs);

        const isStandingQuestion = !!standingQuestions.length;

        if (standingQuestions.length) {
          standingQuestions.pop();
          setStandingQuestions(standingQuestions);
        }

        const nextQuestion = standingQuestions.length
          ? standingQuestions[standingQuestions.length - 1]
          : templateQuestions[isStandingQuestion ? currentQuestionIndex : currentQuestionIndex + 1];

        if (!nextQuestion) {
          nextBotMessage = {
            text: "Great, we can start template",
            type: "text",
            createdAt: createdAt,
            fromUser: false,
          };

          !showGenerateButton && setShowGenerateButton(true);
          setDisableChatInput(true);
        } else {
          if (!nextQuestion.required && !showGenerateButton) {
            setShowGenerateButton(true);
          }

          !isStandingQuestion && setCurrentQuestionIndex(currentQuestionIndex + 1);

          const nextMessage: IMessage = {
            text: nextQuestion.question,
            choices: nextQuestion.choices,
            type: nextQuestion.type,
            createdAt: createdAt,
            fromUser: false,
          };

          if (response.feedback) {
            nextBotMessage = { ...nextMessage, text: response.feedback, type: "text" };
            addToQueuedMessages([nextMessage]);
          } else {
            nextBotMessage = nextMessage;
          }
        }
      } else {
        nextBotMessage = {
          text: response?.feedback!,
          choices: currentQuestion.choices,
          type: currentQuestion.type,
          createdAt: createdAt,
          fromUser: false,
        };
      }

      setMessages(prevMessages => prevMessages.concat(nextBotMessage));
      setInValidatingAnswer(false);
    }
  };

  const handleChange = (value: string) => {
    if (isSimulaitonStreaming) {
      return;
    }

    if (!isGenerating && messages[messages.length - 1].startOver) {
      if (value === "Yes") {
        initialMessages({ questions: templateQuestions, startOver: true });
      } else {
        setShowGenerateButton(false);
        setDisableChatInput(true);
        setAnswers([]);
      }

      return;
    }

    if (currentQuestion && (currentQuestion.type === "choices" || currentQuestion.type === "code")) {
      const newAnswer: IAnswer = {
        question: currentQuestion.question,
        required: currentQuestion.required,
        inputName: currentQuestion.name,
        answer: value,
        prompt: currentQuestion.prompt,
      };
      let newAnswers: IAnswer[] = [];

      setAnswers(prevAnswers => {
        newAnswers = prevAnswers.concat(newAnswer);

        return newAnswers;
      });
      dispatchNewExecutionData(newAnswers, _inputs);

      const isStandingQuestion = !!standingQuestions.length;

      if (standingQuestions.length) {
        standingQuestions.pop();
        setStandingQuestions(standingQuestions);
      }

      const nextQuestion = standingQuestions.length
        ? standingQuestions[standingQuestions.length - 1]
        : templateQuestions[isStandingQuestion ? currentQuestionIndex : currentQuestionIndex + 1];
      let nextBotMessage: IMessage;

      if (!nextQuestion) {
        nextBotMessage = {
          text: "Great, we can start template",
          type: "text",
          createdAt: createdAt,
          fromUser: false,
        };

        !showGenerateButton && setShowGenerateButton(true);
        setDisableChatInput(true);
      } else {
        if (!nextQuestion.required && !showGenerateButton) {
          setShowGenerateButton(true);
        }

        !isStandingQuestion && setCurrentQuestionIndex(currentQuestionIndex + 1);

        nextBotMessage = {
          text: nextQuestion.question,
          choices: nextQuestion.choices,
          type: nextQuestion.type,
          createdAt: createdAt,
          fromUser: false,
        };
      }

      setMessages(prevMessages => prevMessages.concat(nextBotMessage));
    }
  };

  const generateExecutionHandler = () => {
    if (!token) {
      return router.push("/signin");
    }

    dispatch(setGeneratingStatus(true));
    setChatExpanded(false);

    const promptsData: ResPrompt[] = [];

    answers.forEach(_answer => {
      const _prompt = promptsData.find(_data => _data.prompt === _answer.prompt);

      if (!_prompt) {
        promptsData.push({
          contextual_overrides: [],
          prompt: _answer.prompt!,
          prompt_params: { [_answer.inputName]: _answer.answer },
        });
      } else {
        _prompt.prompt_params[_answer.inputName] = _answer.answer;
      }
    });

    generateExecution(promptsData);
  };

  const generateExecution = (executionData: ResPrompt[]) => {
    let tempData: any[] = [];
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
          const parseData = JSON.parse(msg.data.replace(/'/g, '"'));
          const message = parseData.message;
          const prompt = parseData.prompt_id;
          const executionId = parseData.template_execution_id;

          if (executionId) setNewExecutionId(executionId);

          if (msg.event === "infer" && msg.data) {
            if (message) {
              const tempArr = tempData;
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
            const tempArr = tempData;
            const activePrompt = tempArr.findIndex(template => template.prompt === +prompt);

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

            if (message === "[C OMPLETED]" || message === "[COMPLETED]") {
              tempArr[activePrompt] = {
                ...tempArr[activePrompt],
                prompt,
                isLoading: false,
                isCompleted: true,
              };
            }

            if (message.includes("[ERROR]")) {
              onError(
                message ? message.replace("[ERROR]", "") : "Something went wrong during the execution of this prompt",
              );
            }

            tempData = tempArr;
            setGeneratingResponse(prevState => ({
              ...prevState,
              created_at: prevState?.created_at || new Date(),
              data: tempData,
            }));
          }
        } catch {
          console.error(msg);
          // TODO: this is triggered event when there is no error
          // onError(msg.data.slice(0, 100));
        }
      },
      onerror(err) {
        dispatch(setGeneratingStatus(false));
        onError("Something went wrong. Please try again later");
        throw err; // rethrow to stop the operation
      },
      onclose() {
        dispatch(setGeneratingStatus(false));
      },
    });
  };

  const abortConnection = () => {
    abortController.current.abort();
    setGeneratedExecution(null);
    dispatch(setGeneratingStatus(false));
    if (newExecutionId) {
      stopExecution(newExecutionId);
    }
  };

  const handleAnswerSelect = (selectedAnswer: IAnswer) => {
    if (isSimulaitonStreaming) {
      return;
    }

    const question = templateQuestions.find(question => question.name === selectedAnswer.inputName);
    const newStandingQuestions = standingQuestions.concat(question!).sort((a, b) => +a.required - +b.required);
    const askedQuestion = newStandingQuestions[newStandingQuestions.length - 1];

    setStandingQuestions(newStandingQuestions);

    if (showGenerateButton && selectedAnswer.required) {
      setShowGenerateButton(false);
    }

    const nextBotMessage: IMessage = {
      text: "Let's give this another go. " + askedQuestion.question,
      choices: askedQuestion.choices,
      type: askedQuestion.type,
      createdAt: createdAt,
      fromUser: false,
    };

    setMessages(prevMessages => prevMessages.concat(nextBotMessage));

    let newAnswers: IAnswer[] = [];

    setAnswers(prevAnswers => {
      newAnswers = prevAnswers.filter(answer => answer.inputName !== selectedAnswer.inputName);

      return newAnswers;
    });
    dispatchNewExecutionData(newAnswers, _inputs);
  };

  return (
    <Grid
      width={"100%"}
      overflow={"hidden"}
      borderRadius={"16px"}
      sx={{
        position: { xs: "relative", md: "sticky" },
        ...(!IS_MOBILE && { top: "0", left: "0", zIndex: 995, border: "1px solid rgba(225, 226, 236, .5)" }),
      }}
    >
      <Accordion
        expanded={IS_MOBILE ? true : chatExpanded}
        onChange={() => setChatExpanded(prev => !prev)}
        sx={{
          boxShadow: "none",
          bgcolor: "surface.1",
          borderRadius: "16px",
          overflow: "hidden",
          ".MuiAccordionDetails-root": {
            p: "0",
          },
          ".MuiAccordionSummary-root": {
            minHeight: "48px",
            ":hover": {
              opacity: 0.8,
              svg: {
                color: "primary.main",
              },
            },
          },
          ".MuiAccordionSummary-content": {
            m: 0,
          },
        }}
      >
        <AccordionSummary sx={{ display: { xs: "none", md: "flex" } }}>
          <Grid
            display={"flex"}
            alignItems={"center"}
            gap={"16px"}
            width={"100%"}
            justifyContent={"space-between"}
          >
            <Grid
              display={"flex"}
              alignItems={"center"}
              gap={"16px"}
            >
              {!chatExpanded ? <ExpandMore sx={{ fontSize: 16 }} /> : <ExpandLess sx={{ fontSize: 16 }} />}

              <Typography
                px={"8px"}
                sx={{
                  fontSize: 13,
                  lineHeight: "22px",
                  letterSpacing: "0.46px",
                  color: "onSurface",
                  opacity: 0.8,
                }}
              >
                Chat with Promptify
              </Typography>
            </Grid>
            {isGenerating && (
              <Button
                variant="text"
                startIcon={<Block />}
                sx={{
                  border: "1px solid",
                  height: "22px",
                  p: "15px",
                  fontSize: 13,
                  fontWeight: 500,
                  ":hover": {
                    bgcolor: "action.hover",
                  },
                }}
                onClick={e => {
                  e.stopPropagation();
                  abortConnection();
                }}
              >
                Abort
              </Button>
            )}
          </Grid>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "8px",
            maxHeight: { xs: "70vh", md: "50svh" },
            ...(IS_MOBILE && { minHeight: { xs: `calc(100vh - ${BottomTabsMobileHeight} )` } }),
            borderTop: { xs: "none", md: "2px solid #ECECF4" },
          }}
        >
          <ChatInterface
            messages={messages}
            onChange={handleChange}
            showGenerate={Boolean((showGenerateButton || canShowGenerateButton) && currentUser?.id)}
            onGenerate={generateExecutionHandler}
            isValidating={isValidatingAnswer}
            setIsSimulaitonStreaming={setIsSimulaitonStreaming}
          />

          {currentUser?.id ? (
            <ChatInput
              answers={answers}
              onAnswerClear={handleAnswerSelect}
              onChange={setUserAnswer}
              value={userAnswer}
              onSubmit={handleUserResponse}
              disabled={disableChat || isValidatingAnswer || disableChatInput}
              disabledTags={disableChat || isValidatingAnswer || disableChatInput || isGenerating}
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
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default memo(ChatMode);
