import React from "react";
import { Card, Grid } from "@mui/material";

import { PresetType } from "@/common/types/builder";
import { IVariable } from "@/common/types/prompt";
import { Options } from "@/components/common/Options";

interface Props {
  suggestionList: IVariable[];
  position: { x: number; y: number } | null;
  optionType: PresetType | null;
  onSelect: (option: IVariable) => void;
}

export const SuggestionsList = ({ suggestionList, position, optionType, onSelect }: Props) => {
  return (
    <Grid>
      {suggestionList.length > 0 && position && (
        <Card
          elevation={2}
          sx={{
            padding: "16px",
            maxWidth: "200px",
            zIndex: 999,
            bgcolor: "surface.1",
            maxHeight: "300px",
            overflow: "auto",
            position: "absolute",
            top: position.y + "px",
            left: position.x + "px",

            "&::-webkit-scrollbar": {
              width: "4px",
              p: 1,
              backgroundColor: "surface.1",
            },
            "&::-webkit-scrollbar-track": {
              webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "surface.5",
              outline: "1px solid surface.3",
              borderRadius: "10px",
            },
          }}
        >
          {optionType && (
            <Options
              type={optionType}
              variant="vertical"
              options={suggestionList}
              onChoose={onSelect}
            />
          )}
        </Card>
      )}
    </Grid>
  );
};
