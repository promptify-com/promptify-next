import { Layout } from "@/layout";
import { Templates } from "@/core/api/dto/templates";
import { getTemplateBySlug } from "@/hooks/api/templates";
import { stripTags } from "@/common/helpers";
import { GetServerSideProps } from "next/types";
import { SEO_DESCRIPTION, SEO_TITLE } from "@/common/constants";
import TemplatePage from "@/components/Prompt";

interface TemplateProps {
  fetchedTemplate: Templates;
}

function Template({ fetchedTemplate }: TemplateProps) {
  return (
    <Layout>
      <TemplatePage template={fetchedTemplate} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, query, res }) => {
  res.setHeader("Cache-Control", "public, maxage=900, stale-while-revalidate=2");

  try {
    const fetchedTemplate = await getTemplateBySlug(params?.slug as string);

    return {
      props: {
        title: fetchedTemplate.meta_title ?? fetchedTemplate.title ?? null,
        description: fetchedTemplate.meta_description ?? stripTags(fetchedTemplate.description) ?? null,
        meta_keywords: fetchedTemplate.meta_keywords ?? null,
        image: fetchedTemplate.thumbnail ?? null,
        fetchedTemplate,
      },
    };
  } catch (error) {
    console.log("Error occurred:", error);
    return {
      props: {
        title: SEO_TITLE,
        description: SEO_DESCRIPTION,
        fetchedTemplate: {} as Templates,
      },
    };
  }
};

export default Template;
