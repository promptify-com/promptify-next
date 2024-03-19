import Stack from "@mui/material/Stack";
import Seo from "@/components/Seo";
import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import TemplatesCarousel from "@/components/Documents/TemplatesCarousel";
import DocumentsContainer from "@/components/Documents/DocumentsContainer";
import { useGetTemplatesExecutionsByMeQuery } from "@/core/api/executions";

export default function DocumentsPage() {
  const { data: executedTemplates, isLoading: isExecutedTemplatesLoading } =
    useGetTemplatesExecutionsByMeQuery(undefined);

  return (
    <>
      <Seo title={"My Documents"} />
      <Layout>
        <Protected>
          <Stack
            gap={3}
            p={"40px 72px"}
          >
            <TemplatesCarousel
              templates={executedTemplates}
              isLoading={isExecutedTemplatesLoading}
            />
            <DocumentsContainer templates={executedTemplates} />
          </Stack>
        </Protected>
      </Layout>
    </>
  );
}
