import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "@/hooks/useStore";
import { initialState } from "@/core/store/chatSlice";

function ExecutionMessageInstructions() {
  const answers = useAppSelector(state => state.chat?.answers ?? initialState.answers);
  return (
    <Stack
      p={" 8px 24px"}
      direction={"row"}
      alignItems={"center"}
      gap={2}
    >
      <Typography
        fontSize={16}
        lineHeight={"24px"}
      >
        Instructions:
      </Typography>
      <Stack
        direction={"row"}
        gap={1}
        alignItems={"center"}
      >
        {answers.map(answer => (
          <Chip
            label={`${answer.inputName}: ${answer.answer}`}
            sx={{
              bgcolor: "surface.3",
              color: "text.secondary",
              lineHeight: "25px",
              fontWeight: 400,
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export default ExecutionMessageInstructions;
