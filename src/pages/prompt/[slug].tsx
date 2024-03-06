import { useEffect } from "react";
import { useViewTemplateMutation } from "@/core/api/templates";
import { Templates } from "@/core/api/dto/templates";
import { Layout } from "@/layout";
import { isValidUserFn } from "@/core/store/userSlice";
import { updateTemplateData } from "@/core/store/templatesSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { getTemplateBySlug } from "@/hooks/api/templates";
import { stripTags } from "@/common/helpers";
import { GetServerSideProps } from "next/types";
import { SEO_DESCRIPTION, SEO_TITLE } from "@/common/constants";
import TemplatePage from "@/components/Prompt";

interface TemplateProps {
  fetchedTemplate: Templates;
}

function Template({ fetchedTemplate }: TemplateProps) {
  const [updateViewTemplate] = useViewTemplateMutation();
  const dispatch = useAppDispatch();
  const isValidUser = useAppSelector(isValidUserFn);
  const savedTemplateId = useAppSelector(state => state.template.id);

  useEffect(() => {
    if (!fetchedTemplate) {
      return;
    }

    if (!savedTemplateId || savedTemplateId !== fetchedTemplate.id) {
      dispatch(
        updateTemplateData({
          id: fetchedTemplate.id,
          is_favorite: fetchedTemplate.is_favorite,
          is_liked: fetchedTemplate.is_liked,
          likes: fetchedTemplate.favorites_count,
        }),
      );
    }

    if (isValidUser) {
      updateViewTemplate(fetchedTemplate.id);
    }
  }, [isValidUser]);

  return (
    <Layout>
      <TemplatePage template={fetchedTemplate} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, query, res }) => {
  res.setHeader("Cache-Control", "public, maxage=900, stale-while-revalidate=2");

  let fetchedTemplate: Templates = {} as Templates;

  try {
    fetchedTemplate = await getTemplateBySlug(params?.slug as string);

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
        fetchedTemplate,
      },
    };
  }
};

export default Template;
