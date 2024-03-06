import { Fragment, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import HighlightTextarea from "../builder/HighlightWithinTextarea";
import type { Templates } from "@/core/api/dto/templates";
import type { IEditPrompts } from "@/common/types/builder";

interface Props {
  template: Templates;
}

function FormPromptContent({ template }: Props) {
  const cursorPositionRef = useRef(0);
  const [highlightedOption, setHighlightedOption] = useState("");
  return (
    <Stack p={"16px 24px"}>
      {template.prompts.map(prompt => {
        return (
          <Fragment key={prompt.id}>
            <Stack
              direction={"row"}
              gap={1}
            >
              <Typography
                fontSize={16}
                lineHeight={"22px"}
              >
                {prompt?.title}
              </Typography>
              <Typography color={"text.secondary"}>{prompt?.engine.name}</Typography>
            </Stack>
            <Box
              sx={{
                pb: "42px",
                pt: "20px",
                position: "relative",
              }}
            >
              <HighlightTextarea
                prompt={prompt as unknown as IEditPrompts}
                cursorPositionRef={cursorPositionRef}
                onChange={() => {}}
                outputPresets={[]}
                inputPresets={[]}
                highlightedValue={highlightedOption}
                setHighlightedValue={setHighlightedOption}
                type={"user"}
              />
            </Box>
          </Fragment>
        );
      })}
    </Stack>
  );
}

export default FormPromptContent;
