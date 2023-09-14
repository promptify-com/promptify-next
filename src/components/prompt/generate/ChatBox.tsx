import React, { useState, useMemo, memo, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  IconButton,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { useWindowSize } from "usehooks-ts";
import { ExpandLess, ExpandMore, MoreVert, Search } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { ResPrompt } from "@/core/api/dto/prompts";
import { LogoApp } from "@/assets/icons/LogoApp";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { RootState } from "@/core/store";
import { useAppSelector } from "@/hooks/useStore";
import useToken from "@/hooks/useToken";
import { generate } from "@/common/helpers/chatAnswersValidator";
import useTimestampConverter from "@/hooks/useTimestampConverter";
import { ChatInterface } from "./ChatInterface";
import { ChatInput } from "./ChatInput";
import { useRouter } from "next/router";
import { TemplateQuestions } from "@/core/api/dto/templates";
import { getInputsFromString } from "@/common/helpers";
import { IPromptInput, PromptLiveResponse, ChatMessageType } from "@/common/types/prompt";
import { useAppDispatch } from "@/hooks/useStore";
import { setGeneratingStatus } from "@/core/store/templatesSlice";

export interface IMessage {
  text: string | undefined;
  createdAt: string;
  fromUser: boolean;
  type?: ChatMessageType;
  choices?: string[];
  id: number;
}

export interface IAnswer {
  inputName: string;
  required?: boolean;
  question: string;
  answer: string | number;
  prompt?: number;
}

interface Props {
  setGeneratedExecution: (data: PromptLiveResponse) => void;
  onError: (errMsg: string) => void;
}

const ChatMode: React.FC<Props> = ({ setGeneratedExecution, onError }) => {
  const { width: windowWidth } = useWindowSize();
  const { convertedTimestamp } = useTimestampConverter();
  const token = useToken();
  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const template = useAppSelector(state => state.template.template);
  const createdAt = convertedTimestamp(new Date());
  const dispatch = useAppDispatch();
  const [generatingResponse, setGeneratingResponse] = useState<PromptLiveResponse | null>(null);
  const [newExecutionId, setNewExecutionId] = useState<number | null>(null);
  const [chatExpanded, setChatExpanded] = useState(true);
  const [showGenerate, setShowGenerate] = useState(false);

  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [userAnswer, setUserAnswer] = useState("");

  const [messages, setMessages] = useState<IMessage[]>([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [isValidating, setInValidating] = useState(false);
  //@ts-ignore
  const templateQuestions: TemplateQuestions[] = useMemo(() => {
    let questions: TemplateQuestions[] = [];

    if (template?.questions) {
      questions = template.questions;
    }

    const prompts: IPromptInput[] = [];

    if (template?.prompts) {
      template.prompts.forEach(prompt => {
        prompts.push(...getInputsFromString(prompt.content).map(obj => ({ ...obj, prompt: prompt.id })));
      });
    }

    const updatedQuestions = questions.map((question, index) => {
      if (prompts[index]) {
        const { type, required, choices, name, prompt } = prompts[index];
        // Create a new object with the desired structure
        return {
          ...question,
          [Object.keys(question)[0]]: {
            ...question[Object.keys(question)[0]],
            name,
            required,
            type,
            choices,
            prompt,
          },
        };
      }
      return question;
    });

    return updatedQuestions;
  }, [template]);
  const hasInitialTemplateQuestions = templateQuestions.length;

  if (messages.length === 0) {
    const welcomeMessage = [
      {
        text: `Hi, ${
          currentUser?.first_name ?? currentUser?.username ?? "There"
        }. Welcome. I can help you with your template`,
        type: "text" as ChatMessageType,
        createdAt: createdAt,
        fromUser: false,
        id: 0,
      },
    ];

    if (hasInitialTemplateQuestions) {
      const firstKey = Object.keys(templateQuestions[0])[0];
      const firstQuestion = templateQuestions[0][firstKey];

      welcomeMessage.push({
        text: firstQuestion.question,
        type: firstQuestion.type!,
        createdAt: createdAt,
        fromUser: false,
        id: 1,
      });
    }

    setMessages(welcomeMessage);
  }

  const getCurrentQuestion = () => {
    if (!hasInitialTemplateQuestions) {
      return null;
    }

    if (!answers.length) {
      const questionObj = templateQuestions[0];
      const key = Object.keys(questionObj)[0];
      return questionObj[key];
    } else if (currentQuestionIndex < templateQuestions.length) {
      const questionObj = templateQuestions[currentQuestionIndex];
      const key = Object.keys(questionObj)[0];
      return questionObj[key];
    }
    return null;
  };

  const currentQuestion = getCurrentQuestion();

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
    if (userAnswer.trim() === "") {
      return;
    }

    setUserAnswer("");

    if (currentQuestion) {
      setInValidating(true);

      const newUserMessage: IMessage = {
        text: userAnswer,
        type: currentQuestion.type,
        createdAt: createdAt,
        fromUser: true,
        id: currentQuestionIndex + 1,
      };

      setMessages(prevMessages => prevMessages.concat(newUserMessage));

      let response:
        | {
            answer: string;
            feedback: string;
            approved: boolean;
          }
        | undefined = { approved: true, answer: "", feedback: "" };
      if (currentQuestion.type !== "choices" && currentQuestion.type !== "code" && currentQuestion.required) {
        response = await validateAnswer();
      }

      let nextBotMessage: IMessage;
      if (response?.approved) {
        setInValidating(false);

        answers.length && setCurrentQuestionIndex(currentQuestionIndex + 1);

        const newAnswer: IAnswer = {
          question: currentQuestion.question,
          answer: userAnswer,
          required: currentQuestion.required,
          inputName: currentQuestion.name,
          prompt: currentQuestion.prompt,
        };
        setAnswers(prevAnswers => prevAnswers.concat(newAnswer));

        const questionObj = templateQuestions[answers.length ? currentQuestionIndex + 1 : currentQuestionIndex];

        if (!questionObj) {
          nextBotMessage = {
            text: "Great, we can start template",
            type: "text",
            createdAt: createdAt,
            fromUser: false,
            id: currentQuestionIndex + 1,
          };
          !showGenerate && setShowGenerate(true);
        } else {
          const nextQuestion = questionObj[Object.keys(questionObj)[0]];

          if (!nextQuestion.required && !showGenerate) {
            setShowGenerate(true);
          }

          nextBotMessage = {
            text: response.feedback + nextQuestion.question,
            choices: nextQuestion.choices,
            type: nextQuestion.type,
            createdAt: createdAt,
            fromUser: false,
            id: currentQuestionIndex + 1,
          };
        }
      } else {
        // Please handle !answerResponse.approved case
        setInValidating(false);

        nextBotMessage = {
          text: response?.feedback,
          choices: currentQuestion.choices,
          type: currentQuestion.type,
          createdAt: createdAt,
          fromUser: false,
          id: currentQuestionIndex + 1,
        };
      }
      setMessages(prevMessages => prevMessages.concat(nextBotMessage));
    }
  };

  const handleChange = (value: string) => {
    if (currentQuestion && (currentQuestion.type === "choices" || currentQuestion.type === "code")) {
      const questionObj = templateQuestions[answers.length ? currentQuestionIndex + 1 : currentQuestionIndex];
      let nextBotMessage: IMessage;

      if (!questionObj) {
        nextBotMessage = {
          text: "Great, we can start template",
          type: "text",
          createdAt: createdAt,
          fromUser: false,
          id: currentQuestionIndex + 1,
        };
        !showGenerate && setShowGenerate(true);
      } else {
        const nextQuestion = questionObj[Object.keys(questionObj)[0]];

        if (!nextQuestion.required && !showGenerate) {
          setShowGenerate(true);
        }

        nextBotMessage = {
          text: nextQuestion.question,
          choices: nextQuestion.choices,
          type: nextQuestion.type,
          createdAt: createdAt,
          fromUser: false,
          id: currentQuestionIndex + 1,
        };
      }
      let newAnswer: IAnswer = {
        question: currentQuestion.question,
        required: currentQuestion.required,
        inputName: currentQuestion.name,
        answer: value,
        prompt: currentQuestion.prompt,
      };
      setAnswers(prevAnswers => prevAnswers.concat(newAnswer));
      answers.length && setCurrentQuestionIndex(currentQuestionIndex + 1);

      setMessages(prevMessages => prevMessages.concat(nextBotMessage));
    }
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

  useEffect(() => {
    if (generatingResponse) setGeneratedExecution(generatingResponse);
  }, [generatingResponse]);

  useEffect(() => {
    if (newExecutionId) {
      setGeneratingResponse(prevState => ({
        id: newExecutionId,
        created_at: prevState?.created_at || new Date(),
        data: prevState?.data || [],
      }));
    }
  }, [newExecutionId]);

  const generateExecution = (executionData: ResPrompt[]) => {
    let tempData: any[] = [];
    let url = `https://api.promptify.com/api/v1/templates/${template!.id}/execute/`;

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
        setChatExpanded(false);

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
        dispatch(setGeneratingStatus(false));
        onError("Something went wrong. Please try again later");
        throw err; // rethrow to stop the operation
      },
      onclose() {
        dispatch(setGeneratingStatus(false));
      },
    });
  };

  return (
    <Grid
      width={"100%"}
      overflow={"hidden"}
      borderRadius={"16px"}
      position={"relative"}
    >
      <Accordion
        expanded={windowWidth < 960 ? true : chatExpanded}
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
            <Grid>
              <IconButton
                onClick={e => {
                  e.stopPropagation();
                }}
                size="small"
                sx={{
                  border: "none",
                }}
              >
                <Search />
              </IconButton>
              <IconButton
                onClick={e => {
                  e.stopPropagation();
                }}
                size="small"
                sx={{
                  border: "none",
                }}
              >
                <MoreVert />
              </IconButton>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "8px",
            maxHeight: { xs: "70vh", md: "calc(100vh - (194px))" },
            minHeight: { xs: "calc(100vh - 240px)", md: "auto" },
            borderTop: { xs: "none", md: "2px solid #ECECF4" },
          }}
        >
          <ChatInterface
            messages={messages}
            answers={answers}
            onAnswerClear={() => {}}
            onChange={handleChange}
            showGenerate={showGenerate || !hasInitialTemplateQuestions}
            onGenerate={generateExecutionHandler}
            isValidating={isValidating}
          />

          {currentUser?.id ? (
            <ChatInput
              onChange={setUserAnswer}
              value={userAnswer}
              onSubmit={handleUserResponse}
              disabled={isValidating || !hasInitialTemplateQuestions}
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
