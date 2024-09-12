import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { ITemplateWorkflow } from "@/components/Automation/types";
import { useAppSelector } from "@/hooks/useStore";
import { initialState as initialChatState } from "@/core/store/chatSlice";

interface Props {
  workflow: ITemplateWorkflow;
  onSubmit: (value: string) => void;
}

const SuggestionChoices = ({ workflow, onSubmit }: Props) => {
  const { clonedWorkflow } = useAppSelector(state => state.chat ?? initialChatState);
  const { is_schedulable } = workflow;

  const chipOptions = [
    { label: "Configure", show: true },
    { label: "Schedule", show: is_schedulable },
    { label: "Run Now", show: true },
    { label: "Get API", show: true },
    { label: "Pause", show: workflow.is_schedulable && clonedWorkflow?.periodic_task?.enabled },
    { label: "Resume", show: workflow.is_schedulable && !clonedWorkflow?.periodic_task?.enabled },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        my: "10px",
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
