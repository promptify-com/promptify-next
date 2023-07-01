import React, { ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import { ICheckedQA, IQuestion } from "@/common/types";

interface ICard {
  name: string;
  icon: ReactElement;
  id: number;
  question: IQuestion;
  checkedOptions: ICheckedQA;
  setCheckedOptions: React.Dispatch<React.SetStateAction<ICheckedQA>>;
}

const QuestionCard = ({
  name,
  icon,
  question,
  id,
  checkedOptions,
  setCheckedOptions,
}: ICard) => {
  const checkCard = (optionId: number) => {
    setCheckedOptions((current: ICheckedQA) => ({
      ...current,
      [question.id]: optionId,
    }));
  };

  return (
    <Box
      display="flex"
      sx={{
        height: { xs: "110px", sm: "120px" },
        width: { xs: "100%", sm: "100%" },
      }}
      borderRadius="10px"
      border={
        checkedOptions[question.id] === id
          ? "2px solid #BCBCBC"
          : "2px solid rgba(59, 64, 80, 0.15)"
      }
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      onClick={() => checkCard(id)}
    >
      <Box>{icon}</Box>

      <Typography
        sx={{
          fontFamily: "Poppins",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: "16px",
          lineHeight: "150%",
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          letterSpacing: "0.15px",
          color: "#1D2028",
        }}
      >
        {name}
      </Typography>
    </Box>
  );
};

export default QuestionCard;
