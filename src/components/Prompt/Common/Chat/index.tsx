import { useState, useMemo, memo, useEffect, useRef } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { LogoApp } from "@/assets/icons/LogoApp";
import { useAppSelector, useAppDispatch } from "@/hooks/useStore";
import useToken from "@/hooks/useToken";
import { ChatInterface } from "./ChatInterface";
import { ChatInput } from "./ChatInput";
import { setGeneratingStatus } from "@/core/store/templatesSlice";
import { executionsApi, useStopExecutionMutation } from "@/core/api/executions";
import { vary } from "@/common/helpers/varyValidator";
import { parseMessageData } from "@/common/helpers/parseMessageData";
import { useUploadFileMutation } from "@/core/api/uploadFile";
import { uploadFileHelper } from "@/components/Prompt/Utils/uploadFileHelper";
import { setGeneratedExecution, setRepeatedExecution, setSelectedExecution } from "@/core/store/executionsSlice";
import useChatBox from "@/hooks/useChatBox";
import useChat from "@/components/Prompt/Hooks/useChat";
import { randomId } from "@/common/helpers";
import { getExecutionById } from "@/hooks/api/executions";
import { setAnswers, setInputs, setParams, setParamsValues } from "@/core/store/chatSlice";
import type { Templates } from "@/core/api/dto/templates";
import type { IPromptInput, PromptLiveResponse } from "@/common/types/prompt";
import type { PromptParams, ResOverrides, ResPrompt } from "@/core/api/dto/prompts";
import type { IAnswer, IMessage, VaryValidatorResponse } from "@/components/Prompt/Types/chat";
import type { PromptInputType } from "@/components/Prompt/Types";
import useApiAccess from "@/components/Prompt/Hooks/useApiAccess";

interface Props {
  onError: (errMsg: string) => void;
  template: Templates;
  questionPrefixContent: string;
}

