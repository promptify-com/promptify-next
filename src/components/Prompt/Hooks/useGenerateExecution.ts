import { useState } from "react";
import { useAppDispatch } from "@/hooks/useStore";
import useToken from "../../../hooks/useToken";
import { PromptLiveResponse } from "@/common/types/prompt";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { ResPrompt } from "@/core/api/dto/prompts";
import { setGeneratingStatus } from "@/core/store/templatesSlice";
import { parseMessageData } from "@/common/helpers/parseMessageData";

const useGenerateExecution = (templateId: number, onError: (errMsg: string) => void) => {
  const token = useToken();
  const dispatch = useAppDispatch();
  const [generatingResponse, setGeneratingResponse] = useState<PromptLiveResponse | null>(null);
  const [lastExecution, setLastExecution] = useState<ResPrompt[] | null>(null);

  const generateExecution = (executionData: ResPrompt[]) => {
    setLastExecution(executionData);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/meta/templates/${templateId}/execute/`;

    fetchEventSource(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(executionData),
      openWhenHidden: true,

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
            setGeneratingResponse(prevState => ({
              id: executionId,
              created_at: prevState?.created_at || new Date(),
              data: [...(prevState?.data || [])],
            }));
          }

          if (msg.event === "infer" && msg.data) {
            if (message) {
              setGeneratingResponse(prevState => {
                if (!prevState) {
                  return { created_at: new Date(), data: [] };
                }

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
              onError(message.replace("[ERROR]", ""));

              return;
            }

            setGeneratingResponse(prevState => {
              if (!prevState) {
                return { created_at: new Date(), data: [] };
              }

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
        dispatch(setGeneratingStatus(false));
        onError("Something went wrong. Please try again later");
        throw err;
      },
      onclose() {
        dispatch(setGeneratingStatus(false));
      },
    });
  };

  return { generateExecution, generatingResponse, lastExecution };
};

export default useGenerateExecution;
