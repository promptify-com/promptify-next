import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import ContentWrapper from "@/components/profile2/ContentWrapper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TemplateCard from "@/components/common/TemplateCard";
import { useGetMyTemplatesQuery } from "@/core/api/templates";

function ProfilePrompts() {
  const { data: templates, isFetching: isUserTemplatesFetching } = useGetMyTemplatesQuery();

  return (
    <Protected>
      <Layout>
        <ContentWrapper
          title="My prompts"
          description="Here, you can customize your prompt templates"
        >
          <Stack gap={2}>
            {templates?.map(template => (
              <Box
                key={template.id}
                sx={{
                  border: "1px solid",
                  borderColor: "surfaceContainerHighest",
                  borderRadius: "16px",
                }}
              >
                <TemplateCard
                  template={template}
                  manageActions
                />
              </Box>
            ))}
          </Stack>
        </ContentWrapper>
      </Layout>
    </Protected>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: "My Prompts",
      description: SEO_DESCRIPTION,
    },
  };
}

export default ProfilePrompts;
