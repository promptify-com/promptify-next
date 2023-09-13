import React, { useState, useMemo } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useWindowSize } from "usehooks-ts";
import { Clear, ExpandLess, ExpandMore, MoreVert, Search } from "@mui/icons-material";
import { useSelector } from "react-redux";

import { RootState } from "@/core/store";
import { useAppSelector } from "@/hooks/useStore";
import useToken from "@/hooks/useToken";
import { generate } from "@/common/helpers/chatAnswersValidator";
import useTimestampConverter from "@/hooks/useTimestampConverter";
import { ChatInterface } from "./ChatInterface";
import { ChatInput } from "./ChatInput";

import { TemplateQuestions } from "@/core/api/dto/templates";
import { getInputsFromString } from "@/common/helpers";
import { IPromptInput } from "@/common/types/prompt";
import { LogoApp } from "@/assets/icons/LogoApp";

export interface IMessage {
  text: string | undefined;
  createdAt: string;
  fromUser: boolean;
  type?: "text" | "choices" | "number" | "code";
  choices?: string[];
}

export interface IAnswer {
  inputName: string;
  required?: boolean;
  question: string;
  answer: string | number;
}

export const ChatMode: React.FC = () => {
  const { width: windowWidth } = useWindowSize();
  const { convertedTimestamp } = useTimestampConverter();
  const token = useToken();

  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const template = useAppSelector(state => state.template.template);
  const createdAt = convertedTimestamp(new Date());

  const [chatExpanded, setChatExpanded] = useState(true);

  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [userAnswer, setUserAnswer] = useState("");

  const [messages, setMessages] = useState<IMessage[]>([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  //@ts-ignore
  const templateQuestions: TemplateQuestions[] = useMemo(() => {
    let questions: TemplateQuestions[] = [];

    if (template?.questions) {
      questions = questions.concat(template.questions);
    }

    const prompts: IPromptInput[] = [];

    if (template?.prompts) {
      template.prompts.forEach(prompt => {
        prompts.push(...getInputsFromString(prompt.content));
      });
    }

    const updatedQuestions = questions.map((question, index) => {
      if (prompts[index]) {
        const { type, required, choices, name } = prompts[index];
        // Create a new object with the desired structure
        const updatedQuestion = {
          ...question,
          [Object.keys(question)[0]]: {
            ...question[Object.keys(question)[0]],
            name,
            required,
            type,
            choices,
          },
        };
        return updatedQuestion;
      }
      return question;
    });

    return updatedQuestions;
  }, [template]);

  if (templateQuestions.length > 0 && messages.length === 0) {
    const firstKey = Object.keys(templateQuestions[0])[0];
    const firstQuestion = templateQuestions[0][firstKey];
    setMessages([
      {
        text: `Hi, ${currentUser?.username}. Welcome. I can help you with your template`,
        type: "text",
        createdAt: createdAt,
        fromUser: false,
      },
      {
        text: firstQuestion.question,
        type: firstQuestion.type,
        createdAt: createdAt,
        fromUser: false,
      },
    ]);
  }

  const getCurrentQuestion = () => {
    if (currentQuestionIndex < templateQuestions.length) {
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
    setUserAnswer("");
    if (userAnswer.trim() === "") {
      return;
    }
    if (currentQuestion) {
      const newUserMessage: IMessage = {
        text: userAnswer,
        type: currentQuestion.type,
        createdAt: createdAt,
        fromUser: true,
      };

      setMessages(prevMessages => [...prevMessages, newUserMessage]);
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
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer("");
        let newAnswer: IAnswer = {
          question: response.feedback + " " + currentQuestion.question,
          answer: userAnswer,
          required: currentQuestion.required,
          inputName: currentQuestion.name,
        };
        setAnswers(prevAnswers => [...prevAnswers, newAnswer]);

        nextBotMessage = {
          text: currentQuestion.question,
          choices: currentQuestion.choices,
          type: currentQuestion.type,
          createdAt: createdAt,
          fromUser: false,
        };
      } else {
        // Please handle !answerResponse.approved case
        nextBotMessage = {
          text: response?.feedback,
          choices: currentQuestion.choices,
          type: currentQuestion.type,
          createdAt: createdAt,
          fromUser: false,
        };
      }
      setMessages(prevMessages => prevMessages.concat(nextBotMessage));
    }
  };

  const handleChange = (value: string) => {
    if (currentQuestion) {
      let newAnswer: IAnswer = {
        question: currentQuestion.question,
        required: currentQuestion.required,
        inputName: currentQuestion.name,
        answer: value,
      };
      setAnswers(prevAnswers => [...prevAnswers, newAnswer]);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      const nextBotMessage = {
        text: currentQuestion.question,
        createdAt: createdAt,
        fromUser: false,
      };
      setMessages(prevMessages => prevMessages.concat(nextBotMessage));
    }
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
            borderTop: { xs: "none", md: "2px solid #ECECF4" },
          }}
        >
          <ChatInterface
            messages={messages}
            answers={answers}
            onAnswerClear={() => {}}
            onChange={handleChange}
            showGenerate={false}
            onGenerate={() => {}}
          />

          <ChatInput
            onChange={setUserAnswer}
            value={userAnswer}
            onSubmit={handleUserResponse}
          />
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};
