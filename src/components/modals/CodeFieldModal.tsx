import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { Box, Button, Stack } from "@mui/material";
import CodeField from "../common/forms/CodeField";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  value: string;
  onChange: (value: string) => void;
}

export default function CodeFieldModal({ open, setOpen, value, onChange }: Props) {
  const [errors, setErrors] = useState<string[]>([]);

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
        <CodeField
          value={value}
          onChange={onChange}
          onError={setErrors}
        />

        {errors.length > 0 && (
          <Box sx={{ m: "5px 14px" }}>
            {errors.map((errMsg, i) => (
              <Box
                key={i}
                sx={{
                  fontSize: 12,
                  color: "error.main",
                  mb: "8px",
                }}
              >
                {errMsg}
              </Box>
            ))}
          </Box>
        )}
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
            }}
            onClick={() => setOpen(false)}
          >
            Confirm
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
