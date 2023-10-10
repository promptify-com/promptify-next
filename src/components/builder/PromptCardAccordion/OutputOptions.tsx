import React, { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { IEditPrompts } from "@/common/types/builder";
import { validatePromptOutput } from "@/common/helpers/promptValidator";

interface Props {
  prompt: IEditPrompts;
  onSave: (prompt: IEditPrompts) => void;
  onCancel: () => void;
}

export const OutputOptions: React.FC<Props> = ({ prompt, onSave, onCancel }) => {
  const [promptData, setPromptData] = useState(prompt);

  const titleFormats = ["JSON", "XML", "Markdown"];

  return (
    <Stack
      minWidth={"648px"}
      minHeight={"500px"}
      position={"relative"}
    >
      <Typography p={"16px"}>Generated content format:</Typography>
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
          <Box flex={1}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: "onSurface",
                py: "16px",
              }}
            >
              Text output format:
            </Typography>
            <FormControl
              fullWidth
              variant="outlined"
              size="small"
            >
              <InputLabel id="format-select-label">Format</InputLabel>
              <Select
                labelId="format-select-label"
                value={promptData.output_format}
                onChange={e => setPromptData({ ...promptData, output_format: e.target.value })}
                label="Format"
              >
                {titleFormats.map(format => (
                  <MenuItem
                    key={format}
                    value={format}
                  >
                    {format}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                Make the Prompt Title Visible?
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
                Make the Prompt Output Visible?
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
        position={"fixed"}
        right={2}
        bottom={2}
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
