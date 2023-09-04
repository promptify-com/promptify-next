import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  InputBase,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useWindowSize } from "usehooks-ts";
import { AllInclusive, Clear, ExpandLess, ExpandMore, MoreVert, PlayArrow, Search, Send } from "@mui/icons-material";
import { useSelector } from "react-redux";

import { PromptDescription, PromptParam, ResInputs, ResOverrides } from "@/core/api/dto/prompts";
import useToken from "@/hooks/useToken";
import { Templates } from "@/core/api/dto/templates";
import TabsAndFormPlaceholder from "@/components/placeholders/TabsAndFormPlaceholder";
import LogoAsAvatar from "@/assets/icons/LogoAsAvatar";
import ChatFormContent from "./ChatFormContent";
import { RootState } from "@/core/store";

export interface InputsErrors {
  [key: string]: number | boolean;
}
interface Input {
  name: string;
  fullName: string;
  type: string;
  required: boolean;
  defaultValue?: string | number | null;
  prompt: number;
}
interface Param {
  prompt: number;
  param: {
    descriptions: PromptDescription[];
    score: number;
    parameter: PromptParam;
    is_visible: boolean;
    is_editable: boolean;
  };
}

interface ChatModeProps {
  inputs: Input[] | null;
  params: Param[] | null;
  nodeInputs: ResInputs[];
  setNodeInputs: (obj: any) => void;
  nodeParams: ResOverrides[];
  setNodeParams: (obj: any) => void;
  errors: InputsErrors;
  generate: () => void;
  isGenerating: boolean;
  isFormFilled: boolean;
  templateData: Templates;
  onReset: () => void;
  allowReset: boolean;
}

