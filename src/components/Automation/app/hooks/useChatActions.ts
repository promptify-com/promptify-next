import { type Dispatch, type SetStateAction } from "react";
import type { IMessage } from "@/components/Automation/ChatInterface/types";
import type { IWorkflowCreateResponse } from "@/components/Automation/types";
import { IApp } from "@/components/Automation/app/hooks/types";
import { createMessage } from "@/components/Automation/ChatInterface/helper";
import { RootState } from "@/core/store";
import { useAppSelector } from "@/hooks/useStore";
import { setSelectedApp } from "@/core/store/chatSlice";
import { usePauseWorkflowMutation, useResumeWorkflowMutation, useUpdateWorkflowMutation } from "@/core/api/workflows";

interface Props {
  setMessages: Dispatch<SetStateAction<IMessage[]>>;
}

const useChatActions = ({ setMessages }: Props) => {
  const { selectedApp } = useAppSelector((state: RootState) => state.chat);

  const [updateAppMutation] = useUpdateWorkflowMutation();
  const [pauseWorkflowMutation] = usePauseWorkflowMutation();
  const [resumeWorkflowMutation] = useResumeWorkflowMutation();

  const updateWorkflow = async (workflowData: IApp) => {
    try {
      return await updateAppMutation({
        workflowId: workflowData.id,
        data: workflowData as unknown as IWorkflowCreateResponse,
      }).unwrap();
    } catch (error) {
      console.error("Updating workflow failed", error);
    }
  };

  const handlePause = async () => {
    if (!selectedApp || !selectedApp.periodic_task) return;
    try {
      await pauseWorkflowMutation({ workflowId: selectedApp.id }).unwrap();
      setSelectedApp({
        ...selectedApp,
        periodic_task: {
          ...selectedApp.periodic_task,
          enabled: false,
        },
      });

      const successMessage = createMessage({
        type: "text",
        text: "The AI app has been successfully paused. It will remain inactive until you resume it.",
        isHighlight: true,
      });
      setMessages(prevMessages => prevMessages.concat(successMessage));
    } catch (err) {
      const errorMessage = createMessage({
        type: "text",
        text: "Failed to pause the AI app. Please try again or contact support if the issue persists.",
        isHighlight: true,
      });
      setMessages(prevMessages => prevMessages.concat(errorMessage));
      console.error("Failed to pause workflow", err);
    }
  };

  const handleResume = async () => {
    if (!selectedApp || !selectedApp.periodic_task) return;

    try {
      await resumeWorkflowMutation({ workflowId: selectedApp.id }).unwrap();
      setSelectedApp({
        ...selectedApp,
        periodic_task: {
          ...selectedApp.periodic_task,
          enabled: true,
        },
      });
      const successMessage = createMessage({
        type: "text",
        text: "The AI app has been successfully resumed and is back to running as scheduled",
        isHighlight: true,
      });
      setMessages(prevMessages => prevMessages.concat(successMessage));
    } catch (err) {
      const errorMessage = createMessage({
        type: "text",
        text: "Failed to resume the AI app. Please try again or contact support for assistance.",
        isHighlight: true,
      });
      setMessages(prevMessages => prevMessages.concat(errorMessage));
      console.error("Failed to pause workflow", err);
    }
  };

  return {
    handlePause,
    handleResume,
    updateWorkflow,
  };
};

export default useChatActions;
