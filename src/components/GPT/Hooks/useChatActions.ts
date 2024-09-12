import type { Dispatch, SetStateAction } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { initialState, setClonedWorkflow } from "@/core/store/chatSlice";
import { usePauseWorkflowMutation, useResumeWorkflowMutation } from "@/core/api/workflows";
import { createMessage } from "@/components/Chat/helper";
import type { IMessage } from "@/components/Prompt/Types/chat";

interface Props {
  setMessages: Dispatch<SetStateAction<IMessage[]>>;
}

const useChatActions = ({ setMessages }: Props) => {
  const dispatch = useAppDispatch();

  const [pauseWorkflow] = usePauseWorkflowMutation();
  const [resumeWorkflow] = useResumeWorkflowMutation();

  const clonedWorkflow = useAppSelector(state => state.chat?.clonedWorkflow ?? initialState.clonedWorkflow);

  const handlePause = async () => {
    if (!clonedWorkflow || !clonedWorkflow.periodic_task) return;
    try {
      await pauseWorkflow(clonedWorkflow.id);
      dispatch(
        setClonedWorkflow({
          ...clonedWorkflow,
          periodic_task: {
            ...clonedWorkflow.periodic_task,
            enabled: false,
          },
        }),
      );
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
    if (!clonedWorkflow || !clonedWorkflow.periodic_task) return;

    try {
      await resumeWorkflow(clonedWorkflow.id);
      dispatch(
        setClonedWorkflow({
          ...clonedWorkflow,
          periodic_task: {
            ...clonedWorkflow.periodic_task,
            enabled: true,
          },
        }),
      );
      const successMessage = createMessage({
        type: "text",
        text: "The AI app has been successfully resumed and is back to running as scheduled",
        isHighlight: true,
      });
      setMessages(prevMessages => prevMessages.concat(successMessage));
    } catch (err) {
      console.error("Failed to resume workflow", err);
      const errorMessage = createMessage({
        type: "text",
        text: "Failed to resume the AI app. Please try again or contact support for assistance.",
        isHighlight: true,
      });
      setMessages(prevMessages => prevMessages.concat(errorMessage));
      console.error("Failed to pause workflow", err);
    }
  };

  return { handlePause, handleResume };
};

export default useChatActions;
