import React, { useState } from "react";
import { Box, Button, Divider, FormControlLabel, Slider, Stack, Switch, TextField, Typography } from "@mui/material";
import { IEditPrompts, IEngineParams } from "@/common/types/builder";
import { theme } from "@/theme";
import { validatePromptOutput } from "@/common/helpers/promptValidator";

interface Props {
  prompt: IEditPrompts;
  onSave: (prompt: IEditPrompts) => void;
  onCancel: () => void;
}

export const OutputOptions: React.FC<Props> = ({ prompt, onSave, onCancel }) => {
  const [promptData, setPromptData] = useState(prompt);

  return (
    <Stack
      height={"100%"}
      width={"100%"}
    >
      <Box p={"16px"}>Generated content format:</Box>
      <Divider sx={{ borderColor: "surface.3" }} />
      <Box
        sx={{
          overflowY: "auto",
          p: "16px 24px",
        }}
      >
        <Box py={"16px"}>
          <TextField
            label="Output variable:"
            placeholder={`$temp_id_1234`}
            variant="standard"
            size="medium"
            fullWidth
            name="prompt_output_variable"
            value={promptData.prompt_output_variable}
            onChange={e =>
              setPromptData({ ...promptData, prompt_output_variable: validatePromptOutput(e.target.value) })
            }
          />
        </Box>
        <Stack
          direction={"row"}
          gap={3}
          py={"8px"}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: "onSurface",
                py: "8px",
              }}
            >
              Text output format:
            </Typography>
            <TextField
              label="Format"
              variant="standard"
              size="medium"
              fullWidth
              name="output_format"
              value={promptData.output_format}
              onChange={e => setPromptData({ ...promptData, output_format: e.target.value })}
            />
          </Box>
          <Box>
            <Box
              sx={{
                p: "4px 24px",
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "onSurface",
                  py: "8px",
                }}
              >
                Make the Prompt Output Visible?
              </Typography>
              <FormControlLabel
                control={<Switch color="primary" />}
                label={promptData.is_visible ? "Yes" : "No"}
                checked={promptData.is_visible}
                name="is_visible"
                value={promptData.is_visible}
                onChange={(e, checked) => setPromptData({ ...promptData, is_visible: checked })}
              />
            </Box>
            <Box
              sx={{
                p: "4px 24px",
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "onSurface",
                  py: "8px",
                }}
              >
                Make the Prompt Title Visible?
              </Typography>
              <FormControlLabel
                control={<Switch color="primary" />}
                label={promptData.show_output ? "Yes" : "No"}
                checked={promptData.show_output}
                name="show_output"
                value={promptData.show_output}
                onChange={(e, checked) => setPromptData({ ...promptData, show_output: checked })}
              />
            </Box>
          </Box>
        </Stack>
      </Box>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"flex-end"}
        gap={2}
        p={"16px 24px"}
      >
        <Button
          variant="text"
          sx={{
            borderRadius: "4px",
            color: "secondary.main",
          }}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: "secondary.main",
            borderRadius: "4px",
          }}
          onClick={() => onSave(promptData)}
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
};
