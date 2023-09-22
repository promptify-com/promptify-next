import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { Box, Button, Stack, TextField } from "@mui/material";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  onSubmit: (value: string) => void;
}

export default function VaryModal({ open, setOpen, onSubmit }: Props) {
  const [variation, setVariation] = useState("");

  const handleSubmit = () => {
    setOpen(false);
    onSubmit(variation);
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxHeight: "70vh",
          width: "600px",
          maxWidth: "80svw",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: { xs: 2, md: 4 },
          overflow: "auto",
        }}
      >
        <TextField
          placeholder="Type your variation here..."
          multiline
          rows={10}
          fullWidth
          value={variation}
          onChange={e => setVariation(e.target.value)}
          sx={{ ".MuiInputBase-input": { overscrollBehavior: "contain" } }}
          InputProps={{
            sx: {
              fontSize: 14,
              bgcolor: "grey.100",
              p: "10px",
            },
          }}
          variant="outlined"
        />
        <Stack
          sx={{
            direction: "row",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{
              width: "fit-content",
              m: "auto",
              px: 4,
              bgcolor: "tertiary",
              borderColor: "tertiary",
              ":hover": {
                color: "tertiary",
              },
            }}
            onClick={handleSubmit}
          >
            Confirm
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
