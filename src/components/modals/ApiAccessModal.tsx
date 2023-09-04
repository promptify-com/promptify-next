import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Box, Button, FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  value: string;
  onChange: (event: SelectChangeEvent) => void;
  language: string;
}

export default function ApiAccessModal({ open, setOpen, value, onChange, language }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 2000);
    }
  }, [copied]);

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
          width: "80vw",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: { xs: 2, md: 4 },
          overflow: "auto",
        }}
      >
        <Box
          p="20px"
          bgcolor="#f2f5f9"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box
              display="flex"
              alignItems="center"
            >
              <SettingsIcon />
              <Typography
                ml="1rem"
                fontSize={{ xs: 14, md: 18 }}
              >
                Integrate this API
              </Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
            >
              <FormControl sx={{ m: 1 }}>
                <Select
                  value={language}
                  onChange={onChange}
                  sx={{ height: "40px" }}
                >
                  <MenuItem value={"0"}>cUrl</MenuItem>
                  <MenuItem value={"1"}>PHP - cUrl</MenuItem>
                  <MenuItem value={"2"}>Python - http.client</MenuItem>
                  <MenuItem value={"3"}>Python - Requests</MenuItem>
                  <MenuItem value={"4"}>JavaScript - Fetch</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant={copied ? "outlined" : "contained"}
                sx={{
                  borderRadius: "5px",
                }}
                onClick={() =>
                  navigator.clipboard
                    .writeText(value)
                    .then(() => {
                      setCopied(true);
                    })
                    .catch(error => {
                      console.error("Error copying text to clipboard:", error);
                    })
                }
                disabled={copied}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </Box>
          </Box>

          <SyntaxHighlighter
            language="javascript"
            style={vs2015}
            customStyle={{
              borderRadius: "10px",
            }}
            showLineNumbers
            wrapLongLines
          >
            {value}
          </SyntaxHighlighter>
        </Box>
        <Box
          p="20px"
          bgcolor="#f2f5f9"
          mt="40px"
        >
          <Box
            display="flex"
            alignItems="center"
          >
            <KeyboardReturnIcon />
            <Typography
              ml="1rem"
              fontSize={{ xs: 14, md: 18 }}
            >
              Response Format
            </Typography>
          </Box>

          <SyntaxHighlighter
            language="javascript"
            style={vs2015}
            customStyle={{ borderRadius: "10px" }}
          >
            {`        {   
            response: text //
            completed: boolean // Is the response completed
        }`}
          </SyntaxHighlighter>
        </Box>
      </Box>
    </Modal>
  );
}
