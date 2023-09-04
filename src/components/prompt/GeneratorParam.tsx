import React, { use, useEffect } from "react";
import { Box, Divider, InputLabel } from "@mui/material";
import { GeneratorParamSlider } from "./GeneratorParamSlider";
import { PromptParams } from "@/core/api/dto/prompts";

interface GeneratorParamProps {
  promptId: number;
  params: PromptParams[];
  resOverrides: any;
  setResOverrides: (obj: any) => void;
}

export const GeneratorParam: React.FC<GeneratorParamProps> = ({ promptId, params, resOverrides, setResOverrides }) => {
  const handleChangeScore = (score: number, parameter: number) => {
    const newArray = JSON.parse(JSON.stringify(resOverrides));
    const matchingObject = newArray.find((obj: { id: number }) => obj.id === promptId);

    if (matchingObject) {
      const matchingContext = matchingObject.contextual_overrides.find((c: any) => c.parameter === parameter);

      matchingContext
        ? (matchingContext.score = score)
        : matchingObject.contextual_overrides.push({ parameter, score });
    } else {
      newArray.push({ id: promptId, contextual_overrides: [{ parameter, score }] });
    }

    setResOverrides(newArray);
  };

  if (params.length === 0) {
    return null;
  }

  return (
    <Box>
      {params?.map((param, i) => {
        const matchingObject = resOverrides.find((obj: { id: number }) => obj.id === promptId);
        let activeScoreOverride = param.score; // default value

        if (matchingObject) {
          const matchingContext = matchingObject.contextual_overrides.find(
            (c: any) => c.parameter === param.parameter.id,
          );

          if (matchingContext) {
            activeScoreOverride = matchingContext.score;
          }
        }

        return (
          <React.Fragment key={i}>
            <Divider sx={{ borderColor: "surface.3" }} />
            <Box
              p={"16px 24px 0px 16px"}
              position={"relative"}
            >
              <InputLabel sx={{ fontSize: 13, fontWeight: 500, mb: "10px", color: "tertiary" }}>
                {param.parameter.name}:
              </InputLabel>
              <GeneratorParamSlider
                descriptions={param.descriptions}
                activeScore={activeScoreOverride} // Use the override value here
                setScore={score => handleChangeScore(score, param.parameter.id)}
                is_editable={param.is_editable}
              />
            </Box>
          </React.Fragment>
        );
      })}
    </Box>
  );
};
