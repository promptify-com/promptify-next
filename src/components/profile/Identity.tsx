import { Box, Typography } from "@mui/material";
import { IOption, IQuestion } from "@/common/types";
import { useQuestions } from "@/hooks/api/questions";
import { useUserAnswers } from "@/hooks/api/user";
import { IdentityItem } from "../profile2/IdentityItem";

export const Identity = () => {
  const [questions] = useQuestions();
  const [answers] = useUserAnswers();

  const getUserAnswer = (question: IQuestion) => {
    return answers.find(answer => answer.question.id === question.id)?.option;
  };

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
            alignItems: { xs: "start", sm: "flex-start" },
            gap: "16px",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 500,
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
              textAlign: "start",
              letterSpacing: "0.17px",
              color: "onSurface",
            }}
          >
            Identity for Personalized AI at Promptify, blah blah blah, short description in 3 rows to fill in the
            information, and personalization will improve the data output by 34 percent
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
            {questions.map(question => {
              return (
                <IdentityItem
                  key={question.id}
                  question={question}
                  defaultAnswer={getUserAnswer(question)}
                />
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
