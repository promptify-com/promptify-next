import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TuneIcon from "@mui/icons-material/Tune";
import { INodesData, IPromptOptions } from "@/common/types/builder";

interface IBoxStates {
  box1: boolean;
  box2: boolean;
  box3: boolean;
  box4: boolean;
}
interface OptionsProps {
  prevOptions: INodesData | null;
  onUpdateNodeOptions: (options: IPromptOptions) => void;
}

export const Options = ({ prevOptions, onUpdateNodeOptions }: OptionsProps) => {
  const [boxStates, setBoxStates] = useState({
    box1: true,
    box2: true,
    box3: true,
    box4: true, 
  });
  const [useDefault, setUseDefault] = useState(false);
  const [optionsValues, setOptionsValues] = useState<IPromptOptions>({
    output_format: "",
    model_parameters: {
      temperature: 0,
      maximumLength: 0,
      topP: 0,
      presencePenalty: 0,
      frequencyPenalty: 0,
    },
    is_visible: false,
    show_output: false,
    prompt_output_variable: ""
  });

  useEffect(() => {
    if (prevOptions) {
      setOptionsValues({
        output_format: prevOptions.output_format,
        model_parameters: prevOptions?.model_parameters,
        is_visible: prevOptions.is_visible,
        show_output: prevOptions.show_output,
        prompt_output_variable: prevOptions.prompt_output_variable
      });
    }

    // Is model_parameters null?
    if (prevOptions && !prevOptions.model_parameters) {
      setUseDefault(true);
    }
  }, [prevOptions]);

  const shrinkBox = (boxName: keyof IBoxStates) => {
    setBoxStates((prevState) => ({
      ...prevState,
      [boxName]: !prevState[boxName],
    }));
  };

  const setOptionValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setOptionsValues((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else {
      setOptionsValues((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (useDefault) {
      setOptionsValues({
        ...optionsValues,
        model_parameters: null,
      });
    }
  }, [useDefault]);

  useEffect(() => {
    onUpdateNodeOptions(optionsValues);
    setUseDefault(optionsValues?.model_parameters === null);
  }, [optionsValues]);

  const setModelParametersValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setOptionsValues((prevState) => ({
      ...prevState,
      model_parameters: {
        ...prevState.model_parameters,
        [name]: parseFloat(value),
      },
    }));
  };

  return (
    <Box borderBottom="1px solid grey" padding="25px 10px">
      <Box sx={{ mb: "20px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: "15px",
            "&:hover": { cursor: "pointer", opacity: 0.5 },
          }}
          onClick={() => shrinkBox("box1")}
        >
          {boxStates.box1 ? (
            <KeyboardArrowUpIcon sx={{ color: "white", fontSize: "30px" }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ color: "white", fontSize: "30px" }} />
          )}
          <Typography
            fontSize="1rem"
            color="rgba(255, 255, 255, 0.6)"
            ml="10px"
          >
            Output Format
          </Typography>
          <TuneIcon
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "20px",
              ml: "10px",
            }}
          />
        </Box>
        {boxStates.box1 && (
          <Box sx={{ p: "5px 30px" }}>
            <TextField
              name="output_format"
              multiline
              rows={5}
              inputProps={{
                style: {
                  fontSize: "1rem",
                  color: "white",
                  backgroundColor: "#373737",
                },
              }}
              sx={{
                width: "100%",
                bgcolor: "#373737",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                  borderRadius: "2px",
                },
                ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              }}
              value={optionsValues?.output_format}
              onChange={setOptionValue}
            />
          </Box>
        )}
      </Box>
      <Box sx={{ mb: "20px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: "15px",
            "&:hover": { cursor: "pointer", opacity: 0.5 },
          }}
          onClick={() => shrinkBox("box2")}
        >
          {boxStates.box2 ? (
            <KeyboardArrowUpIcon sx={{ color: "white", fontSize: "30px" }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ color: "white", fontSize: "30px" }} />
          )}
          <Typography
            fontSize="1rem"
            color="rgba(255, 255, 255, 0.6)"
            ml="10px"
          >
            Engine Parameters
          </Typography>
          <TuneIcon
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "20px",
              ml: "10px",
            }}
          />
        </Box>
        {boxStates.box2 && (
          <React.Fragment>
            <Box sx={{ p: "10px 30px", display: "flex", alignItems: "center" }}>
              <InputLabel
                sx={{
                  flex: 1,
                  color: "white",
                  fontSize: "1rem",
                  opacity: ".6",
                  whiteSpace: "normal",
                }}
              >
                Use Default
              </InputLabel>
              <Box sx={{ flex: 1 }}>
                <Checkbox
                  sx={{ color: "white", p: 0 }}
                  checked={useDefault}
                  onChange={() => setUseDefault(!useDefault)}
                />
              </Box>
            </Box>
            {!useDefault && (
              <React.Fragment>
                <Box
                  sx={{ p: "10px 30px", display: "flex", alignItems: "center" }}
                >
                  <InputLabel
                    sx={{
                      flex: 1,
                      color: "white",
                      fontSize: "1rem",
                      opacity: ".6",
                      whiteSpace: "normal",
                    }}
                  >
                    Temperature:
                  </InputLabel>
                  <TextField
                    name="temperature"
                    type="number"
                    sx={{
                      flex: 1,
                      bgcolor: "transparent",
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                        borderRadius: "2px",
                      },
                      ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: ".9rem",
                        color: "white",
                        backgroundColor: "transparent",
                        padding: "5px 8px",
                      },
                    }}
                    value={optionsValues?.model_parameters?.temperature}
                    onChange={setModelParametersValue}
                  />
                </Box>
                <Box
                  sx={{ p: "10px 30px", display: "flex", alignItems: "center" }}
                >
                  <InputLabel
                    sx={{
                      flex: 1,
                      color: "white",
                      fontSize: "1rem",
                      opacity: ".6",
                      whiteSpace: "normal",
                    }}
                  >
                    Maximum Length:
                  </InputLabel>
                  <TextField
                    name="maximumLength"
                    type="number"
                    sx={{
                      flex: 1,
                      bgcolor: "transparent",
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                        borderRadius: "2px",
                      },
                      ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: ".9rem",
                        color: "white",
                        backgroundColor: "transparent",
                        padding: "5px 8px",
                      },
                    }}
                    value={optionsValues?.model_parameters?.maximumLength}
                    onChange={setModelParametersValue}
                  />
                </Box>
                <Box
                  sx={{ p: "10px 30px", display: "flex", alignItems: "center" }}
                >
                  <InputLabel
                    sx={{
                      flex: 1,
                      color: "white",
                      fontSize: "1rem",
                      opacity: ".6",
                      whiteSpace: "normal",
                    }}
                  >
                    Top P:
                  </InputLabel>
                  <TextField
                    name="topP"
                    type="number"
                    sx={{
                      flex: 1,
                      bgcolor: "transparent",
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                        borderRadius: "2px",
                      },
                      ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: ".9rem",
                        color: "white",
                        backgroundColor: "transparent",
                        padding: "5px 8px",
                      },
                    }}
                    value={optionsValues?.model_parameters?.topP}
                    onChange={setModelParametersValue}
                  />
                </Box>
                <Box
                  sx={{ p: "10px 30px", display: "flex", alignItems: "center" }}
                >
                  <InputLabel
                    sx={{
                      flex: 1,
                      color: "white",
                      fontSize: "1rem",
                      opacity: ".6",
                      whiteSpace: "normal",
                    }}
                  >
                    Presence Penalty:
                  </InputLabel>
                  <TextField
                    name="presencePenalty"
                    type="number"
                    sx={{
                      flex: 1,
                      bgcolor: "transparent",
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                        borderRadius: "2px",
                      },
                      ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: ".9rem",
                        color: "white",
                        backgroundColor: "transparent",
                        padding: "5px 8px",
                      },
                    }}
                    value={optionsValues?.model_parameters?.presencePenalty}
                    onChange={setModelParametersValue}
                  />
                </Box>
                <Box
                  sx={{ p: "10px 30px", display: "flex", alignItems: "center" }}
                >
                  <InputLabel
                    sx={{
                      flex: 1,
                      color: "white",
                      fontSize: "1rem",
                      opacity: ".6",
                      whiteSpace: "normal",
                    }}
                  >
                    Frequence Penalty:
                  </InputLabel>
                  <TextField
                    name="frequencyPenalty"
                    type="number"
                    sx={{
                      flex: 1,
                      bgcolor: "transparent",
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                        borderRadius: "2px",
                      },
                      ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: ".9rem",
                        color: "white",
                        backgroundColor: "transparent",
                        padding: "5px 8px",
                      },
                    }}
                    value={optionsValues?.model_parameters?.frequencyPenalty}
                    onChange={setModelParametersValue}
                  />
                </Box>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </Box>
      <Box sx={{ mb: "20px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: "15px",
            "&:hover": { cursor: "pointer", opacity: 0.5 },
          }}
          onClick={() => shrinkBox("box3")}
        >
          {boxStates.box3 ? (
            <KeyboardArrowUpIcon sx={{ color: "white", fontSize: "30px" }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ color: "white", fontSize: "30px" }} />
          )}
          <Typography
            fontSize="1rem"
            color="rgba(255, 255, 255, 0.6)"
            ml="10px"
          >
            Other Options
          </Typography>
          <TuneIcon
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "20px",
              ml: "10px",
            }}
          />
        </Box>
        {boxStates.box3 && (
          <React.Fragment>
            <Box sx={{ p: "10px 30px", display: "flex", alignItems: "center" }}>
              <InputLabel
                sx={{
                  flex: 1,
                  color: "white",
                  fontSize: "1rem",
                  opacity: ".6",
                  whiteSpace: "normal",
                }}
              >
                Is Visible?
              </InputLabel>
              <Box sx={{ flex: 1 }}>
                <Checkbox
                  name="is_visible"
                  sx={{ color: "white", p: 0 }}
                  checked={optionsValues.is_visible}
                  value={optionsValues?.is_visible}
                  onChange={setOptionValue}
                />
              </Box>
            </Box>
            <Box sx={{ p: "10px 30px", display: "flex", alignItems: "center" }}>
              <InputLabel
                sx={{
                  flex: 1,
                  color: "white",
                  fontSize: "1rem",
                  opacity: ".6",
                  whiteSpace: "normal",
                }}
              >
                Display Output
              </InputLabel>
              <Box sx={{ flex: 1 }}>
                <Checkbox
                  name="show_output"
                  sx={{ color: "white", p: 0 }}
                  checked={optionsValues.show_output}
                  value={optionsValues?.show_output}
                  onChange={setOptionValue}
                />
              </Box>
            </Box>
          </React.Fragment>
        )}
      </Box>
      <Box sx={{ mb: "20px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: "15px",
            "&:hover": { cursor: "pointer", opacity: 0.5 },
          }}
          onClick={() => shrinkBox("box4")}
        >
          {boxStates.box4 ? (
            <KeyboardArrowUpIcon sx={{ color: "white", fontSize: "30px" }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ color: "white", fontSize: "30px" }} />
          )}
          <Typography
            fontSize="1rem"
            color="rgba(255, 255, 255, 0.6)"
            ml="10px"
          >
            Save Output As
          </Typography>
          <TuneIcon
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "20px",
              ml: "10px",
            }}
          />
        </Box>
        {boxStates.box4 && (
          <Box sx={{ p: "5px 30px" }}>
            <TextField
              name="prompt_output_variable"
              inputProps={{
                style: {
                  fontSize: "1rem",
                  color: "white",
                  backgroundColor: "#373737",
                },
              }}
              sx={{
                width: "100%",
                bgcolor: "#373737",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                  borderRadius: "2px",
                },
                ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              }}
              value={optionsValues?.prompt_output_variable || ""}
              onChange={setOptionValue}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
