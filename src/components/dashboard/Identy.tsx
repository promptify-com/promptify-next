import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { IdentyImg } from "@/assets/icons/identy";
import { IdentyImgIverse } from "@/assets/icons/identyInve";
import { IOption, IQuestion } from "@/common/types";
import { useQuestions } from "@/hooks/api/questions";
import { useUserAnswers } from "@/hooks/api/user";
import useUser from "@/hooks/useUser";
import { IdentityItem } from "./IdentityItem";

export const Identy = () => {
  const user = useUser();

  const [questions] = useQuestions();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [qa, error, isLoading] = useUserAnswers();

  const getUserAnswer = (question: IQuestion): IOption | null => {
    const option = qa.find(
      (userAnswer) => userAnswer?.question?.id === question.id
    )?.option;
    return option || null;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [open, setOpen] = React.useState(false);

  const prevOpen = React.useRef(open);
  const anchorRef = React.useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (prevOpen.current && !open) {
      anchorRef.current?.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      width={"100%"}
      gap={"16px"}
    >
      <Box
        display="flex"
        alignItems="center"
        flexDirection={{ xs: "column", sm: "row" }}
        width={"100%"}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { xs: "center", sm: "flex-start" },
            gap: "16px",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: { xs: 400, sm: 500 },
              fontSize: 24,
              lineHeight: { xs: "133.4%", sm: "123.5%" },
              display: "flex",
              alignItems: "center",
              color: "#1B1B1E",
            }}
          >
            Identity Setup
          </Typography>
          <Typography
            width={{ xs: "100%", sm: "100%" }}
            sx={{
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "143%",
              display: "flex",
              alignItems: "center",
              textAlign: { xs: "center", sm: "start" },
              letterSpacing: "0.17px",
              color: "#1B1B1E",
            }}
          >
            Identity for Personlized AI at Promptify, blah balh blah, short
            description in 3 rows to fill in the information, and
            personalization will improve the data output by 34 percent
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
        }}
      >
        <Box width={"100%"}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "0px 16px",
              gap: "10px",
            }}
          >
            {questions.map((question, index) => {
              return (
                <IdentityItem
                  length={questions.length}
                  question={question}
                  defaultOption={getUserAnswer(question)}
                  index={index}
                  key={question.id}
                />
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
