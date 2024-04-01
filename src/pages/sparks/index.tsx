import Stack from "@mui/material/Stack";
import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import TemplatesCarousel from "@/components/Documents/TemplatesCarousel";
import DocumentsContainer from "@/components/Documents/DocumentsContainer";
import { useGetTemplatesExecutionsByMeQuery } from "@/core/api/executions";
import { useAppSelector } from "@/hooks/useStore";
import { SEO_DESCRIPTION } from "@/common/constants";

function DocumentsPage() {
  const { data: executedTemplates, isLoading: isExecutedTemplatesLoading } =
    useGetTemplatesExecutionsByMeQuery(undefined);

  const isDocumentsFiltersSticky = useAppSelector(state => state.sidebar.isDocumentsFiltersSticky);

  return (
    <Protected>
      <Layout>
        <Stack
          gap={3}
          sx={{
            p: "40px 72px",
            ...(!isDocumentsFiltersSticky && {
              maxWidth: "1112px",
              m: "auto",
            }),
          }}
        >
          <TemplatesCarousel
            templates={executedTemplates}
            isLoading={isExecutedTemplatesLoading}
          />
          <DocumentsContainer
            templates={executedTemplates}
            isLoading={isExecutedTemplatesLoading}
          />
        </Stack>
      </Layout>
    </Protected>
  );
}

export async function getServerSideProps({ params }: any) {
  return {
    props: {
      title: "Documents",
      description: SEO_DESCRIPTION,
    },
  };
}

export default DocumentsPage;
