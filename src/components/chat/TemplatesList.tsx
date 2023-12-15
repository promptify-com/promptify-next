import { Templates } from "@/core/api/dto/templates";
import { ListOutlined } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import CardTemplate from "../common/cards/CardTemplate";
import { TemplateDetailsCard } from "../Prompt/Common/TemplateDetailsCard";

interface Props {
  templates: Templates[];
  title?: string;
}

export const TemplatesList: React.FC<Props> = ({ templates, title }) => {
  const singleTemplate = templates.length === 1;

  return (
    <Box
      bgcolor={"surface.2"}
      sx={{
        borderRadius: "16px",
        borderTopLeftRadius: 0,
      }}
    >
      <Stack
        direction={"row"}
        gap={2}
        alignItems={"center"}
        sx={{
          p: "18px",
        }}
      >
        <ListOutlined />
        <Typography
          fontSize={15}
          fontWeight={600}
          color={"onSurface"}
        >
          {title || "Templates"}
        </Typography>
      </Stack>
      <Stack
        gap={2}
        sx={{
          mx: { xs: "5px", md: "40px" },
          p: "18px",
        }}
      >
        {templates.map(template =>
          singleTemplate ? (
            <TemplateDetailsCard
              key={template.id}
              template={template}
              variant="light"
              redirect
            />
          ) : (
            <CardTemplate
              key={template.id}
              template={template}
              min
            />
          ),
        )}
      </Stack>
    </Box>
  );
};