export const ChatMode: React.FC<ChatModeProps> = ({
  inputs,
  params,
  nodeInputs,
  setNodeInputs,
  nodeParams,
  setNodeParams,
  errors,
  generate,
  isGenerating,
  isFormFilled,
  templateData,
  onReset,
  allowReset,
}) => {
  const token = useToken();
  const { palette } = useTheme();
  const { width: windowWidth } = useWindowSize();

  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const [chatExpanded, setChatExpanded] = useState(true);
  const [selectedNode, setSelectedNode] = useState<{ questionId: number; item: Input | Param | null } | null>({
    questionId: 0,
    item: null,
  });

  let PromptsFields: (Input | Param)[] = [];

  useEffect(() => {
    if (inputs) {
      setSelectedNode({ questionId: 0, item: inputs[0] });
    }
  }, []);

  useEffect(() => {
    if (isGenerating) {
      setChatExpanded(false);
    }
  }, [isGenerating]);

  const [value, setValue] = useState<string | number | null>();
  useEffect(() => {
    if (selectedNode?.item && "name" in selectedNode.item) {
      let inputValue;
      inputValue = nodeInputs.find(prompt => prompt.id === selectedNode.item?.prompt)?.inputs[selectedNode.item.name]
        ?.value;

      setValue(inputValue);
    }
  }, [nodeInputs, selectedNode]);

  if (inputs && params) {
    PromptsFields = [...inputs, ...params];
  }

  function getItemName(item: Input | Param | null | undefined): string {
    if (!item) return "";
    if (item && "name" in item) {
      return item.name;
    } else {
      return item.param.parameter.name;
    }
  }

  function getItemValueType() {
    if (selectedNode?.item && "name" in selectedNode.item) {
      return selectedNode.item.type;
    }
  }

  const handleChangeInput = (value: string = "", name: string = "", type: string = "") => {
    if (selectedNode?.item && "name" in selectedNode.item) {
      const { prompt: selectedPrompt } = selectedNode.item;
      const resObj = nodeInputs.find(prompt => prompt.inputs[name]);
      const resArr = [...nodeInputs];

      if (!resObj) {
        return setNodeInputs([
          ...nodeInputs,
          {
            id: selectedPrompt,
            inputs: {
              [name]: {
                value: type === "number" ? +value : value,
              },
            },
          },
        ]);
      }

      resArr.forEach((prompt: any, index: number) => {
        if (prompt.id === selectedPrompt) {
          resArr[index] = {
            ...prompt,
            inputs: {
              ...prompt.inputs,
              [name]: {
                value: type === "number" ? +value : value,
                required: resObj.inputs[name].required,
              },
            },
          };
        }
      });

      setNodeInputs([...resArr]);
    }
  };

  return (
    <Grid
      width={"100%"}
      overflow={"hidden"}
      borderRadius={"16px"}
    >
      <Accordion
        expanded={windowWidth < 960 ? true : chatExpanded}
        onChange={() => setChatExpanded(prev => !prev)}
        sx={{
          boxShadow: "none",
          bgcolor: "surface.1",
          borderRadius: "16px",
          overflow: "hidden",
          ".MuiAccordionDetails-root": {
            p: "0",
          },
          ".MuiAccordionSummary-root": {
            minHeight: "48px",
            ":hover": {
              opacity: 0.8,
              svg: {
                color: "primary.main",
              },
            },
          },
          ".MuiAccordionSummary-content": {
            m: 0,
          },
        }}
      >
        <AccordionSummary>
          <Grid
            display={"flex"}
            alignItems={"center"}
            gap={"16px"}
            width={"100%"}
            justifyContent={"space-between"}
          >
            <Grid
              display={"flex"}
              alignItems={"center"}
              gap={"16px"}
            >
              {!chatExpanded ? <ExpandMore sx={{ fontSize: 16 }} /> : <ExpandLess sx={{ fontSize: 16 }} />}

              <Typography
                px={"8px"}
                sx={{
                  fontSize: 13,
                  lineHeight: "22px",
                  letterSpacing: "0.46px",
                  color: "onSurface",
                  opacity: 0.8,
                }}
              >
                Chat with Promptify
              </Typography>
            </Grid>
            <Grid>
              <IconButton
                onClick={e => {
                  e.stopPropagation();
                }}
                size="small"
                sx={{
                  border: "none",
                }}
              >
                <Search />
              </IconButton>
              <IconButton
                onClick={e => {
                  e.stopPropagation();
                }}
                size="small"
                sx={{
                  border: "none",
                }}
              >
                <MoreVert />
              </IconButton>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            borderTop: "2px solid #ECECF4",
          }}
        >
          <Grid
            display={"flex"}
            flexDirection={"column"}
            gap={"8px"}
          >
            <Grid
              p={"16px"}
              display={"flex"}
              gap={"16px"}
            >
              <LogoAsAvatar />
              <Grid flex={1}>
                <Typography>
                  Hi, {currentUser?.username}. Welcome. I can help you with your {templateData.title}
                </Typography>
                <Typography mt={4}> We need following things:</Typography>
                <Grid
                  display={"flex"}
                  width={"100%"}
                  flexDirection={"column"}
                  gap={"8px"}
                >
                  <Stack width={"100%"}>
                    <Stack
                      mt={1}
                      gap={"16px"}
                      sx={{
                        flex: 1,
                        p: "8px",
                        pb: { xs: 0, md: "16px" },
                      }}
                    >
                      {!inputs || !params ? <TabsAndFormPlaceholder form={true} /> : null}
                      <ChatFormContent
                        PromptsFields={PromptsFields}
                        selectedNode={selectedNode}
                        setSelectedNode={setSelectedNode}
                        errors={errors}
                        nodeInputs={nodeInputs}
                        nodeParams={nodeParams}
                        setNodeParams={setNodeParams}
                        getItemName={getItemName}
                      />

                      <Stack
                        sx={{
                          bgcolor: "initial",
                          color: { xs: "onSurface", md: "initial" },
                          zIndex: 999,
                        }}
                      >
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          gap={1}
                        >
                          <Button
                            variant={"contained"}
                            startIcon={token ? <PlayArrow /> : null}
                            sx={{
                              p: "10px 25px",
                              height: "36px",
                              fontWeight: 500,
                              borderColor: "primary.main",
                              borderRadius: "999px",
                              bgcolor: "primary.main",
                              color: "onPrimary",
                              whiteSpace: "pre-line",
                              ":hover": {
                                bgcolor: "surface.1",
                                color: "primary.main",
                              },
                              ":disabled": {
                                bgcolor: "surface.4",
                                color: "onTertiary",
                                borderColor: "transparent",
                              },
                            }}
                            disabled={!token ? false : isGenerating ? true : !isFormFilled}
                            onClick={generate}
                          >
                            {token ? (
                              <Typography sx={{ color: "inherit", fontSize: { xs: 12, md: 15 } }}>
                                Start Generation
                              </Typography>
                            ) : (
                              <Typography color={"inherit"}>Sign in or Create an account</Typography>
                            )}
                          </Button>
                          <Box
                            sx={{
                              position: "relative",
                              display: { xs: "inline-flex", md: "none" },
                            }}
                          >
                            <CircularProgress
                              variant="determinate"
                              value={100}
                              sx={{ position: "absolute", color: "grey.400" }}
                            />
                            <CircularProgress
                              variant="determinate"
                              value={templateData.executions_limit === -1 ? 100 : templateData.executions_count}
                            />
                            <Box
                              sx={{
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                position: "absolute",
                                width: 26,
                                height: 26,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "primary.main",
                                color: "onPrimary",
                                borderRadius: 99,
                                fontSize: 12,
                              }}
                            >
                              {templateData.executions_limit === -1 ? (
                                <AllInclusive fontSize="small" />
                              ) : (
                                templateData.executions_count
                              )}
                            </Box>
                          </Box>

                          <Button
                            variant="text"
                            sx={{
                              display: allowReset ? "inline-flex" : "none",
                              border: `1px solid ${alpha(palette.primary.main, 0.15)}`,
                              bgcolor: "surface.1",
                              color: "onSurface",
                              fontSize: 13,
                              fontWeight: 500,
                              p: "4px 12px",
                              svg: {
                                fontSize: "18px !important",
                              },
                            }}
                            onClick={onReset}
                          >
                            Clear
                          </Button>
                        </Stack>
                      </Stack>

                      {Object.keys(errors).length > 0 && (
                        <Typography
                          color={"error.main"}
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          Fill all the inputs
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            <Grid p={"16px"}>
              <Box
                bgcolor={"surface.3"}
                display={"flex"}
                alignItems={"center"}
                borderRadius="99px"
                minHeight={"32px"}
                p={"8px 16px"}
              >
                {selectedNode?.item && "name" in selectedNode.item && (
                  <Button
                    startIcon={<Clear onClick={() => setSelectedNode(null)} />}
                    sx={{
                      bgcolor: "surface.1",
                      "&:hover": {
                        bgcolor: "surface.1",
                      },
                    }}
                  >
                    {`Q${selectedNode.questionId + 1}. ${getItemName(selectedNode?.item)}`}
                  </Button>
                )}
                <InputBase
                  type={getItemValueType() === "number" ? "number" : "text"}
                  value={selectedNode?.item ? value : ""}
                  onChange={e => handleChangeInput(e.target.value, getItemName(selectedNode?.item), getItemValueType())}
                  sx={{ ml: 1, flex: 1, fontSize: 13, lineHeight: "22px", letterSpacing: "0.46px", fontWeight: "500" }}
                  placeholder={
                    selectedNode?.item && "name" in selectedNode.item ? "Type here..." : "Chat with Promptify"
                  }
                  inputProps={{ "aria-label": "Name" }}
                />

                <Send />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};
