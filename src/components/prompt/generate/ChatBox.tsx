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
import { TemplateQuestions, Templates, UpdatedQuestionTemplate } from "@/core/api/dto/templates";
import { getInputsFromString } from "@/common/helpers/getInputsFromString";
import { IPromptInput, PromptLiveResponse, InputType, AnsweredInputType } from "@/common/types/prompt";
import { setGeneratingStatus, updateAnsweredInput, updateExecutionData } from "@/core/store/templatesSlice";
import { AnswerValidatorResponse, IAnswer, IMessage } from "@/common/types/chat";
import { isDesktopViewPort } from "@/common/helpers";
import { useStopExecutionMutation } from "@/core/api/executions";
import VaryModal from "./VaryModal";
import { vary } from "@/common/helpers/varyValidator";

interface Props {
  setGeneratedExecution: (data: PromptLiveResponse | null) => void;
  onError: (errMsg: string) => void;
  template: Templates;
}

const BottomTabsMobileHeight = "240px";

const ChatMode: React.FC<Props> = ({ setGeneratedExecution, onError, template }) => {
  const isDesktopView = isDesktopViewPort();
  const token = useToken();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const [stopExecution] = useStopExecutionMutation();

  const { convertedTimestamp } = useTimestampConverter();
  const createdAt = convertedTimestamp(new Date());
  const [chatExpanded, setChatExpanded] = useState(true);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);
  const [generatingResponse, setGeneratingResponse] = useState<PromptLiveResponse>({
    created_at: new Date(),
    data: [],
  });
  const [newExecutionId, setNewExecutionId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [queuedMessages, setQueuedMessages] = useState<IMessage[]>([]);
  const [isSimulaitonStreaming, setIsSimulaitonStreaming] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [disableChatInput, setDisableChatInput] = useState(false);
  const [standingQuestions, setStandingQuestions] = useState<UpdatedQuestionTemplate[]>([]);
  const [varyOpen, setVaryOpen] = useState(false);

  const currentAnsweredInputs = useAppSelector(state => state.template.answeredInputs);

  let abortController = useRef(new AbortController());

  const addToQueuedMessages = (messages: IMessage[]) => {
    setQueuedMessages(messages);
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
  const [templateQuestions, _inputs, promptHasContent]: [UpdatedQuestionTemplate[], IPromptInput[], Boolean] =
    useMemo(() => {
      if (!template) {
        return [[], [], false];
      }

      const questions: TemplateQuestions[] = template?.questions ?? [];
      const inputs: IPromptInput[] = [];
      let promptHasContent = false;

      template.prompts.forEach(prompt => {
        if (prompt.content) {
          promptHasContent = true;
        }
        inputs.push(...getInputsFromString(prompt.content).map(obj => ({ ...obj, prompt: prompt.id })));
      });

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

      return [updatedQuestions, inputs, promptHasContent];
    }, [template]);

  useEffect(() => {
    dispatchNewExecutionData(answers, _inputs);
  }, [template]);

  useEffect(() => {
    if (answers.length) {
      setGeneratedExecution(generatingResponse);
    }
  }, [generatingResponse]);

  useEffect(() => {
    if (currentQuestion && (currentQuestion.type === "choices" || currentQuestion.type === "code")) {
      setUserAnswer("");
      setDisableChatInput(true);
    } else setDisableChatInput(false);
  }, [currentQuestionIndex]);

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
  const disabledButton = _inputs.length !== 0 || promptHasContent;

  const validateAnswer = async () => {
    if (currentQuestion) {
      const payload = {
        question: currentQuestion.question,
        answer: userAnswer,
      };

      return await generate({ token, payload });
    }
  };

  const validateVary = async (variation: string) => {
    if (variation) {
      setIsValidatingAnswer(true);

      const questionAnswerMap: Record<string, string | number> = {};
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
        onError("Oopps, something happened. Please try again!");
        setIsValidatingAnswer(false);
        return;
      }

      let answeredInputs: AnsweredInputType[] = [];
      const newAnswers = templateQuestions
        .map(question => {
          const answer = varyResponse[question.name];

          if (answer) {
            answeredInputs.push({
              promptId: question.prompt,
              inputName: question.name,
              value: answer,
            });
          }
          return {
            inputName: question.name,
            required: question.required,
            question: question.question,
            prompt: question.prompt,
            answer,
          };
        })
        .filter(answer => answer.answer !== "");

      dispatch(updateAnsweredInput(answeredInputs));
      setAnswers(newAnswers);
      setIsValidatingAnswer(false);
    }
  };

  const modifyStoredInputValue = (answer: IAnswer) => {
    const { inputName, prompt, answer: value } = answer;
    const newValue: AnsweredInputType = {
      promptId: prompt,
      value,
      inputName,
    };

    const existingIndex = currentAnsweredInputs.findIndex(
      item => item.promptId === prompt && item.inputName === inputName,
    );

    const updatedAnsweredInputs = [...currentAnsweredInputs];

    if (existingIndex !== -1) {
      const updatedItem = { ...updatedAnsweredInputs[existingIndex], value: value };
      updatedAnsweredInputs[existingIndex] = updatedItem;
    } else {
      updatedAnsweredInputs.push({ ...newValue });
    }

    dispatch(updateAnsweredInput(updatedAnsweredInputs));
  };

  const handleUserResponse = async () => {
    if (userAnswer.trim() === "" || isSimulaitonStreaming) {
      return;
    }
    setUserAnswer("");

    if (currentQuestion) {
      setIsValidatingAnswer(true);

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

            addToQueuedMessages(queuedMessages.concat(nextMessage));
          } else {
            nextBotMessage = nextMessage;
          }
        }
        modifyStoredInputValue(newAnswer);
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
      setIsValidatingAnswer(false);
    }
  };

  const handleChange = (value: string) => {
    if (isSimulaitonStreaming) {
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
      modifyStoredInputValue(newAnswer);
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
                const activePromptIndex = prevState.data.findIndex(promptData => promptData.prompt === +prompt);

                if (activePromptIndex === -1) {
                  prevState.data.push({ message, prompt, created_at: new Date() });
                } else {
                  prevState.data[activePromptIndex].message += message;
                }

                return { id: prevState.id, created_at: prevState.created_at, data: [...prevState.data] };
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
              const activePromptIndex = prevState.data.findIndex(promptData => promptData.prompt === +prompt);

              if (message === "[INITIALIZING]") {
                if (activePromptIndex === -1) {
                  prevState.data.push({
                    message: "",
                    prompt,
                    isLoading: true,
                    created_at: new Date(),
                  });
                } else {
                  prevState.data[activePromptIndex].isLoading = true;
                }
              }

              if (message === "[C OMPLETED]" || message === "[COMPLETED]") {
                prevState.data[activePromptIndex].isLoading = false;
                prevState.data[activePromptIndex].isCompleted = true;
              }

              return { id: prevState.id, created_at: prevState.created_at, data: [...prevState.data] };
            });
          }
        } catch {
          console.error(msg);
          // TODO: this is triggered event when there is no error
          // onError(msg.data.slice(0, 100));
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

    const answer: IAnswer = {
      question: selectedAnswer.question,
      required: selectedAnswer.required,
      inputName: selectedAnswer.inputName,
      prompt: selectedAnswer.prompt,
      answer: "",
    };

    modifyStoredInputValue(answer);

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
      {...(isDesktopView && { border: "1px solid rgba(225, 226, 236, .5)" })}
    >
      <Accordion
        expanded={chatExpanded}
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
              {!chatExpanded ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}

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
            maxHeight: { xs: "70vh", md: "35svh" },
            ...(!isDesktopView && { minHeight: { xs: `calc(100vh - ${BottomTabsMobileHeight} )` } }),
            borderTop: { xs: "none", md: "2px solid #ECECF4" },
          }}
        >
          <ChatInterface
            messages={messages}
            onChange={handleChange}
            setIsSimulaitonStreaming={setIsSimulaitonStreaming}
          />
          <VaryModal
            open={varyOpen}
            setOpen={setVaryOpen}
            onSubmit={variationTxt => validateVary(variationTxt)}
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
              onVary={() => setVaryOpen(true)}
              showGenerate={Boolean((showGenerateButton || canShowGenerateButton) && currentUser?.id)}
              onGenerate={generateExecutionHandler}
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
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default memo(ChatMode);
