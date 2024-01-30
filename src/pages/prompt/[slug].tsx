import { useEffect, useState } from "react";
import { type Palette, ThemeProvider, createTheme, useTheme } from "@mui/material";
import materialDynamicColors from "material-dynamic-colors";
import { mix } from "polished";
import { useRouter } from "next/router";
import { useViewTemplateMutation } from "@/core/api/templates";
import { TemplatesExecutions, Templates } from "@/core/api/dto/templates";
import { Layout } from "@/layout";
import { isValidUserFn } from "@/core/store/userSlice";
import { updateTemplateData } from "@/core/store/templatesSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { getExecutionByHash } from "@/hooks/api/executions";
import { getTemplateBySlug } from "@/hooks/api/templates";
import { redirectToPath, stripTags } from "@/common/helpers";
import { setSelectedExecution, setSparkHashQueryParam } from "@/core/store/executionsSlice";
import useBrowser from "@/hooks/useBrowser";
import { getContentBySectioName } from "@/hooks/api/cms";
import TemplatePage from "@/components/Prompt";
import { GetServerSideProps } from "next/types";

interface IMUDynamicColorsThemeColor {
  light: {
    primary: string;
    secondary: string;
    error: string;
    background: string;
    surface: string;
    surfaceVariant: string;
  };
}

interface TemplateProps {
  hashedExecution: TemplatesExecutions | null;
  fetchedTemplate: Templates;
  questionPrefixContent: string;
}

function Template({ hashedExecution, fetchedTemplate, questionPrefixContent }: TemplateProps) {
  const router = useRouter();
  const { replaceHistoryByPathname } = useBrowser();
  const [updateViewTemplate] = useViewTemplateMutation();
  const theme = useTheme();
  const [palette, setPalette] = useState(theme.palette);
  const dispatch = useAppDispatch();
  const isValidUser = useAppSelector(isValidUserFn);
  const savedTemplateId = useAppSelector(state => state.template.id);
  const sparkHashQueryParam = (router.query?.hash as string | null) ?? null;

  useEffect(() => {
    if (!fetchedTemplate) {
      return;
    }

    if (!savedTemplateId || savedTemplateId !== fetchedTemplate.id) {
      dispatch(
        updateTemplateData({
          id: fetchedTemplate.id,
          is_favorite: fetchedTemplate.is_favorite,
          likes: fetchedTemplate.favorites_count,
        }),
      );

      if (fetchedTemplate.thumbnail) {
        fetchDynamicColors();
      }
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

  if (!fetchedTemplate?.id) {
    if (router.query.slug && router.query.reloaded !== "true") {
      redirectToPath(`/prompt/${router.query.slug}`, { reloaded: "true" });
      return null;
    }

    redirectToPath("/404");
    return null;
  }

  const fetchDynamicColors = () => {
    materialDynamicColors(fetchedTemplate.thumbnail)
      .then((imgPalette: IMUDynamicColorsThemeColor) => {
        const newPalette: Palette = {
          ...theme.palette,
          ...imgPalette.light,
          primary: {
            ...theme.palette.primary,
            main: imgPalette.light.primary,
          },
          secondary: {
            ...theme.palette.secondary,
            main: imgPalette.light.secondary,
          },
          error: {
            ...theme.palette.secondary,
            main: imgPalette.light.error,
          },
          background: {
            ...theme.palette.background,
            default: imgPalette.light.background,
          },
          surface: {
            1: imgPalette.light.surface,
            2: mix(0.3, imgPalette.light.surfaceVariant, imgPalette.light.surface),
            3: mix(0.6, imgPalette.light.surfaceVariant, imgPalette.light.surface),
            4: mix(0.8, imgPalette.light.surfaceVariant, imgPalette.light.surface),
            5: imgPalette.light.surfaceVariant,
          },
        };
        setPalette(newPalette);
      })
      .catch(() => {
        console.warn("Error fetching dynamic colors");
      });
  };
  const dynamicTheme = createTheme({ ...theme, palette });

  return (
    <ThemeProvider theme={dynamicTheme}>
      <Layout>
        <TemplatePage
          template={fetchedTemplate}
          questionPrefixContent={questionPrefixContent}
        />
      </Layout>
    </ThemeProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, query, res }) => {
  res.setHeader("Cache-Control", "public, maxage=900, stale-while-revalidate=2");

  const { hash } = query;
  let fetchedTemplate: Templates = {} as Templates;
  let hashedExecution: TemplatesExecutions | null = null;
  let questionPrefixContent = "";

  try {
    if (hash) {
      const [_execution, _templatesResponse, _sectionContent] = await Promise.allSettled([
        getExecutionByHash(hash as string),
        getTemplateBySlug(params?.slug as string),
        getContentBySectioName("chat-questions-prefix"),
      ]);
      fetchedTemplate = _templatesResponse.status === "fulfilled" ? _templatesResponse.value : fetchedTemplate;
      hashedExecution = _execution.status === "fulfilled" ? _execution.value : hashedExecution;
      questionPrefixContent =
        _sectionContent.status === "fulfilled" ? _sectionContent.value.content : questionPrefixContent;
    } else {
      const [_templatesResponse, _sectionContent] = await Promise.allSettled([
        getTemplateBySlug(params?.slug as string),
        getContentBySectioName("chat-questions-prefix"),
      ]);
      if (_templatesResponse.status === "fulfilled") {
        fetchedTemplate = _templatesResponse.value;
      }

      if (_sectionContent.status === "fulfilled") {
        questionPrefixContent = _sectionContent.value.content;
      }
    }

    return {
      props: {
        title: fetchedTemplate.meta_title ?? fetchedTemplate.title ?? null,
        description: fetchedTemplate.meta_description ?? stripTags(fetchedTemplate.description) ?? null,
        meta_keywords: fetchedTemplate.meta_keywords ?? null,
        image: fetchedTemplate.thumbnail ?? null,
        hashedExecution,
        fetchedTemplate,
        questionPrefixContent,
      },
    };
  } catch (error) {
    console.log("Error occurred:", error);
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
};

export default Template;
