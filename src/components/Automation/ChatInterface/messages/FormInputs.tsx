import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { IAnswer } from "@/components/Prompt/Types/chat";
import { PromptInputType } from "@/components/Prompt/Types";
import { setAnswers } from "@/core/store/chatSlice";
import SystemAvatar from "../SystemAvatar";

export default function FormInputs() {
  const dispatch = useAppDispatch();
  const { inputs, answers } = useAppSelector(state => state.chat);

  const handleInputChange = (inputName: string, value: PromptInputType) => {
    let updatedAnswers: IAnswer[] = [...answers]; // Create a copy of the current answers

    const existingAnswerIndex = updatedAnswers.findIndex(answer => answer.inputName === inputName);

    if (value === "" || value === null || value === undefined) {
      // Remove the answer if the value is empty
      updatedAnswers = updatedAnswers.filter((_, index) => index !== existingAnswerIndex);
    } else if (existingAnswerIndex !== -1) {
      // Update the existing answer
      updatedAnswers = updatedAnswers.map((answer, index) =>
        index === existingAnswerIndex ? { ...answer, answer: value, error: false } : answer,
      );
    } else {
      // Add a new answer
      const input = inputs.find(input => input.name === inputName);
      if (input) {
        updatedAnswers.push({
          inputName,
          required: input.required,
          question: input.fullName,
          answer: value,
          prompt: 0,
          error: false,
        });
      }
    }

    // Dispatch the updated answers
    dispatch(setAnswers(updatedAnswers));
  };

  if (inputs.length === 0) return null;

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "primary.main",
        maxWidth: 700,
        bgcolor: "white",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
      >
        <SystemAvatar />
        <Stack sx={{ width: "100%" }}>
          <Typography
            variant="caption"
            fontWeight={700}
            color="primary.main"
            sx={{ textTransform: "uppercase" }}
          >
            Workflow Data (Required)
          </Typography>
          <Typography
            variant="caption"
            color="text.primary"
          >
            Please provide the following data for the workflow:
          </Typography>
          <Stack
            spacing={2}
            mt={2}
          >
            {inputs.map(input => {
              const answer = answers.find(a => a.inputName === input.name);
              return (
                <TextField
                  size="small"
                  key={input.name}
                  label={input.fullName}
                  fullWidth
                  required={input.required}
                  type={input.type}
                  placeholder={`Enter ${input.fullName}`}
                  value={answer?.answer || ""}
                  onChange={e => handleInputChange(input.name, e.target.value as PromptInputType)}
                  error={answer?.error}
                  helperText={answer?.error ? "This field is required" : ""}
                />
              );
            })}
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
