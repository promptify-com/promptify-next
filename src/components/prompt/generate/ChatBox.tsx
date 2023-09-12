import React, { useState, useEffect } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Grid, IconButton, Typography } from "@mui/material";
import { useWindowSize } from "usehooks-ts";
import { ExpandLess, ExpandMore, MoreVert, Search } from "@mui/icons-material";
import { useSelector } from "react-redux";

import { RootState } from "@/core/store";
import { useAppSelector } from "@/hooks/useStore";
import useToken from "@/hooks/useToken";
import { generate } from "@/common/helpers/generate";
import useTimestampConverter from "@/hooks/useTimestampConverter";
import { ChatMessages } from "./ChatInterface";
import { ChatInput } from "./ChatInput";
import { getInputsFromString } from "@/common/helpers";
import { IPromptInput } from "@/common/types/prompt";
import { TemplateQuestions } from "@/core/api/dto/templates";

export interface Message {
  type?: "text" | "choices" | "number" | "code";
  text: string;
  createdAt: string;
  fromUser: boolean;
}

interface Answer {
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

  const [questions, setQuestions] = useState<TemplateQuestions[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const createdAt = convertedTimestamp(new Date());

  useEffect(() => {
    if (template?.questions) {
      setQuestions(prevQuestions => [...prevQuestions, ...template.questions]);
    }
    if (questions.length > 0 && messages.length === 0) {
      const firstKey = Object.keys(questions[0])[0];
      const firstQuestion = questions[0][firstKey];
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
  }, [template, questions]);

  useEffect(() => {
    if (template) {
      let arr: IPromptInput[] = [];
      template.prompts.forEach(prompt => {
        arr = getInputsFromString(prompt.content);
      });
      console.log(arr);

      generateQuestions();
    }
  }, [template]);

  const generateQuestions = () => {
    generate({ template, token });
  };

  const getCurrentQuestion = () => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const questionObj = questions[currentQuestionIndex];
      const key = Object.keys(questionObj)[0];
      return questionObj[key];
    }
  };

  const currentQuestion = getCurrentQuestion();

  const validateAnswer = () => {
    if (currentQuestion) {
      const payload = {
        question: currentQuestion.question,
        answer: userAnswer,
      };
      generate({ template, token, isValidatingAnswer: true, payload });
    }
  };

  const handleUserResponse = () => {
    if (userAnswer.trim() === "") {
      return;
    }

    if (currentQuestion) {
      const newUserMessage: Message = {
        type: currentQuestion?.type,
        text: userAnswer,
        createdAt: createdAt,
        fromUser: true,
      };

      setMessages(prevMessages => [...prevMessages, newUserMessage]);

      validateAnswer(); //check if answer is valid or not

      const approved = true;
      if (approved) {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setUserAnswer("");
        }

        let newAnswer = { question: currentQuestion?.question, answer: userAnswer };
        setAnswers(prevAnswers => [...prevAnswers, newAnswer]);

        const nextBotMessage: Message = {
          type: currentQuestion.type,
          text: currentQuestion.question,
          createdAt: createdAt,
          fromUser: false,
        };

        setMessages(prevMessages => [...prevMessages, nextBotMessage]);
      }
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
            onSubmit={() => handleUserResponse()}
          />
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};
