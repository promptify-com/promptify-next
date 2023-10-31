import React from "react";
import { Box, Divider, InputLabel } from "@mui/material";
import { GeneratorParamSlider } from "./GeneratorParamSlider";
import { PromptParams, ResOverrides } from "@/core/api/dto/prompts";

interface GeneratorParamProps {
  promptId: number;
  params: PromptParams[];
  nodeParams: ResOverrides[];
  setNodeParams: (data: ResOverrides[]) => void;
}

export const GeneratorParam: React.FC<GeneratorParamProps> = ({ promptId, params, nodeParams, setNodeParams }) => {
  const handleChangeScore = (score: number, parameter: number) => {
    const updatedNodeParams = [...nodeParams];
    let nodeParam = updatedNodeParams.find(_nodeParam => _nodeParam.id === promptId);

    if (!nodeParam) {
      nodeParam = { id: promptId, contextual_overrides: [] };
      updatedNodeParams.push(nodeParam);
    }

    const matchingContext = nodeParam.contextual_overrides.find(
      contextual_override => contextual_override.parameter === parameter,
    );

    if (matchingContext) {
      matchingContext.score = score;
    } else {
      nodeParam.contextual_overrides.push({ parameter, score });
    }

    setNodeParams(updatedNodeParams);
  };

  if (params.length === 0) return null;

  return (
    <Box>
      {params?.map((param, i) => {
        const nodeParam = nodeParams.find(_nodeParam => _nodeParam.id === promptId);
        let activeScoreParam = param.score; // default value

        if (nodeParam) {
          const matchingContext = nodeParam.contextual_overrides.find(
            contextual_override => contextual_override.parameter === param.parameter.id,
          );

          if (matchingContext) {
            activeScoreParam = matchingContext.score;
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
                descriptions={param.parameter.score_descriptions}
                activeScore={activeScoreParam}
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
