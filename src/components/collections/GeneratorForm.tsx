import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Loop, MoreHoriz } from "@mui/icons-material";
import {
  PromptParams,
  ResInputs,
  ResOverrides,
  ResPrompt,
} from "@/core/api/dto/prompts";
import { PromptLiveResponse } from "@/common/types/prompt";
import useToken from "@/hooks/useToken";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { promptsApi, useGetExecutionTemplateQuery } from "@/core/api/prompts";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { GeneratorInput } from "./GeneratorInput";
import { GeneratorParam } from "./GeneratorParam";
import { savePathURL } from "@/common/utils";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { getArrayFromString } from "@/common/helpers/getArrayFromString";
import { setExecuteId } from "@/core/store/templatesSlice";
import { Templates } from "@/core/api/dto/templates";
import { LogoApp } from "@/assets/icons/LogoApp";
import { useWindowSize } from "usehooks-ts";
import { useRouter } from "next/router";

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
  const executeId = useAppSelector((state) => state.template.executeId);
  const router = useRouter();
  const { width: windowWidth } = useWindowSize();

  const [data, setData] = useState<PromptLiveResponse | null>(null);
  const [resPrompts, setResPrompts] = useState<ResPrompt[]>([]);
  const [lastExecution, setLastExecution] = useState<ResPrompt[] | null>(null);
  const [resInputs, setResInputs] = useState<ResInputs[]>([]);
  const [resOverrides, setResOverrides] = useState<ResOverrides[]>([]);
  const [errors, setErrors] = useState<InputsErrors>({});
  const [executionResReady, setExecutionResReady] = useState<boolean>(false);
  const { data: executeData } = useGetExecutionTemplateQuery(
    executionResReady && executeId ? executeId : skipToken
  );
  const [shownInputs, setShownInputs] = useState<Input[] | null>(null);
  const [shownParams, setShownParams] = useState<Param[] | null>(null);

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

    if (!token) {
      setErrors({});
      return true;
    }
    if (Object.keys(tempErrors).length > 0) {
      setErrors({ ...tempErrors });
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

    if (!isInputsFilled()) return;

    generateExecution(resPrompts);
  };

  const generateExecution = (executionData: ResPrompt[]) => {
    setLastExecution(JSON.parse(JSON.stringify(executionData)));

    setIsGenerating(true);

    if (windowWidth < 900) setTimeout(() => exit(), 2000);

    let isOpened = false;
    let tempData: any[] = [];
    fetchEventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/api/meta/templates/${templateData.id}/execute/`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(executionData),

        onmessage(msg) {
          if (!isOpened) {
            setIsGenerating(true);
            isOpened = true;
            setData({ created_at: new Date(), data: [] });
          }
          try {
            const parseData = JSON.parse(msg.data.replace(/'/g, '"'));
            const message = parseData.message;
            const prompt = parseData.prompt_id;
            const templateExecutionId = parseData.template_execution_id;

            if (templateExecutionId) {
              dispatch(setExecuteId(templateExecutionId));
            }

            if (msg.event === "infer" && msg.data) {
              if (message) {
                const tempArr = [...tempData];
                const activePrompt = tempArr.findIndex(
                  (template) => template.prompt === +prompt
                );

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
                setData((prevState) => ({
                  created_at: prevState?.created_at || new Date(),
                  data: tempArr,
                }));
              }
            } else {
              const tempArr = [...tempData];
              const activePrompt = tempArr.findIndex(
                (template) => template.prompt === +prompt
              );

              if (message === "[COMPLETED]") {
                tempArr[activePrompt] = {
                  ...tempArr[activePrompt],
                  prompt,
                  isLoading: false,
                  isCompleted: true,
                };
              }

              if (message === "[INITIALIZING]") {
                if (activePrompt === -1) {
                  tempArr.push({
                    message: "",
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

              if (message.includes("[ERROR]")) {
                onError(message);
              }

              tempData = [...tempArr];
              setData((prevState) => ({
                created_at: prevState?.created_at || new Date(),
                data: tempArr,
              }));
            }
          } catch {
            console.log(msg.event);
          }
        },
        onerror(err) {
          console.log(err);
          setIsGenerating(false);
          onError("Something went wrong. Please try again later.");
        },
        onclose() {
          setIsGenerating(false);
          setExecutionResReady(true);
        },
      }
    );
  };

  useEffect(() => {
    if (data) setNewExecutionData(data);
  }, [data]);

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
    if (executeData) {
      setData((prevState) => ({
        created_at: prevState?.created_at || new Date(),
        data: executeData.prompt_executions.map((prompt, idx) => ({
          created_at: prevState?.data
            ? prevState?.data[idx]?.created_at
            : new Date(),
          isCompleted: true,
          isLoading: false,
          prompt: prompt.prompt,
          message: prompt.output,
        })),
      }));
    }
  }, [executeData]);

  useEffect(() => {
    // reset inputs and params states
    setShownInputs(null);
    setShownParams(null);

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

  // reset lastExecution state after template is changed to prevent incorrect execution generating
  useEffect(() => {
    setLastExecution(null);
  }, [templateData]);

  return (
    <Stack
      sx={{
        minHeight: { xs: 0, md: "100%" },
        height: { xs: "calc(100% - 62px)", md: "auto" },
        width: { xs: "100%", md: "calc(100% - 20px)" },
        ml: { md: "20px" },
      }}
    >
      <Box
        sx={{
          flex: 1,
          bgcolor: "surface.2",
          borderRadius: "16px",
          overflow: "auto",
          my: { xs: "16px", md: "0" },
        }}
      >
        <Stack
          sx={{
            display: { xs: "none", md: "flex" },
            p: "16px 8px 16px 13px",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            component={"img"}
            src={templateData.thumbnail || "http://placehold.it/240x150"}
            alt={"alt"}
            sx={{
              width: 64,
              height: 48,
              objectFit: "cover",
              borderRadius: "999px",
            }}
          />
          <Box>
            <Typography
              fontSize={14}
              color={"onSurface"}
              dangerouslySetInnerHTML={{ __html: templateData.title }}
            />
            <Typography
              fontSize={12}
              color={"grey.600"}
              dangerouslySetInnerHTML={{ __html: templateData.category.name }}
            />
          </Box>
          <MoreHoriz
            sx={{
              alignSelf: "baseline",
              ml: "auto",
              cursor: "pointer",
              mt: "5px",
              opacity: 0.6,
              ":hover": { opacity: 1 },
            }}
          />
        </Stack>

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
          ) : shownInputs.length === 0 && shownInputs.length === 0 ? (
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
        {token ? (
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
            disabled={isGenerating}
            onClick={handlePostPrompt}
          >
            <Typography ml={2} color={"inherit"} fontSize={"inherit"}>
              Start
            </Typography>
            <Typography ml={"auto"} color={"inherit"} fontSize={"inherit"}>
              ~360s
            </Typography>
          </Button>
        ) : (
          <Button
            variant={"contained"}
            sx={{
              flex: 2,
              p: "10px 25px",
              border: "none",
              borderRadius: "999px",
              bgcolor: "primary.main",
              color: "onPrimary",
              ":hover": {
                bgcolor: "transparent",
                color: "primary.main",
              },
            }}
            onClick={handlePostPrompt}
          >
            Sign in or Create an account
          </Button>
        )}
      </Stack>

      <Stack sx={{ display: { xs: "none", md: "flex" } }}>
        {token ? (
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
                  bgcolor: "surface.5",
                  color: "onPrimary",
                  borderColor: "transparent",
                },
              }}
              disabled={isGenerating}
              onClick={handlePostPrompt}
            >
              <Typography ml={2} color={"inherit"}>
                Start
              </Typography>
              <Typography ml={"auto"} color={"inherit"}>
                ~360s
              </Typography>
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
        ) : (
          <Button
            variant={"contained"}
            sx={{
              flex: 1,
              p: "10px 25px",
              m: "20px 10px",
              fontWeight: 500,
              borderColor: "primary.main",
              borderRadius: "999px",
              bgcolor: "primary.main",
              color: "onPrimary",
              ":hover": {
                bgcolor: "transparent",
                color: "primary.main",
              },
            }}
            onClick={handlePostPrompt}
          >
            Sign in or Create an account
          </Button>
        )}
      </Stack>

      {Object.keys(errors).length > 0 && (
        <Typography
          color={"error"}
          mt={2}
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
          mt: "40px",
          mb: "20px",
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

      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          gap: "15px",
          color: "grey.600",
          fontSize: 14,
          fontWeight: 400,
          mb: "20px",
        }}
      >
        Next/Prev template:
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Box style={keysStyle} sx={{ fontSize: 12, fontWeight: 600 }}>
            SHIFT
          </Box>
          +
          <Box style={keysStyle} sx={{ fontSize: 12, fontWeight: 600 }}>
            {"<"}
          </Box>
          <Box style={keysStyle} sx={{ fontSize: 12, fontWeight: 600 }}>
            {">"}
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
  boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.12)",
};
