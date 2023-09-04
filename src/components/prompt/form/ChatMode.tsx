import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputBase,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { PromptDescription, PromptParam, ResInputs } from "@/core/api/dto/prompts";
import useToken from "@/hooks/useToken";

import { Templates } from "@/core/api/dto/templates";

import { AllInclusive, ExpandLess, ExpandMore, MoreVert, PlayArrow, Search, Send } from "@mui/icons-material";

import TabsAndFormPlaceholder from "@/components/placeholders/TabsAndFormPlaceholder";
import LogoAsAvatar from "@/assets/icons/LogoAsAvatar";
import ChatFormCntent from "./ChatFormContent";
import { useSelector } from "react-redux";
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

  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const [chatExpanded, setChatExpanded] = useState(true);

  let PromptsFields: (Input | Param)[] = [];

  if (inputs && params) {
    PromptsFields = [...inputs, ...params];
  }

  function getItemName(item: Input | Param): string {
    if ("name" in item) {
      return item.name;
    } else {
      return item.param.parameter.name;
    }
  }

  return (
    <Grid
      width={"100%"}
      overflow={"hidden"}
      borderRadius={"16px"}
    >
      <Accordion
        expanded={chatExpanded}
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
                <Typography>Hi, {currentUser?.username}. Welcome. I can help you to plan Social Event.</Typography>
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
                      <ChatFormCntent
                        PromptsFields={PromptsFields}
                        errors={errors}
                        nodeInputs={nodeInputs}
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
                              <Typography sx={{ color: "inherit", fontSize: 15 }}>Start Generation</Typography>
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
                <InputBase
                  sx={{ ml: 1, flex: 1, fontSize: 13, lineHeight: "22px", letterSpacing: "0.46px", fontWeight: "500" }}
                  placeholder="Chat with Promptify"
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