const GeneratorChat: React.FC<Props> = ({ onError, template, questionPrefixContent }) => {
  const token = useToken();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [stopExecution] = useStopExecutionMutation();
  const [uploadFile] = useUploadFileMutation();

  const currentUser = useAppSelector(state => state.user.currentUser);
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const isSidebarExpanded = useAppSelector(state => state.template.activeSideBarLink);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);

  const answers = useAppSelector(state => state.chat.answers);
  const paramsValues = useAppSelector(state => state.chat.paramsValues);
  const isSimulationStreaming = useAppSelector(state => state.chat.isSimulationStreaming);

  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);
  const [newExecutionId, setNewExecutionId] = useState<number | null>(null);
  const [disableChatInput, setDisableChatInput] = useState(false);
  const [generatingResponse, setGeneratingResponse] = useState<PromptLiveResponse>({
    created_at: new Date(),
    data: [],
  });

  const { preparePromptsData, prepareAndRemoveDuplicateInputs } = useChatBox();
  const { dispatchNewExecutionData } = useApiAccess();

  const abortController = useRef(new AbortController());
  const uploadedFiles = useRef(new Map<string, string>());

  const { messages, setMessages, initialMessages, messageAnswersForm } = useChat({
    questionPrefixContent,
    template,
  });

  const [_inputs, _params, promptHasContent]: [IPromptInput[], PromptParams[], boolean] = useMemo(() => {
    if (!template) {
      return [[], [], false];
    }

    const { inputs, params, promptHasContent } = prepareAndRemoveDuplicateInputs(template.prompts, template.questions);

    initialMessages({ inputs });

    const valuesMap = new Map<number, ResOverrides>();
    params
      .filter(param => param.is_visible)
      .forEach(_param => {
        const paramId = _param.parameter.id;
        valuesMap.set(_param.prompt, {
          id: _param.prompt,
          contextual_overrides: (valuesMap.get(_param.prompt)?.contextual_overrides ?? []).concat({
            parameter: paramId,
            score: _param.score,
          }),
        });
      });

    dispatch(setParamsValues(Array.from(valuesMap.values())));
    dispatch(setParams(params));
    dispatch(setInputs(inputs));

    return [inputs, params, promptHasContent];
  }, [template]);

  const disabledButton = _inputs.length !== 0 || promptHasContent;

  const allRequiredInputsAnswered = (): boolean => {
    const requiredInputs = _inputs.filter(input => input.required).map(input => input.name);

    if (!requiredInputs.length) {
      return true;
    }

    const answeredInputsSet = new Set(answers.map(answer => answer.inputName));

    return requiredInputs.every(name => answeredInputsSet.has(name));
  };

  const showGenerate =
    !isSimulationStreaming && (showGenerateButton || Boolean(!_inputs.length || !_inputs[0]?.required));

  useEffect(() => {
    if (allRequiredInputsAnswered()) {
      setShowGenerateButton(true);
    } else {
      setShowGenerateButton(false);
    }
  }, [answers]);

  useEffect(() => {
    dispatchNewExecutionData();
  }, [template]);

  useEffect(() => {
    if (answers.length) {
      dispatch(setGeneratedExecution(generatingResponse));
    }
  }, [generatingResponse]);

  useEffect(() => {
    if (!isGenerating && generatedExecution?.data?.length) {
      const allPromptsCompleted = generatedExecution.data.every(execData => execData.isCompleted);

      if (allPromptsCompleted) {
        selectGeneratedExecution();
        dispatch(executionsApi.util.invalidateTags(["Executions"]));
      }
    }
  }, [isGenerating, generatedExecution]);

  const selectGeneratedExecution = async () => {
    if (generatedExecution?.id) {
      try {
        const _newExecution = await getExecutionById(generatedExecution.id);
        dispatch(setSelectedExecution(_newExecution));
      } catch {
        window.location.reload();
      }
    }
  };

  const validateVary = async (variation: string) => {
    dispatch(setSelectedExecution(null));
    dispatch(setGeneratedExecution(null));
    if (variation) {
      const userMessage: IMessage = {
        id: randomId(),
        text: variation,
        type: "text",
        createdAt: new Date(new Date().getTime() - 1000),
        fromUser: true,
      };

      setMessages(prevMessages =>
        prevMessages.filter(msg => msg.type !== "form" && msg.type !== "spark").concat(userMessage),
      );

      setIsValidatingAnswer(true);

      const questionAnswerMap: Record<string, PromptInputType> = {};
      _inputs.forEach(input => {
        const matchingAnswer = answers.find(answer => answer.inputName === input.name);
        questionAnswerMap[input.name] = matchingAnswer?.answer ?? "";
      });

      const payload = {
        prompt: variation,
        variables: questionAnswerMap,
      };

      let varyResponse: VaryValidatorResponse | string;
      try {
        varyResponse = await vary({ token, payload });
      } catch (err) {
        varyResponse = "error";
      }

      if (typeof varyResponse === "string") {
        setIsValidatingAnswer(false);
        messageAnswersForm("Oops! I couldn't get your reponse, Please try again.");
        return;
      }

      const validatedAnswers = varyResponse;

      const newAnswers: IAnswer[] = _inputs
        .map(input => {
          const { name: inputName, required, question, prompt } = input;
          const answer = validatedAnswers[input.name];
          const promptId = prompt!;

          return {
            inputName,
            required,
            question: question ?? "",
            prompt: promptId,
            answer,
          };
        })
        .filter(answer => answer.answer);
      dispatch(setAnswers(newAnswers));
      setIsValidatingAnswer(false);

      const isReady = allRequiredInputsAnswered() ? " Let’s imagine something like this! Prepared request for you" : "";
      messageAnswersForm(`Ok!${isReady}, please check input information and we are ready to start!`);
    }
  };

  const validateAndUploadFiles = () =>
    new Promise<{ status: boolean; answers: IAnswer[] }>(async resolve => {
      let status = true;
      const _answers = await Promise.all(
        [...answers].map(async answer => {
          if (answer.answer instanceof File && !uploadedFiles.current.has(answer.inputName)) {
            const res = await uploadFileHelper(uploadFile, { file: answer.answer });
            const fileUrl = res?.file;

            if (typeof fileUrl === "string" && fileUrl) {
              uploadedFiles.current.set(answer.inputName, fileUrl);
            } else {
              answer.error = true;
              if (answer.required) {
                status = false;
              }
            }
          }
          return answer;
        }),
      );
      dispatch(setAnswers(_answers));
      resolve({ status, answers: _answers });
    });

  const generateExecutionHandler = async () => {
    if (!token) {
      return router.push("/signin");
    }

    dispatch(setSelectedExecution(null));
    dispatch(setRepeatedExecution(null));

    const filesUploaded = await validateAndUploadFiles();
    if (!filesUploaded.status) {
      const invalids = filesUploaded.answers
        .filter(answers => answers.error)
        .map(answer => _inputs.find(input => input.name === answer.inputName)?.fullName);

      messageAnswersForm(`Please enter valid answers for "${invalids.join(", ")}"`);
      return;
    }

    dispatch(setGeneratingStatus(true));

    const promptsData = preparePromptsData(uploadedFiles.current, answers, paramsValues, template.prompts);

    uploadedFiles.current.clear();

    generateExecution(promptsData);
  };

  const generateExecution = (executionData: ResPrompt[]) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/meta/templates/${template.id}/execute/`;

    fetchEventSource(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(executionData),
      openWhenHidden: true,
      signal: abortController.current.signal,
      async onopen(res) {
        if (res.ok && res.status === 200) {
          dispatch(setGeneratingStatus(true));
          setGeneratingResponse({ created_at: new Date(), data: [] });
        } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          console.error("Client side error ", res);
          onError("Something went wrong. Please try again later");
        }
      },
      onmessage(msg) {
        try {
          const parseData = parseMessageData(msg.data);
          const message = parseData.message;
          const prompt = parseData.prompt_id;
          const executionId = parseData.template_execution_id;

          // event: status, data:{"message": "[CONNECTED]"}
          if (message === "[CONNECTED]") {
            return;
          }

          if (executionId) {
            setNewExecutionId(executionId);
            setGeneratingResponse(prevState => ({
              id: executionId,
              created_at: prevState.created_at,
              data: prevState.data,
            }));
          }

          if (msg.event === "infer" && msg.data) {
            if (message) {
              setGeneratingResponse(prevState => {
                const newState = { ...prevState, data: [...prevState.data] };
                const activePromptIndex = newState.data.findIndex(promptData => promptData.prompt === +prompt);

                if (activePromptIndex === -1) {
                  newState.data.push({ message, prompt, created_at: new Date() });
                } else {
                  newState.data[activePromptIndex] = {
                    ...newState.data[activePromptIndex],
                    message: newState.data[activePromptIndex].message + message,
                  };
                }

                return newState;
              });
            }
          } else {
            if (message.includes("[ERROR]")) {
              onError(
                message ? message.replace("[ERROR]", "") : "Something went wrong during the execution of this prompt",
              );

              return;
            }

            setGeneratingResponse(prevState => {
              const newState = { ...prevState, data: [...prevState.data] };
              const activePromptIndex = newState.data.findIndex(promptData => promptData.prompt === +prompt);

              if (message === "[INITIALIZING]") {
                if (activePromptIndex === -1) {
                  newState.data.push({
                    message: "",
                    prompt,
                    isLoading: true,
                    created_at: new Date(),
                  });
                } else {
                  newState.data[activePromptIndex] = {
                    ...newState.data[activePromptIndex],
                    isLoading: true,
                  };
                }
              }

              if (message === "[COMPLETED]") {
                newState.data[activePromptIndex] = {
                  ...newState.data[activePromptIndex],
                  isLoading: false,
                  isCompleted: true,
                };
              }

              return newState;
            });
          }
        } catch {
          console.info("invalid incoming msg:", msg);
        }
      },
      onerror(err) {
        setDisableChatInput(false);
        dispatch(setGeneratingStatus(false));

        if (abortController.current.signal.aborted) {
          return;
        }

        onError("Something went wrong. Please try again later");
        throw err; // rethrow to stop the operation
      },
      onclose() {
        setDisableChatInput(false);
        dispatch(setGeneratingStatus(false));
      },
    });
  };

  const abortConnection = () => {
    abortController.current.abort();
    if (newExecutionId) {
      stopExecution(newExecutionId);
    }
  };

  return (
    <Box
      width={{ md: isSidebarExpanded ? "100%" : "80%" }}
      mx={{ md: "auto" }}
      height={"100%"}
    >
      <Stack
        justifyContent={"flex-end"}
        height={"calc(100% - 20px)"}
        gap={2}
      >
        <ChatInterface
          messages={messages}
          template={template}
          showGenerate={showGenerate}
          onGenerate={generateExecutionHandler}
          onAbort={abortConnection}
        />
        {currentUser?.id ? (
          <ChatInput
            onSubmit={validateVary}
            disabled={isValidatingAnswer || disableChatInput}
            isValidating={isValidatingAnswer}
            showGenerate={showGenerateButton}
            onGenerate={generateExecutionHandler}
          />
        ) : (
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={1}
            width={{ md: "100%" }}
            p={{ md: "16px 8px 16px 16px" }}
          >
            <Button
              onClick={() => {
                router.push("/signin");
              }}
              variant={"contained"}
              startIcon={
                <LogoApp
                  width={18}
                  color="white"
                />
              }
              sx={{
                flex: 1,
                p: "10px 25px",
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
              }}
            >
              <Typography
                ml={2}
                color={"inherit"}
              >
                Sign in or Create an account
              </Typography>
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default memo(GeneratorChat);
