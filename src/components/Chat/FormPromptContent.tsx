import { Fragment } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import HighlightContent from "@/components/Chat/HighlightPrompt";
import FormParam from "@/components/Prompt/Common/Chat/FormParams";
import { useAppSelector } from "@/hooks/useStore";
import type { Templates } from "@/core/api/dto/templates";

interface Props {
  template: Templates;
}

function FormPromptContent({ template }: Props) {
  const params = useAppSelector(state => state.chat.params);
  return (
    <>
      <Stack p={"16px 24px"}>
        {template.prompts.map(prompt => (
          <Fragment key={prompt.id}>
            <Stack
              direction={"row"}
              gap={1}
              pt={"20px"}
            >
              <Typography
                fontSize={16}
                lineHeight={"22px"}
              >
                {prompt.title}
              </Typography>
              <Typography color={"text.secondary"}>{prompt.engine.name}</Typography>
            </Stack>
            <Box
              sx={{
                pt: "20px",
                position: "relative",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: "35px",
                letterSpacing: "0.17px",
              }}
            >
              <HighlightContent
                content={prompt.content}
                promptId={prompt.id}
              />
            </Box>
          </Fragment>
        ))}
      </Stack>
      {!!params.length && (
        <Stack>
          <Stack
            direction={"column"}
            gap={1}
            p={"16px 24px"}
          >
            <Typography
              fontSize={16}
              lineHeight={"22px"}
            >
              Contextual parameters:
            </Typography>
          </Stack>
          <Stack px={"8px"}>
            {params?.map(param => (
              <FormParam
                key={param.parameter.id}
                param={param}
              />
            ))}
          </Stack>
        </Stack>
      )}
    </>
  );
}

export default FormPromptContent;
