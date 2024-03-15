import { type ChangeEvent, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";

import { validatePromptOutput } from "@/common/helpers/promptValidator";
import { outputFormatOptions } from "@/common/constants";
import type { IEditPrompts } from "@/common/types/builder";

type CustomEvent = SelectChangeEvent<string> | ChangeEvent<{ name?: string; value: unknown }>;
interface Props {
  prompt: IEditPrompts;
  onSave: (prompt: IEditPrompts) => void;
  onCancel: () => void;
}

function OutputOptions({ prompt, onSave, onCancel }: Props) {
  const initialOutputFormat = prompt.output_format;
  const initialOutputFormatMatching = outputFormatOptions.find(
    format => format.toLowerCase() === initialOutputFormat?.toLowerCase(),
  );

  const initialState: IEditPrompts = {
    ...prompt,
    output_format: initialOutputFormatMatching
      ? initialOutputFormatMatching.toLowerCase()
      : initialOutputFormat
      ? "custom"
      : "",
    custom_output_format: initialOutputFormat ?? "",
  };
  const [promptData, setPromptData] = useState<IEditPrompts>(initialState);
  const [hasError, setHasError] = useState(false);

  const handleOutputFormatChange = (event: CustomEvent) => {
    setHasError(false);
    const { name, value } = "target" in event ? event.target : { name: "output_format", value: event };

    const updatedPromptData = {
      ...promptData,
      output_format: name === "output_format" ? (value as string) : "custom",
      custom_output_format: name === "custom_output_format" ? (value as string) : "",
    };

    setPromptData(updatedPromptData);
  };

  const handleSave = () => {
    if (promptData.output_format === "custom" && !promptData.custom_output_format) {
      return setHasError(true);
    }
    onSave(promptData);
    setHasError(false);
  };

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
                onChange={handleOutputFormatChange}
                label="Format"
                name="output_format"
              >
                {outputFormatOptions.map(format => (
                  <MenuItem
                    key={format}
                    value={format.toLowerCase()}
                  >
                    {format}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {promptData.output_format === "custom" && (
              <TextField
                fullWidth
                style={{
                  marginTop: "20px",
                }}
                variant="outlined"
                value={promptData.custom_output_format || ""}
                label="Custom output area"
                name="custom_output_format"
                onChange={handleOutputFormatChange}
                error={hasError}
                helperText={hasError && "Enter a valid custom output format"}
              />
            )}
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
          onClick={handleSave}
          sx={{
            bgcolor: "secondary.main",
            borderRadius: "4px",
          }}
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
}

export default OutputOptions;
