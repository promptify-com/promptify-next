import { Layout } from "@/layout";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { getTemplateBySlug } from "@/hooks/api/templates";
import { stripTags } from "@/common/helpers";
import { GetServerSideProps } from "next/types";
import { SEO_DESCRIPTION, SEO_TITLE } from "@/common/constants";
import TemplatePage from "@/components/Prompt";
import { getExecutionByHash } from "@/hooks/api/executions";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useStore";
import templatesSlice, { updatePopupTemplate } from "@/core/store/templatesSlice";
import TemplateDocumentModal from "@/components/Prompt/TemplateDocumentModal";
import store from "@/core/store";
import chatSlice from "@/core/store/chatSlice";

interface TemplateProps {
  fetchedTemplate: Templates;
  hashedExecution: TemplatesExecutions;
}

function Template({ fetchedTemplate, hashedExecution }: TemplateProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!!hashedExecution) {
      dispatch(
        updatePopupTemplate({
          data: { ...hashedExecution, template: fetchedTemplate },
        }),
      );
    }
  }, []);

  useEffect(() => {
    if (!store) {
      return;
    }

    store.injectReducers([
      { key: "templates", asyncReducer: templatesSlice },
      { key: "chat", asyncReducer: chatSlice },
    ]);
  }, [store]);

  return (
    <Layout>
      <TemplatePage template={fetchedTemplate} />
      <TemplateDocumentModal />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, query, res }) => {
  res.setHeader("Cache-Control", "public, maxage=900, stale-while-revalidate=2");

  const { hash } = query;
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  let fetchedTemplate: Templates = {} as Templates;
  let hashedExecution: TemplatesExecutions | null = null;

  try {
    if (hash) {
      const [_execution, _templatesResponse] = await Promise.allSettled([
        getExecutionByHash(hash as string),
        getTemplateBySlug(params?.slug as string),
      ]);
      fetchedTemplate = _templatesResponse.status === "fulfilled" ? _templatesResponse.value : fetchedTemplate;
      hashedExecution = _execution.status === "fulfilled" ? _execution.value : hashedExecution;
    } else {
      fetchedTemplate = await getTemplateBySlug(params?.slug as string);
    }

    return {
      props: {
        title: fetchedTemplate.meta_title ?? fetchedTemplate.title ?? null,
        description: fetchedTemplate.meta_description ?? stripTags(fetchedTemplate.description) ?? null,
        meta_keywords: fetchedTemplate.meta_keywords ?? null,
        image: fetchedTemplate.thumbnail ?? null,
        fetchedTemplate,
        hashedExecution,
      },
    };
  } catch (error) {
    console.log("Error occurred:", error);
    return {
      props: {
        title: SEO_TITLE,
        description: SEO_DESCRIPTION,
        fetchedTemplate,
        hashedExecution,
      },
    };
  }
};

export default Template;
