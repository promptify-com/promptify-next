import React, { useState, useMemo, memo, useEffect, useRef } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography, Button, Stack } from "@mui/material";
import { Block, ExpandLess, ExpandMore } from "@mui/icons-material";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useRouter } from "next/router";

import { ResPrompt } from "@/core/api/dto/prompts";
import { LogoApp } from "@/assets/icons/LogoApp";
import { useAppSelector, useAppDispatch } from "@/hooks/useStore";
import useToken from "@/hooks/useToken";
import { generate } from "@/common/helpers/chatAnswersValidator";
import useTimestampConverter from "@/hooks/useTimestampConverter";
import { ChatInterface } from "./ChatInterface";
import { ChatInput } from "./ChatInput";
import { TemplateQuestions, Templates, UpdatedQuestionTemplate } from "@/core/api/dto/templates";
import { getInputsFromString } from "@/common/helpers/getInputsFromString";
import { IPromptInput, PromptLiveResponse, InputType, AnsweredInputType } from "@/common/types/prompt";
import { setGeneratingStatus, updateAnsweredInput, updateExecutionData } from "@/core/store/templatesSlice";
import { AnswerValidatorResponse, IAnswer, IMessage } from "@/common/types/chat";
import { isDesktopViewPort } from "@/common/helpers";
import { useStopExecutionMutation } from "@/core/api/executions";
import VaryModal from "./VaryModal";
import { vary } from "@/common/helpers/varyValidator";
import { parseMessageData } from "@/common/helpers/parseMessageData";

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
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [queuedMessages, setQueuedMessages] = useState<IMessage[]>([]);
  const [isSimulaitonStreaming, setIsSimulaitonStreaming] = useState(false);
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
      const firstQuestion = questions[0];
      const { question, type, choices } = firstQuestion;
      const firstQuestionMessage: IMessage = {
        text: question,
        type,
        choices,
        createdAt: createdAt,
        fromUser: false,
      };

      if (!!welcomeMessage.length) {
        addToQueuedMessages([firstQuestionMessage]);
      } else {
        welcomeMessage.push(firstQuestionMessage);
      }
    }

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
    if (isGenerating && chatExpanded) {
      setChatExpanded(false);
    }
  }, [isGenerating]);

  useEffect(() => {
    dispatchNewExecutionData(answers, _inputs);
  }, [template]);

  useEffect(() => {
    if (answers.length) {
      setGeneratedExecution(generatingResponse);
    }
  }, [generatingResponse]);

  useEffect(() => {
    if (!isSimulaitonStreaming && !!queuedMessages.length) {
      const nextQueuedMessage = queuedMessages.pop()!;

      setMessages(prevMessages => prevMessages.concat(nextQueuedMessage));
      addToQueuedMessages(queuedMessages);
    }
  }, [isSimulaitonStreaming]);

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

  const getNextQuestion = (currentAnswers: IAnswer[]) => {
    const answeredQuestionNames = currentAnswers.map(input => input.inputName);

    const lastAnsweredQuestionName = answeredQuestionNames[answeredQuestionNames.length - 1];
    const lastAnsweredQuestionIndex = templateQuestions.findIndex(q => q.name === lastAnsweredQuestionName);

    const questionsAfterLastAnswered = templateQuestions.slice(lastAnsweredQuestionIndex + 1);
    const questionsBeforeLastAnswered = templateQuestions.slice(0, lastAnsweredQuestionIndex);

    const nextUnansweredAfter = questionsAfterLastAnswered.find(
      question => !answeredQuestionNames.includes(question.name),
    );

    if (nextUnansweredAfter) {
      return nextUnansweredAfter;
    }

    const remainingQuestion = questionsBeforeLastAnswered.find(
      question => !answeredQuestionNames.includes(question.name),
    );

    return remainingQuestion;
  };

  const handleSyncForm = (
    currentAnswers: IAnswer[],
    updatedInput: AnsweredInputType,
    targetQuestion: UpdatedQuestionTemplate,
  ) => {
    const { question, choices, type } = targetQuestion;
    const nextMessages: IMessage[] = [];

    if (currentQuestion && targetQuestion.name !== currentQuestion.name) {
      nextMessages.push({
        text: question,
        choices,
        type,
        createdAt: createdAt,
        fromUser: false,
      });
    }
    if (updatedInput.value && ["text", "number"].includes(type)) {
      nextMessages.push({
        text: updatedInput.value as string,
        choices,
        type,
        createdAt: createdAt,
        fromUser: true,
      });
    }

    const nextQuestion = getNextQuestion(currentAnswers);

    if (!nextQuestion) {
      nextMessages.push({
        text: "Great, we can start template",
        type: "text",
        createdAt: createdAt,
        fromUser: false,
      });
    } else if (targetQuestion.name !== nextQuestion.name || !currentQuestion) {
      nextMessages.push({
        text: nextQuestion.question,
        choices: nextQuestion.choices,
        type: nextQuestion.type,
        createdAt: createdAt,
        fromUser: false,
      });
    }

    setMessages(prevMessages => prevMessages.concat(nextMessages));
  };

  useEffect(() => {
    const [firstAnsweredInput] = currentAnsweredInputs;

    if (!firstAnsweredInput || firstAnsweredInput.modifiedFrom !== "input") return;

    const { inputName, promptId, value } = firstAnsweredInput;

    const targetQuestion = templateQuestions.find(question => question.name === inputName) as UpdatedQuestionTemplate;

    setAnswers(prevAnswers => {
      const indexToUpdate = prevAnswers.findIndex(answer => answer.inputName === inputName);

      if (indexToUpdate !== -1) {
        prevAnswers[indexToUpdate].answer = value;
      }
      if (value && indexToUpdate === -1 && targetQuestion) {
        prevAnswers.push({
          inputName,
          required: targetQuestion.required,
          question: targetQuestion.question,
          prompt: promptId,
          answer: value,
        });
      }

      const filteredAnswers = prevAnswers.filter(answer => Boolean(answer.answer));
      handleSyncForm(filteredAnswers, firstAnsweredInput, targetQuestion);

      return filteredAnswers;
    });
  }, [currentAnsweredInputs, templateQuestions]);

  const canShowGenerateButton = Boolean(templateQuestions.length && !templateQuestions[0].required);

  const currentQuestion = standingQuestions.length
    ? standingQuestions[standingQuestions.length - 1]
    : (getNextQuestion(answers) as UpdatedQuestionTemplate);

  const disableChat =
    Boolean(!templateQuestions.length && !_inputs.length && template?.prompts.length) ||
    ["choices", "code"].includes(currentQuestion?.type) ||
    !currentQuestion;

  const disabledButton = _inputs.length !== 0 || promptHasContent;

  const validateAnswer = async (value: string) => {
    if (currentQuestion) {
      const payload = {
        question: currentQuestion.question,
        answer: value,
      };

      return await generate({ token, payload });
    }
  };

  const validateVary = async (variation: string) => {
    if (variation) {
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
        onError("Oopps, something happened. Please try again!");
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
    const { inputName, prompt: promptId, answer: value } = answer;

    const newValue: AnsweredInputType = {
      promptId,
      value,
      inputName,
      modifiedFrom: "chat",
    };

    dispatch(updateAnsweredInput([newValue]));
  };

  const handleUserInput = async (value: string) => {
    if (!currentQuestion || isSimulaitonStreaming || value.trim() === "") {
      return;
    }

    const { name: inputName, required, type, question, prompt, choices } = currentQuestion;

    const isChoiceOrCode = ["choices", "code"].includes(type);

    if (!isChoiceOrCode) {
      const newUserMessage: IMessage = {
        text: value,
        type,
        createdAt: createdAt,
        fromUser: true,
      };

      setMessages(prevMessages => prevMessages.concat(newUserMessage));
    }

    let response: AnswerValidatorResponse | undefined | string = { approved: true, answer: "", feedback: "" };

    if (!isChoiceOrCode && required) {
      setIsValidatingAnswer(true);

      response = await validateAnswer(value);
      setIsValidatingAnswer(false);

      if (typeof response === "string") {
        onError("Oopps, something happened. Please try again!");
        return;
      }
    }
    let nextBotMessage: IMessage;

    if (response?.approved) {
      const newAnswer: IAnswer = {
        question,
        required,
        inputName,
        prompt,
        answer: value,
      };
      const newAnswers: IAnswer[] = answers.concat(newAnswer);

      setAnswers(newAnswers);
      dispatchNewExecutionData(newAnswers, _inputs);

      if (standingQuestions.length) {
        standingQuestions.pop();
        setStandingQuestions(standingQuestions);
      }

      const nextQuestion = standingQuestions.length
        ? standingQuestions[standingQuestions.length - 1]
        : getNextQuestion(newAnswers);

      if (!nextQuestion) {
        nextBotMessage = {
          text: "Great, we can start template",
          type: "text",
          createdAt: createdAt,
          fromUser: false,
        };
      } else {
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
        createdAt: createdAt,
        fromUser: false,
        choices,
        type,
      };
    }
    setMessages(prevMessages => prevMessages.concat(nextBotMessage));
  };

  const generateExecutionHandler = () => {
    if (!token) {
      return router.push("/signin");
    }

    dispatch(setGeneratingStatus(true));

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
          const parseData = parseMessageData(msg.data);

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

  const handleAnswerClear = (selectedAnswer: IAnswer) => {
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

    const nextBotMessage: IMessage = {
      text: "Let's give this another go. " + askedQuestion.question,
      choices: askedQuestion.choices,
      type: askedQuestion.type,
      createdAt: createdAt,
      fromUser: false,
    };

    setMessages(prevMessages => prevMessages.concat(nextBotMessage));

    const newAnswers: IAnswer[] = answers.filter(answer => answer.inputName !== selectedAnswer.inputName);

    setAnswers(newAnswers);
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
            onChange={handleUserInput}
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
              onAnswerClear={handleAnswerClear}
              onSubmit={handleUserInput}
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
