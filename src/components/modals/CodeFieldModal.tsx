import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { Box, Button, Stack } from "@mui/material";
import CodeField from "../common/forms/CodeField";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
}

export default function CodeFieldModal({ open, setOpen, value, onChange, onSubmit }: Props) {
  const [tempValue, setTempValue] = useState(value);

  const handleSubmit = () => {
    setOpen(false);
    if (tempValue.trim() === "") return;
    onChange(tempValue);
    if (onSubmit) {
      onSubmit(tempValue);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
        setTempValue(value);
      }}
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
        <CodeField
          value={tempValue}
          onChange={setTempValue}
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
