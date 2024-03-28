import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import ContentWrapper from "@/components/profile2/ContentWrapper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TemplateCard from "@/components/common/TemplateCard";
import { useGetMyTemplatesQuery } from "@/core/api/templates";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import Link from "next/link";
import type { Templates } from "@/core/api/dto/templates";

function ProfilePrompts() {
  const { data: fetchedTemplates } = useGetMyTemplatesQuery({});

  const templates = fetchedTemplates as Templates[];

  return (
    <Protected>
      <Layout>
        <ContentWrapper
          title="My prompts"
          actions={
            <Button
              LinkComponent={Link}
              href="/prompt-builder/create?editor=true"
              variant="contained"
              endIcon={<Add />}
              sx={{ ml: "auto" }}
            >
              New prompt
            </Button>
          }
        >
          <Stack
            alignItems={"flex-start"}
            gap={2}
            px={"16px"}
          >
            {templates?.map(template => (
              <Box
                key={template.id}
                sx={{
                  width: "100%",
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
