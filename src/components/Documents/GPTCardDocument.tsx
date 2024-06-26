import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import CloudDone from "@mui/icons-material/CloudDone";
import { formatDate } from "@/common/helpers/timeManipulation";
import { isImageOutput } from "@/components/Prompt/Utils";
import { ExecutionContent } from "@/components/common/ExecutionContent";
import type { IGPTDocumentResponse } from "../Automation/types";

interface Props {
  gpt: IGPTDocumentResponse;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export default function GPTCardDocument({ gpt, onClick }: Props) {
  const output = gpt.output;
  const [content, setContent] = useState(output ?? "");

  useEffect(() => {
    if (output) {
      import("@/common/helpers/htmlHelper").then(({ markdownToHTML, sanitizeHTML }) => {
        markdownToHTML(output).then(res => setContent(sanitizeHTML(res)));
      });
    }
  }, [output]);

  return (
    <Card
      component={"a"}
      onClick={onClick}
      elevation={0}
      sx={{
        display: "block",
        position: "relative",
        height: "315px",
        maxWidth: "430px",
        p: "8px",
        borderRadius: "16px",
        textDecoration: "none",
        cursor: "pointer",
        bgcolor: "surfaceContainerLowest",
        transition: "background-color 0.3s ease",
        ":hover": {
          bgcolor: "surfaceContainerLow",
        },
      }}
    >
      <Box
        sx={{
          p: "16px",
          borderRadius: "16px",
          bgcolor: "surfaceContainer",
        }}
      >
        <Stack
          alignItems={"flex-start"}
          gap={2}
          sx={{
            height: "150px",
            width: "calc(85% - 64px)",
            m: "auto",
            overflow: "hidden",
            bgcolor: "surfaceContainerLowest",
            p: "32px 32px 24px 32px",
            borderRadius: "4px",
          }}
        >
          <Typography
            fontSize={16}
            fontWeight={400}
            color={"onSurface"}
          >
            {gpt.title}
          </Typography>
          {isImageOutput(output) && (
            <>
              <Box
                component={"img"}
                alt={"Promptify"}
                src={output}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  (e.target as HTMLImageElement).src = require("@/assets/images/default-thumbnail.jpg");
                }}
                sx={{
                  borderRadius: "8px",
                  width: "60%",
                  objectFit: "cover",
                }}
              />
            </>
          )}
          {!isImageOutput(output) && <ExecutionContent content={content} />}
        </Stack>
      </Box>
      <Box p={"8px"}>
        <Typography
          fontSize={16}
          fontWeight={500}
          color={"onSurface"}
          sx={oneLineStyle}
        >
          {gpt.title}
        </Typography>
        <Typography
          fontSize={14}
          fontWeight={400}
          color={"secondary.light"}
          sx={oneLineStyle}
        >
          {gpt.workflow.template_workflow.name}
        </Typography>
        <Typography
          fontSize={12}
          fontWeight={400}
          color={"secondary.light"}
          sx={oneLineStyle}
        >
          {formatDate(gpt.created_at)}
        </Typography>
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 14,
          svg: {
            p: "2px",
            bgcolor: "surfaceContainerLowest",
            borderRadius: "99px",
          },
        }}
      >
        <CloudDone color="primary" />
      </Box>
    </Card>
  );
}

const oneLineStyle = {
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
};
const menuItemStyle = {
  gap: 2,
  p: "8px 8px 8px 16px",
  fontSize: 14,
  fontWeight: 400,
  svg: {
    fontSize: 20,
  },
};
