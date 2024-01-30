import { Box, Typography } from "@mui/material";
import React from "react";

const Help = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "815px",
        padding: "var(--2, 16px) var(--3, 24px)",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "24px",
        alignSelf: "stretch",
        bgcolor: "surface.1",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: "#000",
          fontFeatureSettings: "'clig' off, 'liga' off",
          fontFamily: "Poppins",
          fontSize: "12px",
          fontStyle: "normal",
          fontWeight: "400",
          lineHeight: "166%",
          letterSpacing: "0.4px",
        }}
      >
        Home
      </Typography>

      <Typography
        variant="h4"
        sx={{
          color: "#000",
          fontFeatureSettings: "'clig' off, 'liga' off",
          fontFamily: "Poppins",
          fontSize: "34px",
          fontStyle: "normal",
          fontWeight: "400",
          lineHeight: "120%",
        }}
      >
        Get Started
      </Typography>

      <Typography
        variant="body2"
        sx={typographyStyle}
      >
        Each prompt builds on the last, passing context between them. Responses get progressively more detailed and
        nuanced.
      </Typography>

      <Typography
        variant="body2"
        sx={typographyStyle}
      >
        It's like asking a series of logical follow-up questions, leading the AI through a reasoning process.
      </Typography>

      <Typography
        variant="body2"
        sx={typographyStyle}
      >
        Build chains from reusable template prompts or by capturing previous outputs as variables.
      </Typography>

      <Typography
        variant="body2"
        sx={typographyStyle}
      >
        The result - sophisticated content tailored to your needs, without losing relevance across long texts.
      </Typography>

      <Typography
        variant="body2"
        sx={typographyStyle}
      >
        Chains transform AI writing from rambling monologues to structured dialogues. Progressively direct the AI and
        watch ideas blossom.
      </Typography>
    </Box>
  );
};

const typographyStyle = {
  color: "var(--onSurface, #1B1B1E)",
  fontFeatureSettings: "'clig' off, 'liga' off",
  fontFamily: "Poppins",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "140%",
  letterSpacing: "0.2px",
};

export default Help;
