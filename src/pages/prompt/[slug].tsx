import { Layout } from "@/layout";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { getTemplateBySlug } from "@/hooks/api/templates";
import { stripTags } from "@/common/helpers";
import { GetServerSideProps } from "next/types";
import { SEO_DESCRIPTION, SEO_TITLE } from "@/common/constants";
import TemplatePage from "@/components/Prompt";
import { getExecutionByHash } from "@/hooks/api/executions";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import { useState } from "react";
import { ExecutionCard } from "@/components/Prompt/VariantA/ExecutionCard";

interface TemplateProps {
  fetchedTemplate: Templates;
  hashedExecution: TemplatesExecutions;
}

function Template({ fetchedTemplate, hashedExecution }: TemplateProps) {
  const [openExecution, setOpenExecution] = useState(!!hashedExecution);

  const closeExecution = () => {
    setOpenExecution(false);
  };

  return (
    <Layout>
      {hashedExecution && (
        <Dialog
          open={openExecution}
          onClose={closeExecution}
          disableScrollLock
          sx={{
            ".MuiPaper-root": {
              height: "90svh",
              width: "90svw",
              maxWidth: "1184px",
              position: "relative",
              overscrollBehavior: "contain",
              scrollBehavior: "smooth",
              borderRadius: "16px",
              "&::-webkit-scrollbar": {
                width: "0px",
              },
            },
          }}
        >
          <IconButton
            aria-label="close"
            onClick={closeExecution}
            sx={{
              position: "sticky",
              top: "8px",
              right: "20px",
              ml: "auto",
              zIndex: 999,
              width: "fit-content",
              color: "action.active",
              border: "none",
              ":hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <Close />
          </IconButton>
          <ExecutionCard
            execution={hashedExecution}
            promptsData={fetchedTemplate.prompts}
            showPreview={false}
            noRepeat
          />
        </Dialog>
      )}
      <TemplatePage template={fetchedTemplate} />
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
