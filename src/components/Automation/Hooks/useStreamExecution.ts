import { useEffect, useRef, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import useToken from "@/hooks/useToken";
import { PromptLiveResponse } from "@/common/types/prompt";
import { setToast } from "@/core/store/toastSlice";
import { useDispatch } from "react-redux";
import { parseMessageData } from "@/common/helpers/parseMessageData";
import { setGeneratingStatus } from "@/core/store/templatesSlice";
import { N8N_RESPONSE_REGEX } from "@/components/Automation/helpers";
import { setGeneratedExecution } from "../../../core/store/executionsSlice";

interface IStreamExecution {
  id: number;
  title: string;
}

const useStreamExecution = () => {
  const token = useToken();
  const dispatch = useDispatch();
  const abortController = useRef(new AbortController());
  const [generatingResponse, setGeneratingResponse] = useState<PromptLiveResponse>({
    created_at: new Date(),
    data: [],
  });

  const streamExecutionHandler = async (response: string) => {
    let executionMatch;
    let regex = new RegExp(N8N_RESPONSE_REGEX);
    while ((executionMatch = regex.exec(response)) !== null) {
      const currentExecution: IStreamExecution = { id: parseInt(executionMatch[2]), title: executionMatch[1] };

      await streamExecution(currentExecution);
    }
  };

  const streamExecution = async (execution: IStreamExecution) => {
    dispatch(setGeneratingStatus(true));

    await fetchEventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/api/meta/template-executions/${execution.id}/get_stream/`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/json",
        },
        openWhenHidden: true,
        signal: abortController.current.signal,
        async onopen(res) {
          console.log("onopen", res);

          if (res.ok && res.status === 200) {
            setGeneratingResponse({ created_at: new Date(), data: [], connectionOpened: true });
          } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
            dispatch(
              setToast({
                message: "Something went wrong. Please try again later",
                severity: "error",
                duration: 6000,
                position: { vertical: "bottom", horizontal: "right" },
              }),
            );
          }
        },
        onmessage(msg) {
          console.log("onmessage", msg);
          try {
            const parseData = parseMessageData(msg.data);
            const message = parseData.message;
            const prompt = parseData.prompt_id;
            const executionId = parseData.template_execution_id;

            if (message === "[CONNECTED]") {
              return;
            }

            if (executionId) {
              setGeneratingResponse(prevState => ({
                id: executionId,
                created_at: prevState.created_at,
                data: prevState.data,
                connectionOpened: true,
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
                dispatch(
                  setToast({
                    message: "Something went wrong during the execution of this prompt",
                    severity: "error",
                    duration: 6000,
                    position: { vertical: "bottom", horizontal: "right" },
                  }),
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
          console.error(err);
          dispatch(setGeneratingStatus(false));
          dispatch(
            setToast({
              message: "Something went wrong. Please try again later",
              severity: "error",
              duration: 6000,
              position: { vertical: "bottom", horizontal: "right" },
            }),
          );
          throw err; // rethrow to stop the operation
        },
        onclose() {
          dispatch(setGeneratingStatus(false));
        },
      },
    );
  };

  useEffect(() => {
    if (generatingResponse.connectionOpened) {
      dispatch(setGeneratedExecution(generatingResponse));
    }
  }, [generatingResponse]);

  return { streamExecutionHandler };
};

export default useStreamExecution;
