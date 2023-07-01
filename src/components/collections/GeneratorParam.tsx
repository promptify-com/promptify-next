import React from "react";
import { Box, Divider, InputLabel } from "@mui/material";
import { GeneratorParamSlider } from "./GeneratorParamSlider";
import { PromptParams } from "@/core/api/dto/prompts";

interface GeneratorParamProps {
  promptId: number;
  params: PromptParams[];
  resOverrides: any;
  setResOverrides: (obj: any) => void;
}

export const GeneratorParam: React.FC<GeneratorParamProps> = ({
  promptId,
  params,
  resOverrides,
  setResOverrides,
}) => {
  const handleChangeScore = (score: number, parameter: number) => {
    const newArray = [...resOverrides];
    const matchingObject = newArray.find((obj) => obj.id === promptId);

    if (matchingObject) {
      const matchingContext = matchingObject.contextual_overrides.find(
        (c: any) => c.parameter === parameter
      );
      if (matchingContext) {
        matchingContext.score = score;
      } else {
        matchingObject.contextual_overrides.push({ parameter, score });
      }
    } else {
      const newObject = {
        id: promptId,
        contextual_overrides: [{ parameter, score }],
      };
      newArray.push(newObject);
    }

    setResOverrides([...newArray]);
  };

  return params.length > 0 ? (
    <Box>
      {params?.map((params, i) => (
        <React.Fragment key={i}>
          <Divider sx={{ borderColor: "surface.3" }} />
          <Box p={"20px"} position={"relative"}>
            <InputLabel
              sx={{
                fontSize: 14,
                fontWeight: 500,
                mb: "10px",
                color: "tertiary",
              }}
            >
              {params.parameter.name}:
            </InputLabel>
            <GeneratorParamSlider
              descriptions={params.descriptions}
              activeScore={params.score}
              setScore={(score) =>
                handleChangeScore(score, params.parameter.id)
              }
              is_editable={params.is_editable}
            />
          </Box>
        </React.Fragment>
      ))}
    </Box>
  ) : null;
};
