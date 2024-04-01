import Stack from "@mui/material/Stack";
import type { ExecutionWithTemplate } from "@/core/api/dto/templates";
import Typography from "@mui/material/Typography";
import Image from "@/components/design-system/Image";

interface Props {
  document: ExecutionWithTemplate;
}

function Details({ document }: Props) {
  const template = document.template;

  return (
    <Stack
      gap={3}
      py={"48px"}
    >
      <Stack gap={2}>
        <Typography
          fontSize={14}
          fontWeight={500}
          color={"secondary.light"}
        >
          Prompt used:
        </Typography>
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={2}
          sx={{
            p: "8px",
            borderRadius: "24px",
            bgcolor: "surfaceContainerLow",
          }}
        >
          <Image
            src={template.thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
            alt={template.title}
            style={{ borderRadius: "24px", objectFit: "cover", width: "103px", height: "100%" }}
          />
          <Stack
            flex={1}
            gap={1}
          >
            <Typography
              fontSize={16}
              fontWeight={500}
              color={"onSurface"}
            >
              {template.title}
            </Typography>
            <Typography
              fontSize={16}
              fontWeight={500}
              color={"secondary.light"}
            >
              {template.category.name}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Details;
