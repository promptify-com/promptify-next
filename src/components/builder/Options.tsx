import React, { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { INodesData, IPromptOptions } from "@/common/types/builder";
import { useGetEnginesQuery } from "@/core/api/engines";
import { EngineParams } from "./EngineParams";

interface OptionsProps {
  selectedNodeData: INodesData | null;
  changeEngine: (engineId: number) => void;
  onUpdateNodeOptions: (options: IPromptOptions) => void;
}

export const Options = ({ selectedNodeData, changeEngine, onUpdateNodeOptions }: OptionsProps) => {
  const { data: engines } = useGetEnginesQuery();

  const [useDefault, setUseDefault] = useState(!!!selectedNodeData?.model_parameters);
  const [optionsValues, setOptionsValues] = useState<IPromptOptions>({
    output_format: selectedNodeData?.output_format || "",
    model_parameters: selectedNodeData?.model_parameters || null,
    is_visible: selectedNodeData?.is_visible || false,
    show_output: selectedNodeData?.show_output || false,
    prompt_output_variable: selectedNodeData?.prompt_output_variable || "",
  });

  useEffect(() => {
    setOptionsValues({
      output_format: selectedNodeData?.output_format || "",
      model_parameters: selectedNodeData?.model_parameters || null,
      is_visible: selectedNodeData?.is_visible || false,
      show_output: selectedNodeData?.show_output || false,
      prompt_output_variable: selectedNodeData?.prompt_output_variable || "",
    });
  }, [selectedNodeData]);

  const setOptionValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value, type, checked } = e.target;
    let values = optionsValues;

    if (type === "checkbox") {
      values = {
        ...optionsValues,
        [name]: checked,
      };
      setOptionsValues(values);
    } else {
      // prompt_output_variable requires a $ prefix
      if (name === "prompt_output_variable") if (value.length && value[0] !== "$") value = "$" + value;

      values = {
        ...optionsValues,
        [name]: value,
      };
      setOptionsValues(values);
    }
    onUpdateNodeOptions(values);
  };

  const setEngineParamValue = (param: string, value: string) => {
    setOptionsValues(prevState => ({
      ...prevState,
      model_parameters: {
        ...prevState.model_parameters,
        [param]: parseFloat(value),
      },
    }));
    onUpdateNodeOptions({
      ...optionsValues,
      model_parameters: {
        ...optionsValues.model_parameters,
        [param]: parseFloat(value),
      },
    });
  };

  const engine = useMemo(() => engines?.find(engine => engine.id === selectedNodeData?.engine_id), [selectedNodeData]);

  return (
    <Stack
      gap={2}
      padding="24px 32px"
    >
      <Box>
        {engines?.length && (
          <Autocomplete
            sx={{ width: "100%" }}
            options={engines}
            autoHighlight
            disableClearable
            getOptionLabel={option => option.name}
            value={engine}
            onChange={(e, value) => changeEngine(value?.id || engines[0].id)}
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
                  },
                  ".MuiIconButton-root ": {
                    border: "none",
                  },
                }}
              />
            )}
          />
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
            params={optionsValues?.model_parameters}
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
          value={optionsValues?.output_format}
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
            checked={optionsValues?.is_visible}
            name="is_visible"
            value={optionsValues?.is_visible}
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
            checked={optionsValues?.show_output}
            name="show_output"
            value={optionsValues?.show_output}
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
            value={optionsValues?.prompt_output_variable}
            onChange={setOptionValue}
          />
        </Box>
      </Box>
    </Stack>
  );
};
