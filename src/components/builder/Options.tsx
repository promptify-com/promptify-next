import React, { useMemo, useState } from "react";
import { Autocomplete, Box, Checkbox, FormControlLabel, Stack, Switch, TextField, Typography } from "@mui/material";
import { IEditPrompts } from "@/common/types/builder";
import { useGetEnginesQuery } from "@/core/api/engines";
import { EngineParams } from "./EngineParams";
import { validatePromptOutput } from "@/common/helpers/promptValidator";

interface OptionsProps {
  selectedNodeData: IEditPrompts;
  setSelectedNodeData: (node: IEditPrompts) => void;
}

export const Options = ({ selectedNodeData, setSelectedNodeData }: OptionsProps) => {
  const { data: engines } = useGetEnginesQuery();

  const [useDefault, setUseDefault] = useState(!selectedNodeData.model_parameters);

  const setOptionValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value, type, checked } = e.target;
    let optionVal: string | boolean = checked;

    if (type !== "checkbox") {
      // prompt_output_variable requires a $ prefix
      if (name === "prompt_output_variable") {
        value = validatePromptOutput(value);
      }
      optionVal = value;
    }

    setSelectedNodeData({
      ...selectedNodeData,
      [name]: optionVal,
    });
  };

  const setEngineParamValue = (param: string, value: string) => {
    setSelectedNodeData({
      ...selectedNodeData,
      model_parameters: {
        ...selectedNodeData.model_parameters,
        [param]: parseFloat(value),
      },
    });
  };

  const engine = useMemo(() => engines?.find(engine => engine.id === selectedNodeData.engine_id), [selectedNodeData]);

  return (
    <Stack
      gap={2}
      padding="24px 32px"
    >
      <Box>
        {engines?.length && (
          <Stack
            flexDirection={"row"}
            position={"relative"}
          >
            {engine && (
              <img
                src={engine?.icon}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  position: "absolute",
                  top: "12px",
                  left: "6px",
                }}
              />
            )}
            <Autocomplete
              sx={{ width: "100%" }}
              options={engines}
              autoHighlight
              disableClearable
              getOptionLabel={option => option.name}
              value={engine}
              onChange={(e, value) =>
                setSelectedNodeData({
                  ...selectedNodeData,
                  engine_id: value?.id || engines[0].id,
                })
              }
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  <img
                    loading="lazy"
                    src={option.icon}
                    srcSet={option.icon}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                    }}
                  />
                  {option.name}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Engine"
                  sx={{
                    color: "onSurface",
                    ".MuiInputBase-root": {
                      py: "4px",
                      pl: "35px",
                    },
                    ".MuiIconButton-root ": {
                      border: "none",
                    },
                  }}
                />
              )}
            />
          </Stack>
        )}
      </Box>
      <Box>
        <FormControlLabel
          control={<Checkbox />}
          labelPlacement="end"
          label="Custom engine parameters"
          checked={!useDefault}
          onChange={(e, checked) => setUseDefault(!checked)}
          sx={{
            svg: {
              width: 20,
              height: 20,
              opacity: 0.5,
            },
            ".Mui-checked svg": {
              opacity: 1,
            },
            ".MuiFormControlLabel-label": {
              fontSize: 16,
              fontWeight: 400,
            },
          }}
        />
        {!useDefault && (
          <EngineParams
            params={selectedNodeData.model_parameters}
            setParam={setEngineParamValue}
          />
        )}
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 500,
            color: "onSurface",
            py: "8px",
          }}
        >
          Output Format
        </Typography>
        <TextField
          label="Format"
          variant="standard"
          size="medium"
          fullWidth
          name="output_format"
          value={selectedNodeData.output_format}
          onChange={setOptionValue}
        />
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 500,
            color: "onSurface",
            py: "8px",
          }}
        >
          Other Options
        </Typography>
        <Box>
          <FormControlLabel
            control={<Switch color="primary" />}
            label="Is Visible?"
            labelPlacement="start"
            checked={selectedNodeData.is_visible}
            name="is_visible"
            value={selectedNodeData.is_visible}
            onChange={(e: any) => setOptionValue(e)}
            sx={{
              "&.MuiFormControlLabel-root": {
                m: 0,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              },
            }}
          />
          <FormControlLabel
            control={<Switch color="primary" />}
            label="Display Output"
            labelPlacement="start"
            checked={selectedNodeData.show_output}
            name="show_output"
            value={selectedNodeData.show_output}
            onChange={(e: any) => setOptionValue(e)}
            sx={{
              "&.MuiFormControlLabel-root": {
                m: 0,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              },
            }}
          />
        </Box>
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 500,
            color: "onSurface",
            py: "8px",
          }}
        >
          Save output as
        </Typography>
        <Box>
          <TextField
            label="Variable"
            placeholder={`$temp_id_1234`}
            variant="standard"
            size="medium"
            fullWidth
            name="prompt_output_variable"
            value={selectedNodeData.prompt_output_variable}
            onChange={setOptionValue}
          />
        </Box>
      </Box>
    </Stack>
  );
};
