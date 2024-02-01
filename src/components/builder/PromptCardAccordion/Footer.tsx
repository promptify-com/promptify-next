import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";

import OutputOptions from "./OutputOptions";
import ArrowRightBottom from "@/assets/icons/ArrowRightBottom";
import { theme } from "@/theme";
import type { IEditPrompts } from "@/common/types/builder";

interface Props {
  prompt: IEditPrompts;
  setPrompt: (prompt: IEditPrompts) => void;
}

function Footer({ prompt, setPrompt }: Props) {
  const [showOptions, setShowOptions] = useState(false);
  const [optionsAnchor, setOptionsAnchor] = useState<HTMLElement | null>(null);

  const closeOptionsModal = () => {
    setOptionsAnchor(null);
    setShowOptions(false);
  };

  return (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={1}
        p={"12px 16px"}
      >
        <ArrowRightBottom
          size="20"
          color={theme.palette.action.active}
          opacity={0.5}
        />
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 500,
            color: "onSurface",
            whiteSpace: "nowrap",
          }}
        >
          Generated content format:
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 400,
            color: "onSurface",
            opacity: 0.5,
            whiteSpace: "nowrap",
            maxWidth: "40%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {prompt.output_format ? prompt.output_format + " ," : ""}
          Visibility: {prompt.show_output ? "On" : "Off"}, Title: {prompt.is_visible ? "On" : "Off"}
        </Typography>
        <Button
          variant="text"
          sx={{
            fontSize: 12,
            fontWeight: 400,
            color: "onSurface",
            opacity: 0.5,
            p: 0,
            minWidth: "auto",
            textDecorationLine: "underline",
          }}
          onClick={e => {
            setOptionsAnchor(e.currentTarget);
            setShowOptions(true);
          }}
        >
          Edit
        </Button>
        <Stack
          direction={"row"}
          alignItems={"center"}
          ml={"auto"}
        >
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 500,
              color: "onSurface",
              whiteSpace: "nowrap",
            }}
          >
            Save result as:
          </Typography>
          <Button
            endIcon={<ArrowDropDown />}
            onClick={e => {
              setOptionsAnchor(e.currentTarget);
              setShowOptions(true);
            }}
            sx={{
              fontSize: 13,
              fontWeight: 500,
              color: "#9C27B0",
              px: "6px",
            }}
          >
            <Typography
              component={"span"}
              sx={{
                fontSize: "inherit",
                fontWeight: "inherit",
                color: "inherit",
                width: "80px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {prompt.prompt_output_variable || "..."}
            </Typography>
          </Button>
        </Stack>
      </Stack>
      <Popper
        open={showOptions}
        anchorEl={optionsAnchor}
        placement="top-end"
        keepMounted
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [5, 10],
            },
          },
          {
            name: "flip",
            enabled: false,
          },
          {
            name: "preventOverflow",
            enabled: false,
          },
        ]}
        sx={{
          bgcolor: "surface.1",
          borderRadius: "6px",
          zIndex: 1,
          boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <OutputOptions
          prompt={prompt}
          onSave={prompt => {
            setPrompt(prompt);
            closeOptionsModal();
          }}
          onCancel={closeOptionsModal}
        />
      </Popper>
    </>
  );
}

export default Footer;
