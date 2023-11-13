import { Stack, TextField } from "@mui/material";

export const Feedback = () => {
  return (
    <Stack
      gap={3}
      p={"24px"}
    >
      <TextField
        label="Leave your comment"
        multiline
        sx={{
          color: "text.primary",
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
