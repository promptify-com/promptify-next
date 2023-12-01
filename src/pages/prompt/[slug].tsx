import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import { useRouter } from "next/router";
import { useViewTemplateMutation } from "@/core/api/templates";
import type { TemplatesExecutions, Templates } from "@/core/api/dto/templates";
import { Layout } from "@/layout";
import { isValidUserFn } from "@/core/store/userSlice";
import { updateTemplateData } from "@/core/store/templatesSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { getExecutionByHash } from "@/hooks/api/executions";
import TemplateLayout from "@/components/prompt/TemplateLayout";
import { getTemplateBySlug } from "@/hooks/api/templates";
import { redirectToPath } from "@/common/helpers";
import { setSelectedExecution, setSparkHashQueryParam } from "@/core/store/executionsSlice";
import useBrowser from "@/hooks/useBrowser";
import { getContentBySectioName } from "@/hooks/api/cms";

interface TemplateProps {
  hashedExecution: TemplatesExecutions | null;
  fetchedTemplate: Templates;
  questionPrefixContent: string;
}

function Template({ hashedExecution, fetchedTemplate, questionPrefixContent }: TemplateProps) {
  const router = useRouter();
  const { replaceHistoryByPathname } = useBrowser();
  const [updateViewTemplate] = useViewTemplateMutation();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const dispatch = useAppDispatch();
  const isValidUser = useAppSelector(isValidUserFn);
  const savedTemplateId = useAppSelector(state => state.template.id);
  const sparkHashQueryParam = (router.query?.hash as string | null) ?? null;

  useEffect(() => {
    if (!savedTemplateId || savedTemplateId !== fetchedTemplate.id) {
      dispatch(
        updateTemplateData({
          id: fetchedTemplate.id,
          is_favorite: fetchedTemplate.is_favorite,
          likes: fetchedTemplate.favorites_count,
        }),
      );
    }

    if (isValidUser) {
      updateViewTemplate(fetchedTemplate.id);
    }
  }, [isValidUser]);

  useEffect(() => {
    dispatch(setSparkHashQueryParam(sparkHashQueryParam));

    if (sparkHashQueryParam && hashedExecution) {
      dispatch(setSelectedExecution(hashedExecution));
      replaceHistoryByPathname(`/prompt/${fetchedTemplate.slug}`);
      return;
    }
  }, [sparkHashQueryParam]);

  if (!fetchedTemplate.id) {
    redirectToPath("/404");
    return;
  }

  return (
    <Layout>
      <TemplateLayout
        template={fetchedTemplate}
        setErrorMessage={setErrorMessage}
        questionPrefixContent={questionPrefixContent}
      />

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={errorMessage.length > 0}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
      >
        <Alert severity={"error"}>{errorMessage}</Alert>
      </Snackbar>
    </Layout>
  );
}

export async function getServerSideProps({
  params,
  query,
}: {
  params: {
    slug: string;
  };
  query: {
    hash: string;
  };
}) {
  const { slug } = params;
  const { hash } = query;
  let fetchedTemplate: Templates = {} as Templates;
  let hashedExecution: TemplatesExecutions | null = null;
  let questionPrefixContent = "";

  if (hash) {
    const [_execution, _templatesResponse, _sectionContent] = await Promise.allSettled([
      getExecutionByHash(hash),
      getTemplateBySlug(slug),
      getContentBySectioName("chat-questions-prefix"),
    ]);
    fetchedTemplate = _templatesResponse.status === "fulfilled" ? _templatesResponse.value : fetchedTemplate;
    hashedExecution = _execution.status === "fulfilled" ? _execution.value : hashedExecution;
    questionPrefixContent =
      _sectionContent.status === "fulfilled" ? _sectionContent.value.content : questionPrefixContent;
  } else {
    const [_templatesResponse, _sectionContent] = await Promise.allSettled([
      getTemplateBySlug(slug),
      getContentBySectioName("chat-questions-prefix"),
    ]);
    fetchedTemplate = _templatesResponse.status === "fulfilled" ? _templatesResponse.value : fetchedTemplate;
    questionPrefixContent =
      _sectionContent.status === "fulfilled" ? _sectionContent.value.content : questionPrefixContent;
  }

  try {
    return {
      props: {
        title: fetchedTemplate.meta_title || fetchedTemplate.title,
        description: fetchedTemplate.meta_description || fetchedTemplate.description,
        meta_keywords: fetchedTemplate.meta_keywords,
        image: fetchedTemplate.thumbnail,
        hashedExecution,
        fetchedTemplate,
        questionPrefixContent,
      },
    };
  } catch (error) {
    return {
      props: {
        title: "Promptify | Boost Your Creativity",
        description:
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
        fetchedTemplate,
        hashedExecution,
        questionPrefixContent,
      },
    };
  }
}

export default Template;
