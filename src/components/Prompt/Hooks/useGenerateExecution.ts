import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import { setGeneratingStatus } from "@/core/store/templatesSlice";
import { parseMessageData } from "@/common/helpers/parseMessageData";
import { uploadFileHelper } from "../Utils/uploadFileHelper";
import { setAnswers } from "@/core/store/chatSlice";
import { useUploadFileMutation } from "@/core/api/uploadFile";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import useToken from "../../../hooks/useToken";
import useChat from "./useChat";
import useChatBox from "./useChatBox";
import useApiAccess from "./useApiAccess";
import { useStopExecutionMutation } from "@/core/api/executions";
import { setGeneratedExecution } from "@/core/store/executionsSlice";
import type { PromptLiveResponse } from "@/common/types/prompt";
import type { ResPrompt } from "@/core/api/dto/prompts";
import type { Templates } from "@/core/api/dto/templates";
import type { IAnswer } from "../Types/chat";
import { useStoreAnswersAndParams } from "@/hooks/useStoreAnswersAndParams";

interface Props {
  template: Templates;
  questionPrefixContent: string;
  onError: (errMsg: string) => void;
}
const useGenerateExecution = ({ template, questionPrefixContent, onError }: Props) => {
  const token = useToken();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [uploadFile] = useUploadFileMutation();
  const [stopExecution] = useStopExecutionMutation();

  const { answers, inputs, paramsValues } = useAppSelector(state => state.chat);

  const [newExecutionId, setNewExecutionId] = useState<number | null>(null);
  const [disableChatInput, setDisableChatInput] = useState(false);
  const [generatingResponse, setGeneratingResponse] = useState<PromptLiveResponse>({
    created_at: new Date(),
    data: [],
  });
  const uploadedFiles = useRef(new Map<string, string>());
  const abortController = useRef(new AbortController());

  const { messageAnswersForm } = useChat({
    questionPrefixContent,
    template,
  });
  const { preparePromptsData } = useChatBox();
  const { dispatchNewExecutionData } = useApiAccess();
  const { storeAnswers, storeParams } = useStoreAnswersAndParams();

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
      storeAnswers(answers);
      storeParams(paramsValues);
      return router.push("/signin");
    }

    const filesUploaded = await validateAndUploadFiles();
    if (!filesUploaded.status) {
      const invalids = filesUploaded.answers
        .filter(answers => answers.error)
        .map(answer => inputs.find(input => input.name === answer.inputName)?.fullName);

      messageAnswersForm(`Please enter valid answers for "${invalids.join(", ")}"`);
      return;
    }

    dispatch(setGeneratingStatus(true));

    const promptsData = preparePromptsData(uploadedFiles.current, answers, paramsValues, template.prompts);

    uploadedFiles.current.clear();

    generateExecution(promptsData);
  };

  const generateExecution = (executionData: ResPrompt[]) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/meta/templates/${template!.id}/execute/`;

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

  useEffect(() => {
    if (answers.length) {
      dispatch(setGeneratedExecution(generatingResponse));
    }
  }, [generatingResponse]);

  useEffect(() => {
    dispatchNewExecutionData();
  }, [template]);

  return { generateExecution, generateExecutionHandler, disableChatInput, abortConnection };
};

export default useGenerateExecution;
