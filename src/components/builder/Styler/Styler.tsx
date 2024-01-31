import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  TextField,
  DialogContent,
  Stack,
  IconButton,
  alpha,
} from "@mui/material";
import { BuilderType, IEditPrompts, IPromptParams } from "@/common/types/builder";
import { IParametersPreset } from "@/common/types/parametersPreset";
import { Add, AddCircle, Bolt, ContentCopy, Save } from "@mui/icons-material";
import { theme } from "@/theme";
import { IParameters } from "@/common/types";
import ParamSlider from "./ParamSlider";
import ParametersModal from "../ParametersModal";
import {
  useCreateParametersPresetMutation,
  useGetParametersPresetsQuery,
  useGetParametersQuery,
} from "@/core/api/parameters";
import { BUILDER_TYPE } from "@/common/constants";
import { addParameter } from "@/common/helpers/addParameter";

interface IProps {
  selectedNodeData: IEditPrompts;
  setSelectedNodeData: (node: IEditPrompts) => void;
  type: BuilderType;
}

function Styler({ selectedNodeData, setSelectedNodeData, type }: IProps) {
  const { data: parameters } = useGetParametersQuery();
  const { data: presets } = useGetParametersPresetsQuery();
  const [createParametersPreset] = useCreateParametersPresetMutation();
  const [expandPresets, setExpandPresets] = useState(false);
  const [openParamsModal, setOpenParamsModal] = useState(false);
  const [openNewPreset, setOpenNewPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");

  const changePromptParams = (params: IPromptParams[]) => {
    setSelectedNodeData({
      ...selectedNodeData,
      parameters: params,
    });
  };

  const handleChangeScore = (score: number, id: number) => {
    const newArray: IPromptParams[] = [];

    selectedNodeData.parameters.forEach(item => {
      newArray.push({
        parameter_id: item.parameter_id,
        score: item.parameter_id === id ? score : item.score,
        name: item.name,
        is_visible: item.is_visible,
        is_editable: item.is_editable,
        descriptions: item.descriptions,
      });
    });

    changePromptParams([...newArray]);
  };

  const removeParam = (paramId: number) => {
    changePromptParams([
      ...(selectedNodeData.parameters.filter(param => param.parameter_id !== paramId) as IPromptParams[]),
    ]);
  };

  // Handles change of prompt parameter is_visible and is_editable.
  // Prefered to handle them dynamically [option] instead of switch depending on the option
  const handleChangeOptions = (parameterId: number, option: string, newVal: boolean) => {
    if (selectedNodeData.parameters) {
      const updatedPromptParams = selectedNodeData.parameters.map(param => {
        return {
          ...param,
          [option]: param.parameter_id === parameterId ? newVal : (param as any)[option],
        };
      });
      changePromptParams([...updatedPromptParams]);
    }
  };

  const createParameter = (param: IParameters) => {
    const newParameters = addParameter({
      prompt: selectedNodeData,
      newParameter: param,
    });
    changePromptParams(newParameters.parameters);
    setOpenParamsModal(false);
  };

  const choosePreset = (preset: IParametersPreset) => {
    setExpandPresets(false);
    const presetParams = preset.parameters.map(pParam => {
      const param = parameters?.find(param => param.id === pParam.id);
      return {
        parameter_id: param?.id,
        score: pParam.score,
        name: param?.name,
        is_visible: true,
        is_editable: true,
        descriptions: param?.score_descriptions,
      };
    });
    changePromptParams(presetParams as IPromptParams[]);
  };

  const saveNewPreset = () => {
    if (selectedNodeData.parameters.length) {
      const newPreset = {
        name: newPresetName,
        parameters: selectedNodeData.parameters.map(param => {
          return {
            id: param.parameter_id,
            score: param.score,
          };
        }),
      };
      createParametersPreset(newPreset).then(res => {
        setOpenNewPreset(false);
        setNewPresetName("");
      });
    }
  };

  return (
    <Stack
      gap={3}
      sx={{
        p: type === BUILDER_TYPE.ADMIN ? "24px 32px" : "0",
      }}
    >
      <ParamSlider
        promptParams={selectedNodeData.parameters}
        handleChangeScore={handleChangeScore}
        handleChangeOptions={handleChangeOptions}
        removeParam={removeParam}
        type={type}
      />

      {type === BUILDER_TYPE.ADMIN ? (
        <>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
          >
            <IconButton
              onClick={() => setOpenParamsModal(true)}
              sx={{
                border: "none",
                backgroundColor: "surface.2",
                "&:hover": {
                  backgroundColor: "surface.3",
                },
                svg: {
                  width: 20,
                  height: 20,
                },
              }}
            >
              <Add />
            </IconButton>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 500,
                color: alpha(theme.palette.secondary.light, 0.45),
              }}
            >
              Add new parameter
            </Typography>
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={2}
          >
            <Button
              variant="text"
              startIcon={<Bolt />}
              sx={{
                color: "onSurface",
                border: `1px solid ${alpha(theme.palette.onSurface, 0.1)}`,
                fontSize: 13,
                fontWeight: 500,
                p: "4px 15px",
                ":hover": {
                  bgcolor: "surface.3",
                },
              }}
              onClick={() => setExpandPresets(true)}
            >
              Load preset
            </Button>
            {selectedNodeData.parameters.length > 0 && (
              <Button
                variant="text"
                startIcon={<Save />}
                sx={{
                  color: "onSurface",
                  border: `1px solid ${alpha(theme.palette.onSurface, 0.1)}`,
                  fontSize: 13,
                  fontWeight: 500,
                  p: "4px 15px",
                  ":hover": {
                    bgcolor: "surface.3",
                  },
                }}
                onClick={() => setOpenNewPreset(true)}
              >
                Save as preset
              </Button>
            )}
          </Stack>
        </>
      ) : (
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={2}
          >
            {selectedNodeData.parameters.length > 0 && (
              <IconButton
                onClick={() => setOpenNewPreset(true)}
                sx={{
                  border: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  borderRadius: "999px",
                  gap: 1,
                  p: "6px 16px",
                  bgcolor: "surface.4",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <AddCircle /> Add
              </IconButton>
            )}
            <IconButton
              onClick={() => setExpandPresets(true)}
              sx={{
                border: "none",
                fontSize: 14,
                fontWeight: 500,
                borderRadius: "999px",
                gap: 1,
                p: "6px 16px",
                bgcolor: "surface.4",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <ContentCopy /> Copy...
            </IconButton>
          </Stack>
          {selectedNodeData.parameters.length !== 0 && (
            <IconButton
              onClick={() => changePromptParams([])}
              sx={{
                border: "none",
                fontSize: 14,
                fontWeight: 500,
                borderRadius: "999px",
                gap: 1,
                p: "6px 16px",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              Clear
            </IconButton>
          )}
        </Stack>
      )}

      <Dialog
        onClose={() => setExpandPresets(false)}
        open={expandPresets}
      >
        <Box>
          <DialogTitle
            sx={{
              p: "30px",
              pb: "10px",
              fontFamily: "Space Mono",
              fontSize: 22,
              fontWeight: "600",
            }}
          >
            Click on preset to load
          </DialogTitle>
          <DialogContent sx={{ p: "30px", maxHeight: "380px", overflow: "auto" }}>
            <List sx={{ pt: 0 }}>
              {presets?.map(preset => (
                <ListItem
                  key={preset.id}
                  sx={{
                    mt: 2,
                    fontFamily: "Space Mono",
                    fontSize: 16,
                    cursor: "pointer",
                    color: "black",
                  }}
                  disableGutters
                  onClick={() => choosePreset(preset)}
                >
                  {preset.name}
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Box>
      </Dialog>

      <ParametersModal
        open={openParamsModal}
        selectedNodeData={selectedNodeData}
        onClose={() => setOpenParamsModal(false)}
        onClick={createParameter}
      />

      <Dialog
        onClose={() => setOpenNewPreset(false)}
        open={openNewPreset}
      >
        <Box sx={{ p: "30px" }}>
          <DialogTitle
            sx={{
              fontSize: 22,
              fontWeight: 500,
              p: 0,
            }}
          >
            Save current parameters as preset
          </DialogTitle>
          <Box sx={{ mt: "30px", textAlign: "right" }}>
            <TextField
              name="preset_name"
              type="text"
              placeholder="Preset name"
              sx={{
                width: "100%",
                mb: "20px",
                bgcolor: "transparent",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "grey.400",
                  borderRadius: "4px",
                },
                ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              }}
              inputProps={{
                style: {
                  fontSize: ".9rem",
                  color: "black",
                  backgroundColor: "transparent",
                },
              }}
              value={newPresetName}
              onChange={e => setNewPresetName(e.target.value)}
            />
            <Button
              sx={{
                mr: "15px",
                "&:hover": { backgroundColor: "grey.300" },
              }}
              onClick={() => setOpenNewPreset(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={saveNewPreset}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Stack>
  );
}

export default Styler;
