import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowDropDown, ArrowDropUp, AutoFixHigh, Close, Loop } from "@mui/icons-material";
import {
  PromptParams,
  ResInputs,
  ResOverrides,
  ResPrompt,
} from "@/core/api/dto/prompts";
import { PromptLiveResponse } from "@/common/types/prompt";
import useToken from "@/hooks/useToken";
import { useAppDispatch } from "@/hooks/useStore";
import { promptsApi } from "@/core/api/prompts";
import { GeneratorInput } from "./GeneratorInput";
import { GeneratorParam } from "./GeneratorParam";
import { savePathURL } from "@/common/utils";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { getArrayFromString } from "@/common/helpers/getArrayFromString";
import { Templates } from "@/core/api/dto/templates";
import { LogoApp } from "@/assets/icons/LogoApp";
import { useWindowSize } from "usehooks-ts";
import { useRouter } from "next/router";
import { useParametersPresets } from "@/hooks/api/parametersPresets";

interface GeneratorFormProps {
  templateData: Templates;
  setNewExecutionData: (data: PromptLiveResponse) => void;
  isGenerating: boolean;
  setIsGenerating: (status: boolean) => void;
  onError: (errMsg: string) => void;
  exit: () => void;
}
export interface InputsErrors {
  [key: string]: number | boolean;
}
interface Input {
  prompt: number;
  name: string;
  fullName: string;
  type: string;
}
interface Param {
  prompt: number;
  param: PromptParams;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  templateData,
  setNewExecutionData,
  isGenerating,
  setIsGenerating,
  onError,
  exit,
}) => {
  const token = useToken();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { width: windowWidth } = useWindowSize();

  const [generatingResponse, setGeneratingResponse] = useState<PromptLiveResponse | null>(null);
  const [resPrompts, setResPrompts] = useState<ResPrompt[]>([]);
  const [lastExecution, setLastExecution] = useState<ResPrompt[] | null>(null);
  const [resInputs, setResInputs] = useState<ResInputs[]>([]);
  const [resOverrides, setResOverrides] = useState<ResOverrides[]>([]);
  const [errors, setErrors] = useState<InputsErrors>({});
  const [shownInputs, setShownInputs] = useState<Input[] | null>(null);
  const [shownParams, setShownParams] = useState<Param[] | null>(null);
  const [presets] = useParametersPresets();
  const [presetsAnchor, setPresetsAnchor] = useState<HTMLElement | null>(null);
  const [allowGenerate, setAllowGenerate] = useState<boolean>(false);

  const setDefaultResPrompts = () => {
    const tempArr: ResPrompt[] = [...resPrompts];

    templateData.prompts.forEach((prompt) => {
      const tempObj: ResPrompt = {} as ResPrompt;

      tempObj.prompt = prompt.id;
      tempObj.contextual_overrides = [];
      tempArr.push(tempObj);
    });

    setResPrompts([...tempArr]);
  };

  const changeResPrompts = () => {
    const tempArr = [...resPrompts];

    if (resInputs.length > 0) {
      tempArr.forEach((prompt, index) => {
        const obj = resInputs.find((inputs) => inputs.id === prompt.prompt);
        if (obj) {
          tempArr[index].prompt_params = obj.inputs;
        }
      });
    }

    if (resOverrides.length > 0) {
      tempArr.forEach((prompt, index) => {
        const obj = resOverrides.find(
          (overrides) => overrides.id === prompt.prompt
        );
        if (obj) {
          tempArr[index].contextual_overrides = obj.contextual_overrides;
        }
      });
    }

    setResPrompts([...tempArr]);
  };

  // Prompts params values tracker to validate generating allowed or not
  useEffect(() => {
    console.log(isInputsFilled())
    if (Object.keys(isInputsFilled()).length > 0) 
      setAllowGenerate(false);
    else 
      setAllowGenerate(true);
  } , [resPrompts])

  const isInputsFilled = () => {
    const tempErrors: InputsErrors = {};

    templateData.prompts.forEach((prompt) => {
      if (prompt.is_visible) {
        const inputs = getArrayFromString(prompt.content);

        inputs.forEach((input) => {
          const checkParams = resPrompts.find(
            (resPrompt) =>
              resPrompt.prompt_params && resPrompt.prompt_params[input.name]
          );

          if (!checkParams || !checkParams.prompt_params[input.name]) {
            tempErrors[input.name] = prompt.id;
          }
        });
      }
    });

    return tempErrors;
  }

  const validateInputs = () => {
    const emptyInputs = isInputsFilled();

    if (!token) {
      setErrors({});
      return true;
    }

    if (Object.keys(emptyInputs).length > 0) {
      setErrors({ ...emptyInputs });
      return false;
    }

    setErrors({});
    return true;
  };

  const handlePostPrompt = () => {
    if (!token) {
      savePathURL(window.location.pathname);
      return router.push("/signin");
    }

    if (!validateInputs()) return;

    generateExecution(resPrompts);
  };

  const generateExecution = (executionData: ResPrompt[]) => {
    if(isGenerating) return;

    setLastExecution(JSON.parse(JSON.stringify(executionData)));

    setIsGenerating(true);

    if (windowWidth < 900) setTimeout(() => exit(), 2000);

    let tempData: any[] = [];
    fetchEventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/api/meta/templates/${templateData.id}/execute/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(executionData),

        async onopen(res) {
          if (res.ok && res.status === 200) {
            setIsGenerating(true);
            setGeneratingResponse({ created_at: new Date(), data: [] });
          } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
            console.error("Client side error ", res);
            onError('Something went wrong. Please try again later');
          }
        },
        onmessage(msg) {
          try {
            const parseData = JSON.parse(msg.data.replace(/'/g, '"'));
            const message = parseData.message;
            const prompt = parseData.prompt_id;

            if (msg.event === 'infer' && msg.data) {
              if (message) {
                const tempArr = [...tempData];
                const activePrompt = tempArr.findIndex(template => template.prompt === +prompt);

                if (activePrompt === -1) {
                  tempArr.push({
                    message,
                    prompt,
                  });
                } else {
                  tempArr[activePrompt] = {
                    ...tempArr[activePrompt],
                    message: tempArr[activePrompt].message + message,
                    prompt,
                  };
                }

                tempData = [...tempArr];
                setGeneratingResponse(prevState => ({ 
                  created_at: prevState?.created_at || new Date(), 
                  data: tempArr 
                }));
              }
            } else {
              const tempArr = [...tempData];
              const activePrompt = tempArr.findIndex(template => template.prompt === +prompt);

              if (message === '[COMPLETED]') {
                tempArr[activePrompt] = {
                  ...tempArr[activePrompt],
                  prompt,
                  isLoading: false,
                  isCompleted: true,
                };
              }

              if (message === '[INITIALIZING]') {
                if (activePrompt === -1) {
                  tempArr.push({
                    message: '',
                    prompt,
                    isLoading: true,
                    created_at: new Date(),
                  });
                } else {
                  tempArr[activePrompt] = {
                    ...tempArr[activePrompt],
                    prompt,
                    isLoading: true,
                  };
                }
              }

              if (message.includes('[ERROR]')) {
                onError(message);
              }

              tempData = [...tempArr];
              setGeneratingResponse(prevState => ({ 
                created_at: prevState?.created_at || new Date(), 
                data: tempArr 
              }));
            }
          } catch {
            console.log(msg.event);
          }
        },
        onerror(err) {
          console.log(err);
          setIsGenerating(false);
          onError('Something went wrong. Please try again later');
          throw err; // rethrow to stop the operation
        },
        onclose() {
          setIsGenerating(false);
        },
      }
    );
  };

  useEffect(() => {
    if (generatingResponse) setNewExecutionData(generatingResponse);
  }, [generatingResponse]);

  useEffect(() => {
    if (templateData) {
      setDefaultResPrompts();
    }
  }, [templateData]);

  useEffect(() => {
    if (resPrompts.length > 0) {
      changeResPrompts();
    }
  }, [resInputs, resOverrides]);

  useEffect(() => {
    removeDuplicates();
  }, [templateData]);

  const removeDuplicates = async () => {
    const shownInputs = new Map<string, Input>();
    const shownParams = new Map<number, Param>();
    await Promise.all(
      [...templateData.prompts]
        .sort((a, b) => a.order - b.order)
        .filter((el) => el.is_visible)
        .map(async (prompt) => {
          const inputs = getArrayFromString(prompt.content);
          inputs.forEach((input) => {
            shownInputs.set(input.name, { ...input, prompt: prompt.id });
          });

          const params = (
            await dispatch(
              promptsApi.endpoints.getPromptParams.initiate(prompt.id)
            )
          ).data;
          params
            ?.filter((param) => param.is_visible)
            .forEach((param) => {
              shownParams.set(param.parameter.id, { param, prompt: prompt.id });
            });
        })
    );
    setShownInputs(Array.from(shownInputs.values()));
    setShownParams(Array.from(shownParams.values()));
  };

  // Keyboard shortcuts
  const handleKeyboard = (e: KeyboardEvent) => {
    // prevent trigger if typing inside input
    const target = e.target as HTMLElement;
    if (!["INPUT", "TEXTAREA"].includes(target.tagName)) {
      if (e.shiftKey && e.code === "KeyR" && lastExecution) {
        generateExecution(lastExecution);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [handleKeyboard]);

  return (
    <Stack gap={1}
      sx={{
        minHeight: { xs: 0, md: "calc(100% - 92px)" },
        height: { xs: "calc(100% - 62px)", md: "auto" },
        bgcolor: "surface.2"
      }}
    >
      <Stack direction={'row'} justifyContent={'space-between'} py={'8px'}>
        <Button
          sx={{ color: "onSurface", fontSize: 13, fontWeight: 500 }}
          startIcon={<AutoFixHigh />}
          endIcon={Boolean(presetsAnchor) ? <ArrowDropUp /> : <ArrowDropDown />}
          variant={"text"}
          onClick={(e) => setPresetsAnchor(e.currentTarget)}
        >
          Presets
        </Button>
        {shownInputs && shownInputs.length > 0 && (
          <Button
            sx={{ color: "onSurface", fontSize: 13, fontWeight: 500 }}
            startIcon={<Close />}
            variant={"text"}
            disabled={!allowGenerate}
            onClick={() => { setResInputs([]) }}
          >
          Clear
        </Button>
        )}
        <Popper
          open={Boolean(presetsAnchor)}
          anchorEl={presetsAnchor}
          transition
          disablePortal
          sx={{ zIndex: 9 }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: "center top" }}
            >
              <Paper
                sx={{
                  bgcolor: "surface.1",
                  border: "1px solid #E3E3E3",
                  borderRadius: "10px",
                  maxHeight: "30svh",
                  overflow: "auto",
                  overscrollBehavior: "contain"
                }}
                elevation={0}
              >
                <ClickAwayListener
                  onClickAway={() => setPresetsAnchor(null)}
                >
                  <MenuList
                    sx={{ paddingRight: "3rem", width: "100%" }}
                  >
                    {presets.map((preset) => (
                      <MenuItem
                        key={preset.id}
                        sx={{ borderTop: "1px solid #E3E3E3" }}
                        onClick={() => setPresetsAnchor(null)}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: 14,
                            ml: "1rem",
                            color: "onSurface",
                          }}
                        >
                          {preset.name}
                        </Typography>
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Stack>

      <Box
        sx={{
          flex: 1,
          bgcolor: "surface.2",
          borderRadius: "16px",
          overflow: "auto",
          my: { xs: "16px", md: "0" },
        }}
      >
        <Box>
          {!shownInputs || !shownParams ? (
            <Box
              sx={{
                width: "100%",
                mt: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress size={20} />
            </Box>
          ) : shownInputs.length === 0 && shownParams.length === 0 ? (
            <Box
              sx={{
                mt: "20vh",
                textAlign: "center",
                color: "onSurface",
                fontSize: 14,
              }}
            >
              No parameters available for this template
            </Box>
          ) : (
            <React.Fragment>
              {shownInputs.map((input, i) => (
                <GeneratorInput
                  key={i}
                  promptId={input.prompt}
                  inputs={[input]}
                  resInputs={resInputs}
                  setResInputs={setResInputs}
                  errors={errors}
                />
              ))}
              {shownParams.map((param, i) => (
                <GeneratorParam
                  key={i}
                  params={[param.param]}
                  promptId={param.prompt}
                  resOverrides={resOverrides}
                  setResOverrides={setResOverrides}
                />
              ))}
            </React.Fragment>
          )}
        </Box>
      </Box>

      <Stack
        sx={{
          display: { xs: "flex", md: "none" },
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
        }}
      >
        <Button
          variant={"text"}
          sx={{
            flex: 1,
            p: "10px 22px",
            fontSize: 15,
            fontWeight: 500,
            borderColor: "onSurface",
          }}
          onClick={exit}
        >
          Back
        </Button>
        <Button
          variant={"contained"}
          startIcon={token ? <LogoApp width={18} color="white" /> : null}
          sx={{
            flex: 2,
            fontSize: 15,
            fontWeight: 500,
            p: "10px 25px",
            border: "none",
            borderRadius: "999px",
            bgcolor: "primary.main",
            color: "onPrimary",
            ":hover": {
              bgcolor: "primary.main",
              color: "onPrimary",
            },
            ":disabled": {
              bgcolor: "surface.5",
              color: "onPrimary",
              borderColor: "transparent",
            },
          }}
          disabled={!allowGenerate || isGenerating}
          onClick={handlePostPrompt}
        >
        {token ? (
          <React.Fragment>
            <Typography ml={2} color={"inherit"}>Start</Typography>
            <Typography ml={"auto"} color={"inherit"}>~360s</Typography>
          </React.Fragment>
        ) : (
          <Typography ml={2} color={"inherit"}>Sign in or Create an account</Typography>
        )}
        </Button>
      </Stack>

      <Stack sx={{ display: { xs: "none", md: "flex" } }}>
        <Stack direction={"row"} alignItems={"center"} m={"20px 10px"}>
          <Button
            variant={"contained"}
            startIcon={token ? <LogoApp width={18} color="white" /> : null}
            sx={{
              flex: 1,
              p: "10px 25px",
              fontWeight: 500,
              borderColor: "primary.main",
              borderRadius: "999px",
              bgcolor: "primary.main",
              color: "onPrimary",
              ":hover": {
                bgcolor: "transparent",
                color: "primary.main",
              },
              ":disabled": {
                bgcolor: "surface.4",
                color: "onTertiary",
                borderColor: "transparent",
              },
            }}
            disabled={!allowGenerate || isGenerating}
            onClick={handlePostPrompt}
          >
            {token ? (
              <React.Fragment>
                <Typography ml={2} color={"inherit"}>Start</Typography>
                <Typography ml={"auto"} color={"inherit"}>~360s</Typography>
              </React.Fragment>
            ) : (
              <Typography ml={2} color={"inherit"}>Sign in or Create an account</Typography>
            )}
          </Button>
          <Loop
            sx={{
              width: "30px",
              height: "30px",
              ml: "10px",
              color: "onSurface",
              visibility: !isGenerating ? "hidden" : "visible",
            }}
          />
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

      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          gap: "15px",
          color: "grey.600",
          fontSize: 14,
          fontWeight: 400,
          my: "20px",
        }}
      >
        Repeat last:
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Box style={keysStyle} sx={{ fontSize: 12, fontWeight: 600 }}>
            SHIFT
          </Box>
          +
          <Box style={keysStyle} sx={{ fontSize: 12, fontWeight: 600 }}>
            R
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};

const keysStyle = {
  padding: "2px 4px",
  letterSpacing: "1px",
  border: "1px solid #E1E2EC",
  borderRadius: "4px",
  boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.12)"
};
