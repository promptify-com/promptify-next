import React, { useState, useMemo } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Grid, IconButton, Typography } from "@mui/material";
import { useWindowSize } from "usehooks-ts";
import { ExpandLess, ExpandMore, MoreVert, Search } from "@mui/icons-material";
import { useSelector } from "react-redux";

import { RootState } from "@/core/store";
import { useAppSelector } from "@/hooks/useStore";
import useToken from "@/hooks/useToken";
import { generate } from "@/common/helpers/chatAnswersValidator";
import useTimestampConverter from "@/hooks/useTimestampConverter";
import { ChatMessages } from "./ChatInterface";
import { ChatInput } from "./ChatInput";

import { TemplateQuestions } from "@/core/api/dto/templates";
import { getInputsFromString } from "@/common/helpers";
import { IPromptInput } from "@/common/types/prompt";

export interface Message {
  type?: "text" | "choices" | "number" | "code";
  text: string;
  createdAt: string;
  fromUser: boolean;
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

  const [messages, setMessages] = useState<Message[]>([]);

  const createdAt = convertedTimestamp(new Date());

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
        return {
          ...question,
          required: prompts[index].required,
          type: prompts[index].type,
        };
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
    if (userAnswer.trim() === "") {
      return;
    }
    if (currentQuestion) {
      const newUserMessage: Message = {
        text: userAnswer,
        createdAt: createdAt,
        fromUser: true,
      };

      setMessages(prevMessages => [...prevMessages, newUserMessage]);

      let approved = true;
      if (approved) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer("");
        let newAnswer = { question: currentQuestion.question, answer: userAnswer };
        setAnswers(prevAnswers => [...prevAnswers, newAnswer]);

        const nextBotMessage: Message = {
          text: currentQuestion.question,
          type: currentQuestion.type,
          createdAt: createdAt,
          fromUser: false,
        };

        setMessages(prevMessages => prevMessages.concat(nextBotMessage));
      } else {
        // Please handle !answerResponse.approved case
        const nextBotMessage = {
          text: currentQuestion.question,
          createdAt: createdAt,
          fromUser: false,
        };
        setUserAnswer("");
        setMessages(prevMessages => prevMessages.concat(nextBotMessage));
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
            onSubmit={handleUserResponse}
          />
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};
