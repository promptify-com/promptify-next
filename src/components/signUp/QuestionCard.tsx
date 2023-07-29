import React, { ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import { ICheckedQA, IQuestion } from "@/common/types";
import Image from "next/image";

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
        display: "flex",
        padding: "24px 16px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
        flex: "1 0 0",
      }}
      borderRadius="16px"
      border={
        checkedOptions[question.id] === id
          ? "1px solid #375CA9"
          : "2px solid var(--primary-20, rgba(55, 92, 169, 0.20))"
      }
      onClick={() => checkCard(id)}
    >
      <Image
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "100px",
        }}
        alt="Image"
        src={require(`../../assets/images/animals/${name}.png`)}
      />

      <Typography
        sx={{
          fontFamily: "Poppins",
          fontStyle: "normal",
          fontWeight: 500,
          fontSize: "18px",
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
