import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

import { useAppSelector } from "@/hooks/useStore";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import { allRequiredInputsAnswered } from "@/components/Automation/ChatInterface/helper";

interface Props {
  is_schedulable: boolean;
  onSubmit: (value: string) => void;
  messageType?: string;
}

const SuggestionChoices = ({ is_schedulable, onSubmit, messageType }: Props) => {
  const { selectedApp, inputs, credentialsInput, areCredentialsStored, answers } = useAppSelector(
    state => state.chat ?? initialChatState,
  );

  const readyToBeExecuted = useMemo(
    () =>
      (!inputs.length && !credentialsInput?.length) ||
      (is_schedulable && credentialsInput?.length && areCredentialsStored) ||
      (inputs.length > 0 && allRequiredInputsAnswered(inputs, answers)),
    [inputs, credentialsInput, is_schedulable, areCredentialsStored, answers],
  );

  const chipOptions = useMemo(
    () => [
      {
        label: readyToBeExecuted ? "Reconfigure" : "Configure",
        show: !!inputs.length || credentialsInput?.length,
      },
      {
        label: "Run Now",
        show: readyToBeExecuted,
      },
      {
        label: "Get API",
        show:
          (!inputs.length && !credentialsInput?.length) ||
          (credentialsInput?.length && credentialsInput.length > 0 && areCredentialsStored) ||
          (inputs.length > 0 && allRequiredInputsAnswered(inputs, answers)),
      },
    ],
    [readyToBeExecuted, inputs, credentialsInput, areCredentialsStored, answers, is_schedulable, selectedApp],
  );

  return (
    <Box
      sx={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        mb: "10px",
        mt: "-30px",
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

// Wrap with memo

export default SuggestionChoices;
