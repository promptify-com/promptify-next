import Stack from "@mui/material/Stack";
import type { ExecutionWithTemplate } from "@/core/api/dto/templates";
import Typography from "@mui/material/Typography";
import Image from "@/components/design-system/Image";
import { formatDate } from "@/common/helpers/timeManipulation";
import InstructionsAccordion from "./InstructionsAccordion";
import useBrowser from "@/hooks/useBrowser";
import ActionButtons from "./ActionButtons";

interface Props {
  document: ExecutionWithTemplate;
}

function Details({ document }: Props) {
  const { isMobile } = useBrowser();
  const template = document.template;

  return (
    <Stack
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
            Prompt used:
          </Typography>
        )}
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
            src={template?.thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
            alt={template?.title || "Promptify"}
            style={{ borderRadius: "16px", objectFit: "cover", width: "103px", height: "77px" }}
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
              {template?.title}
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
              {template?.category.name}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {isMobile && <ActionButtons document={document} />}
      <InstructionsAccordion document={document} />
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
          <span className="label">Created at:</span> {formatDate(document.created_at)}
        </Typography>
      )}
    </Stack>
  );
}

export default Details;
