import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { Layout } from "@/layout";
import { useGetTemplatesByFilter } from "@/hooks/useGetTemplatesByFilter";
import { createPageLinks } from "@/common/constants";
import CreateBuilderCard from "@/components/builder/CreateBuilderCard";
import TemplateSuggestionItem from "@/components/Chat/Messages/TemplateSuggestionItem";
import TemplateSuggestionPlaceholder from "@/components/placeholders/TemplateSuggestionPlaceholder";

function CreatePage() {
  const { templates, isTemplatesLoading } = useGetTemplatesByFilter({
    ordering: "created_at",
    templateLimit: 1,
    initialStatus: "draft",
    ownerTemplates: true,
  });
  return (
    <Layout>
      <Stack
        mt={"72px"}
        direction={"column"}
        gap={"48px"}
        justifyContent={"center"}
        alignItems={"center"}
        width={{ md: "80%" }}
        mx={{ md: "auto" }}
      >
        <Stack
          width={"100%"}
          gap={3}
          justifyContent={"center"}
          alignItems={"center"}
          textAlign={"center"}
        >
          <Typography
            fontSize={48}
            fontWeight={400}
            lineHeight={"57.6px"}
            letterSpacing={"0.17px"}
          >
            Prompt Editor
          </Typography>
          <Typography
            fontSize={16}
            fontWeight={400}
            lineHeight={"25.6px"}
            letterSpacing={"0.17px"}
          >
            Structure your prompts for a productive and more deterministic AI. Your chained <br /> prompts will guide AI
            content creation with focus and intent.
          </Typography>
          <Button variant="contained">Learn more</Button>
        </Stack>
        <Stack
          gap={"72px"}
          width={"80%"}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={3}
          >
            {createPageLinks.map(link => (
              <CreateBuilderCard
                key={link.type}
                link={link}
              />
            ))}
          </Stack>
          {isTemplatesLoading && <TemplateSuggestionPlaceholder />}

          {templates.length > 0 && !isTemplatesLoading && (
            <Stack
              gap={3}
              direction={"column"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Typography
                fontSize={16}
                fontWeight={500}
                lineHeight={"19.2px"}
                letterSpacing={"0.17px"}
              >
                Continue editing
              </Typography>

              {templates.map(template => (
                <TemplateSuggestionItem
                  key={template.id}
                  variant="editor_builder"
                  template={template}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Layout>
  );
}

export default CreatePage;
