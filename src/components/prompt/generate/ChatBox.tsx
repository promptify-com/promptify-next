import React, { useState, useEffect } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Grid, IconButton, Typography } from "@mui/material";
import { useWindowSize } from "usehooks-ts";
import { ExpandLess, ExpandMore, MoreVert, Search } from "@mui/icons-material";
import { useSelector } from "react-redux";

import { RootState } from "@/core/store";
import { useAppSelector } from "@/hooks/useStore";
import useToken from "@/hooks/useToken";
import { data } from "./data";
import { generate } from "@/common/helpers/chatAnswersValidator";
import useTimestampConverter from "@/hooks/useTimestampConverter";
import { ChatMessages } from "./ChatInterface";
import { ChatInput } from "./ChatInput";

export interface Question {
  [key: string]: {
    question: string;
  };
}

export interface Message {
  text: string;
  createdAt: string;
  isUser: boolean;
}

interface Answer {
  inputName: string;
  question: string;
  answer: string;
}

export const ChatMode: React.FC = () => {
  const { width: windowWidth } = useWindowSize();
  const { convertedTimestamp } = useTimestampConverter();
  const token = useToken();

  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const template = useAppSelector(state => state.template.template);

  const [chatExpanded, setChatExpanded] = useState(true);
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);

  const [question, setQuestion] = useState<Question[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const createdAt = convertedTimestamp(new Date());

  useEffect(() => {
    if (data.length > 0 && question.length === 0) {
      setQuestion(prevQuestions => [...prevQuestions, ...data]);
    }
  }, [data, question]);

  useEffect(() => {
    if (question.length > 0 && messages.length === 0) {
      const secondQuestionKey = Object.keys(question[0])[0];
      const secondQuestionText = question[0][secondQuestionKey].question;
      setMessages([
        {
          text: `Hi, ${currentUser?.username}. Welcome. I can help you with your template`,
          createdAt: createdAt,
          isUser: false,
        },
        {
          text: secondQuestionText,
          createdAt: createdAt,
          isUser: false,
        },
      ]);
    }
  }, [question]);

  const getCurrentQuestion = () => {
    if (question.length > 0 && currentQuestionIndex < question.length) {
      const questionObj = question[currentQuestionIndex];
      const key = Object.keys(questionObj)[0];
      return questionObj[key].question;
    }
    return "";
  };

  const validateAnswer = async () => {
    const currentQuestion = getCurrentQuestion();
    const payload = {
      question: currentQuestion,
      answer: userAnswer,
    };

    return await generate({ token, payload });
  };

  const handleUserResponse = async () => {
    if (userAnswer.trim() === "") {
      return;
    }
    const currentQuestion = getCurrentQuestion();

    const newUserMessage = {
      inputNane: "",
      text: userAnswer,
      createdAt: createdAt,
      isUser: true,
    };

    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    const answerResponse = await validateAnswer();

    if (answerResponse.approved) {
      if (currentQuestionIndex < question.length - 1 && question.length !== currentQuestionIndex) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer("");
      }

      let newAnswer = { question: currentQuestion, answer: userAnswer };
      setAnswers(prevAnswers => [...prevAnswers, newAnswer]);

      const nextBotMessage = {
        text: answerResponse.feedback + "." + getCurrentQuestion(), // feedback ,
        createdAt: createdAt,
        isUser: false,
      };

      setMessages(prevMessages => prevMessages.concat(nextBotMessage));
    } else {
      // Please handle !answerResponse.approved case
      const nextBotMessage = {
        text: answerResponse.feedback,
        createdAt: createdAt,
        isUser: false,
      };

      setMessages(prevMessages => prevMessages.concat(nextBotMessage));
    }
  };

  return (
    <Grid
      width={"100%"}
      overflow={"hidden"}
      borderRadius={"16px"}
      minHeight={{ xs: "70vh", md: "auto" }}
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
            borderTop: { xs: "none", md: "2px solid #ECECF4" },
          }}
        >
          <ChatMessages messages={messages} />
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
