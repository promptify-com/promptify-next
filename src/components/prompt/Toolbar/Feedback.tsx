import { Stack, TextField } from "@mui/material";

export const Feedback = () => {
  return (
    <Stack
      gap={2}
      p={"24px"}
    >
      <TextField
        label="Leave your comment"
        multiline
        disabled
        sx={{
          color: "text.primary",
          cursor: "not-allowed",
          fontSize: 16,
          fontWeight: 400,
          ".MuiOutlinedInput-notchedOutline": {
            borderRadius: "16px",
          },
        }}
      />
    </Stack>
  );
};
