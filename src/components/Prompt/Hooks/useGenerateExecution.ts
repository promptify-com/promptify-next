import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { setGeneratingStatus } from "@/core/store/templatesSlice";
import { parseMessageData } from "@/common/helpers/parseMessageData";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import useToken from "@/hooks/useToken";
import useChatBox from "@/components/Prompt/Hooks/useChatBox";
import { useStopExecutionMutation } from "@/core/api/executions";
import { setGeneratedExecution, setSelectedExecution } from "@/core/store/executionsSlice";
import { useStoreAnswersAndParams } from "@/hooks/useStoreAnswersAndParams";
import useUploadPromptFiles from "@/hooks/useUploadPromptFiles";
import { setAnswers } from "@/core/store/chatSlice";
import { setToast } from "@/core/store/toastSlice";
import type { PromptLiveResponse } from "@/common/types/prompt";
import type { Templates } from "@/core/api/dto/templates";
import { N8N_RESPONSE_REGEX } from "@/components/Automation/helpers";
import { EXECUTE_ERROR_TOAST } from "@/components/Prompt/Constants";

interface IStreamExecution {
  id: number;
  title: string;
}

interface Props {
  template?: Templates;
  messageAnswersForm?: (message: string) => void;
}
const useGenerateExecution = ({ template, messageAnswersForm }: Props) => {
  const token = useToken();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { uploadedFiles, uploadPromptAnswersFiles } = useUploadPromptFiles();
  const [stopExecution] = useStopExecutionMutation();

  const { answers, inputs, paramsValues } = useAppSelector(state => state.chat);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);

  const [newExecutionId, setNewExecutionId] = useState<number | null>(null);
  const [disableChatInput, setDisableChatInput] = useState(false);
  const [generatingResponse, setGeneratingResponse] = useState<PromptLiveResponse>({
    created_at: new Date(),
    data: [],
  });
  const abortController = useRef(new AbortController());
  const generatingCompleted = useRef(false);

  const { preparePromptsData } = useChatBox();
  const { storeAnswers, storeParams } = useStoreAnswersAndParams();

  const generateExecutionHandler = async (onGenerateExecution = (executionId: number) => {}) => {
    if (!template) return;

    if (!token) {
      storeAnswers(answers);
      storeParams(paramsValues);
      return router.push("/signin");
    }

    const filesUploaded = await uploadPromptAnswersFiles(answers, uploadedFiles.current);
    const _answers = filesUploaded.answers;
    dispatch(setAnswers(_answers));
    if (!filesUploaded.status) {
      const invalids = _answers
        .filter(answers => answers.error)
        .map(answer => inputs.find(input => input.name === answer.inputName)?.fullName);

      if (typeof messageAnswersForm === "function") {
        messageAnswersForm(`Please enter valid answers for "${invalids.join(", ")}"`);
      }

      return;
    }

    dispatch(setGeneratingStatus(true));

    const promptsData = preparePromptsData(uploadedFiles.current, _answers, paramsValues, template.prompts);

    dispatch(setSelectedExecution(null));
    uploadedFiles.current.clear();

    const endpoint = `/api/meta/templates/${template.id}/execute/`;
    fetchExecution({ endpoint, method: "POST", body: JSON.stringify(promptsData), onGenerateExecution });
  };

  const streamExecutionHandler = async (response: string) => {
    let executionMatch;
    let regex = new RegExp(N8N_RESPONSE_REGEX);

    dispatch(setGeneratedExecution({ hasNext: true } as PromptLiveResponse));
    generatingCompleted.current = false;
    while ((executionMatch = regex.exec(response)) !== null) {
      const currentExecution: IStreamExecution = { id: parseInt(executionMatch[2]), title: executionMatch[1] };

      const endpoint = `/api/meta/template-executions/${currentExecution.id}/get_stream/`;
      await fetchExecution({ endpoint, method: "GET", streamExecution: currentExecution });
    }
    generatingCompleted.current = true;
  };

  const fetchExecution = async ({
    endpoint,
    method,
    body,
    streamExecution,
    onGenerateExecution,
  }: {
    endpoint: string;
    method: string;
    body?: string;
    streamExecution?: IStreamExecution;
    onGenerateExecution?: (executionId: number) => void;
  }) => {
    await fetchEventSource(process.env.NEXT_PUBLIC_API_URL + endpoint, {
      method,
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      ...(body && { body }),
      openWhenHidden: true,
      signal: abortController.current.signal,
      async onopen(res) {
        if (res.ok && res.status === 200) {
          dispatch(setGeneratingStatus(true));
          setGeneratingResponse({
            created_at: new Date(),
            data: [],
            connectionOpened: true,
            temp_title: streamExecution?.title,
          });
        } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          dispatch(setToast(EXECUTE_ERROR_TOAST));
        }
      },
      onmessage(msg) {
        try {
          const parseData = parseMessageData(msg.data);
          const message = parseData.message;
          const prompt = parseData.prompt_id;
          const executionId = parseData.template_execution_id;

          if (message === "[CONNECTED]") {
            return;
          }

          if (executionId) {
            setNewExecutionId(executionId);
            onGenerateExecution?.(executionId);
            setGeneratingResponse(prevState => ({
              ...prevState,
              id: executionId,
              created_at: prevState.created_at,
              data: prevState.data,
              connectionOpened: true,
            }));
          }

          if (message.includes("[ERROR]")) {
            dispatch(setToast(EXECUTE_ERROR_TOAST));
            setGeneratingResponse(prevState => {
              const newState = { ...prevState, data: [...prevState.data] };
              const activePromptIndex = newState.data.findIndex(promptData => promptData.prompt === +prompt);
              if (activePromptIndex !== -1) {
                newState.data[activePromptIndex] = {
                  ...newState.data[activePromptIndex],
                  isLoading: false,
                  isCompleted: true,
                };
              }
              return newState;
            });
            return;
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
        dispatch(setToast(EXECUTE_ERROR_TOAST));
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
    dispatch(setGeneratingStatus(false));
  };

  useEffect(() => {
    if (generatingResponse.connectionOpened) {
      dispatch(
        setGeneratedExecution({
          ...generatingResponse,
          hasNext: !generatingCompleted.current,
        }),
      );
    }
  }, [generatingResponse]);

  return { generateExecutionHandler, streamExecutionHandler, disableChatInput, abortConnection };
};

export default useGenerateExecution;
