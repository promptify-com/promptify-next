import React, { ReactElement, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

interface ICard {
  name: string;
  icon: ReactElement;
  id: number;
  checkedPrompts: number[];
  setCheckedPrompts: (value: number[]) => void;
}

const PromptsCard = ({ name, icon, id, checkedPrompts, setCheckedPrompts }: ICard) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(checkedPrompts.find(e => e === id) !== undefined);
  }, [checkedPrompts]);

  const checkCard = () => {
    if (!checked) {
      setCheckedPrompts([...checkedPrompts, id]);
    } else {
      setCheckedPrompts(checkedPrompts.filter(e => e !== id));
    }
  };

  return (
    <Box
      display="flex"
      sx={{
        height: "142px",
        width: { xs: "100%", sm: "90%" },
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px 16px",
        gap: "16px",
        border: checked ? "2px solid #BCBCBC" : "2px solid rgba(59, 64, 80, 0.15)",
        borderRadius: "16px",
      }}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      onClick={checkCard}
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

export default PromptsCard;
