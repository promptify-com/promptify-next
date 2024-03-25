import React, { ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import { IQuestion } from "@/common/types";
import Image from "@/components/design-system/Image";
import defaultAvatar from "@/assets/images/default-avatar.jpg";

interface ICard {
  name: string;
  icon: ReactElement;
  id: number;
  question: IQuestion;
  selectedOptionId: number | null;
  setSelectedOptionId: React.Dispatch<React.SetStateAction<number | null>>;
}

const AVAILABLE_OPTION_IMGS = [
  "Countryside",
  "Movies",
  "Batman",
  "Summer",
  "Dolphin",
  "Elephant",
  "Lion",
  "City",
  "Yellow",
  "Books",
  "Blue",
  "Winter",
  "Owl",
  "Spider-Man",
  "Live+Performances",
  "Spring",
  "Video Games",
  "Beach",
  "Video+Games",
  "Green",
  "Mountains",
  "Wonder Woman",
  "Superman",
  "Wonder+Woman",
  "Autumn",
  "Live Performances",
  "Red",
];

const QuestionCard = ({ name, id, selectedOptionId, setSelectedOptionId }: ICard) => {
  const selectedImageSrc = AVAILABLE_OPTION_IMGS.includes(name) ? `/assets/images/animals/${name}.jpg` : defaultAvatar;

  return (
    <Box
      sx={{
        display: "flex",
        width: "194px",
        height: "163px",
        padding: "24px 16px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
      }}
      borderRadius="16px"
      border={
        selectedOptionId === id
          ? "1px solid var(--onSurface, #1B1B1F)"
          : "1px solid var(--surfaceContainerHighest, #E3E2E6)"
      }
      onClick={() => setSelectedOptionId(id)}
    >
      <Image
        src={`${selectedImageSrc}`}
        alt={name}
        priority={false}
        width={120}
        height={120}
        style={{ borderRadius: "100px" }}
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
