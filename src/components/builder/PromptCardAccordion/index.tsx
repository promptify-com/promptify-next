import { ModeEdit, PlayCircle } from "@mui/icons-material";
import { Box, Button, Divider, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Header } from "./Header";
import { StylerAccordion } from "./StylerAccordion";
import { IEditPrompts } from "@/common/types/builder";
import { RenameForm } from "@/components/common/forms/RenameForm";

interface Props {
  prompt: IEditPrompts;
  setPrompt: (prompt: IEditPrompts) => void;
}

export const PromptCardAccordion = ({ prompt, setPrompt }: Props) => {
  const [renameAllow, setRenameAllow] = useState(false);

  return (
    <Box
      sx={{
        bgcolor: "surface.1",
        m: "24px 0 !important",
        borderRadius: "16px !important",
        boxShadow: "none",
        transition: "box-shadow 0.3s ease-in-out",
        ":before": { display: "none" },
        ":hover": {
          boxShadow:
            "0px 3px 3px -2px rgba(225, 226, 236, 0.20), 0px 3px 4px 0px rgba(225, 226, 236, 0.14), 0px 1px 8px 0px rgba(27, 27, 30, 0.12)",
        },
      }}
    >
      <Box
        sx={{
          p: "12px",
        }}
      >
        <Header
          prompt={prompt}
          setPrompt={setPrompt}
        />
      </Box>
      <Divider sx={{ borderColor: "surface.3" }} />
      <Box
        sx={{
          p: 0,
        }}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          p={"8px 16px 8px 24px"}
        >
          {!renameAllow ? (
            <>
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={1}
              >
                <Typography
                  sx={{ color: "onSurface", fontSize: 14, fontWeight: 500, opacity: 0.8, ":hover": { opacity: 1 } }}
                >
                  {prompt.title || ""}
                </Typography>
                <ModeEdit
                  sx={{ cursor: "pointer", fontSize: "16px" }}
                  onClick={() => setRenameAllow(true)}
                />
              </Stack>
              <Button startIcon={<PlayCircle />}>Test run</Button>
            </>
          ) : (
            <RenameForm
              label="Prompt"
              initialValue={prompt.title}
              onSave={val => {
                setPrompt({ ...prompt, title: val });
                setRenameAllow(false);
              }}
              onCancel={() => setRenameAllow(false)}
            />
          )}
        </Stack>
        <Box>
          <Typography
            sx={{
              p: "8px 16px 8px 24px",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              color: "text.secondary",
            }}
          >
            Prompt Instructions:
          </Typography>
          <TextField
            multiline
            maxRows={10}
            fullWidth
            variant="outlined"
            name="description"
            value={prompt.content}
            onChange={e => setPrompt({ ...prompt, content: e.target.value })}
            InputProps={{
              sx: {
                p: "12px 24px",
                ".MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              },
            }}
          />
        </Box>

        <StylerAccordion
          prompt={prompt}
          setPrompt={setPrompt}
        />
      </Box>
    </Box>
  );
};
