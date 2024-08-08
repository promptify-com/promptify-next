import Link from "next/link";
import useBrowser from "@/hooks/useBrowser";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import DataFlowAccordion from "../DocumentPage/DataFlowAccordion";
import Image from "@/components/design-system/Image";
import { formatDate } from "@/common/helpers/timeManipulation";
import type { IGPTDocumentResponse, ITemplateWorkflow } from "@/components/Automation/types";

interface Props {
  gpt: IGPTDocumentResponse;
  workflow?: ITemplateWorkflow;
  isLoading: boolean;
}

function Details({ gpt, workflow, isLoading }: Props) {
  const { isMobile } = useBrowser();
  return (
    <Stack
      flex={1}
      gap={{ xs: 2, md: 3 }}
      py={{ xs: "16px", md: "48px" }}
    >
      <Stack gap={2}>
        {!isMobile && (
          <Typography
            fontSize={14}
            fontWeight={500}
            color={"secondary.light"}
          >
            AI Apps used:
          </Typography>
        )}
        <Link
          href={`gpts/${workflow?.slug}`}
          target="_blank"
          style={{ textDecoration: "none" }}
        >
          <Stack
            direction={"row"}
            gap={2}
            sx={{
              p: "8px",
              borderRadius: "24px",
              bgcolor: { xs: "surfaceContainerHigh", md: "surfaceContainerLow" },
            }}
          >
            <Image
              src={gpt.workflow.template_workflow.image ?? require("@/assets/images/default-thumbnail.jpg")}
              alt={"Promptify"}
              style={{ borderRadius: "16px", objectFit: "cover", width: "103px", height: "77px" }}
              priority={true}
            />
            <Stack
              flex={1}
              gap={1}
              justifyContent={"center"}
            >
              <Typography
                fontSize={16}
                fontWeight={500}
                color={"onSurface"}
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                  wordBreak: "break-word",
                }}
              >
                {gpt.workflow.template_workflow.name}
              </Typography>
              <Typography
                fontSize={14}
                fontWeight={400}
                color={"secondary.light"}
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                  overflow: "hidden",
                  wordBreak: "break-word",
                }}
              >
                AI App
              </Typography>
            </Stack>
          </Stack>
        </Link>

        <DataFlowAccordion
          workflow={workflow}
          isLoading={isLoading}
        />
      </Stack>

      {!isMobile && (
        <Typography
          fontSize={14}
          fontWeight={400}
          color={"onSurface"}
          sx={{
            py: "16px",
            ".label": {
              opacity: 0.5,
              mr: "8px",
            },
          }}
        >
          <span className="label">Created at:</span> {formatDate(gpt.workflow.created_at)}
        </Typography>
      )}
    </Stack>
  );
}

export default Details;
