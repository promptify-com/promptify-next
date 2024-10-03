import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { ITemplateWorkflow } from "@/components/Automation/types";
import { useAppSelector } from "@/hooks/useStore";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import { allRequiredInputsAnswered } from "@/common/helpers";

interface Props {
  workflow: ITemplateWorkflow;
  onSubmit: (value: string) => void;
  messageType?: string;
}

const SuggestionChoices = ({ workflow, onSubmit, messageType }: Props) => {
  const { clonedWorkflow, inputs, requireCredentials, credentialsInput, areCredentialsStored, answers } =
    useAppSelector(state => state.chat ?? initialChatState);
  const { is_schedulable } = workflow;

  const readyToBeExecuted =
    (!inputs.length && !requireCredentials) ||
    (is_schedulable && requireCredentials && areCredentialsStored) ||
    (inputs.length > 0 && allRequiredInputsAnswered(inputs, answers));

  const chipOptions = [
    { label: readyToBeExecuted ? "Reconfigure" : "Configure", show: !!inputs.length || requireCredentials },
    { label: "Schedule", show: is_schedulable },
    {
      label: "Run Now",
      show: readyToBeExecuted,
    },
    {
      label: "Get API",
      show:
        (!inputs.length && !requireCredentials) ||
        (requireCredentials && credentialsInput.length > 0 && areCredentialsStored) ||
        (inputs.length > 0 && allRequiredInputsAnswered(inputs, answers)),
    },
    {
      label: "Pause",
      show: workflow.is_schedulable && !!clonedWorkflow?.periodic_task && clonedWorkflow?.periodic_task?.enabled,
    },
    {
      label: "Resume",
      show: workflow.is_schedulable && !!clonedWorkflow?.periodic_task && !clonedWorkflow?.periodic_task?.enabled,
    },
  ];
  return (
    <Box
      sx={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        mb: "10px",
        mt: messageType === "credentials" ? "-100px" : "-50px",
        ...(messageType !== "credentials" && messageType !== "schedule_time" && messageType !== "API_instructions"
          ? { ml: "60px" }
          : {}),
      }}
    >
      {chipOptions
        .filter(option => option.show)
        .map((option, index) => (
          <Chip
            key={index}
            label={option.label}
            variant="filled"
            sx={{
              fontSize: 12,
              fontWeight: 500,
              color: "text.primary",
              border: "1px solid #E0E1E7",
              cursor: "pointer",
              bgcolor: "#F7F5FC",
              ":hover": {
                border: "1px solid rgba(0, 0, 0, 0.2)",
                bgcolor: "white",
              },
            }}
            onClick={() => onSubmit(option.label)}
          />
        ))}
    </Box>
  );
};

export default SuggestionChoices;
