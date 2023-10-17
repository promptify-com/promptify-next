import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { type Palette, ThemeProvider, createTheme, useTheme } from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import materialDynamicColors from "material-dynamic-colors";
import { mix } from "polished";
import { useRouter } from "next/router";
import { useViewTemplateMutation } from "@/core/api/templates";
import { TemplatesExecutions, Templates } from "@/core/api/dto/templates";
import { authClient } from "@/common/axios";
import { PromptLiveResponse } from "@/common/types/prompt";
import { Layout } from "@/layout";
import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";
import { isValidUserFn } from "@/core/store/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { updateTemplateData, updateExecutionData } from "@/core/store/templatesSlice";
import { RootState } from "@/core/store";
import { useAppSelector } from "@/hooks/useStore";
import { getExecutionByHash } from "@/hooks/api/executions";
import TemplateMobile from "@/components/prompt/TemplateMobile";
import TemplateDesktop from "@/components/prompt/TemplateDesktop";

interface TemplateProps {
  hashedExecution: TemplatesExecutions | null;
  fetchedTemplate: Templates;
}

const Template = ({ hashedExecution, fetchedTemplate }: TemplateProps) => {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const [selectedExecution, setSelectedExecution] = useState<TemplatesExecutions | null>(null);
  const [generatedExecution, setGeneratedExecution] = useState<PromptLiveResponse | null>(null);
  const [updateViewTemplate] = useViewTemplateMutation();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();
  const theme = useTheme();
  const [palette, setPalette] = useState(theme.palette);
  const dispatch = useDispatch();
  const isValidUser = useSelector(isValidUserFn);
  const savedTemplateId = useSelector((state: RootState) => state.template.id);
  const {
    data: templateExecutions,
    isFetching: isFetchingExecutions,
    refetch: refetchTemplateExecutions,
  } = useGetExecutionsByTemplateQuery(isValidUser ? fetchedTemplate.id : skipToken);

  useEffect(() => {
    if (!fetchedTemplate?.id) {
      router.push("/404");
      return;
    }

    if (!savedTemplateId || savedTemplateId !== fetchedTemplate.id) {
      dispatch(updateExecutionData(JSON.stringify([])));
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
  }, [fetchedTemplate, savedTemplateId]);

  // After new generated execution is completed - refetch the executions list and clear the generatedExecution state
  // All prompts should be completed - isCompleted: true
  useEffect(() => {
    if (!isGenerating && generatedExecution?.data?.length) {
      const promptNotCompleted = generatedExecution.data.find(execData => !execData.isCompleted);
      if (!promptNotCompleted) {
        setSelectedExecution(null);
        setGeneratedExecution(null);
        refetchTemplateExecutions();
      }
    }
  }, [isGenerating, generatedExecution]);

  const fetchDynamicColors = () => {
    materialDynamicColors(fetchedTemplate.thumbnail)
      .then((imgPalette: IMaterialDynamicColorsTheme) => {
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
  const isMobileView = router.query.viewport === "mobile";

  return (
    <>
      <ThemeProvider theme={dynamicTheme}>
        <Layout>
          {isMobileView ? (
            <TemplateMobile
              generatedExecution={generatedExecution}
              setGeneratedExecution={setGeneratedExecution}
              isGenerating={isGenerating}
              hashedExecution={hashedExecution}
              template={fetchedTemplate}
              setErrorMessage={setErrorMessage}
              templateExecutions={templateExecutions}
              isFetchingExecutions={isFetchingExecutions}
              selectedExecution={selectedExecution}
              setSelectedExecution={setSelectedExecution}
            />
          ) : (
            <TemplateDesktop
              generatedExecution={generatedExecution}
              setGeneratedExecution={setGeneratedExecution}
              hashedExecution={hashedExecution}
              template={fetchedTemplate}
              setErrorMessage={setErrorMessage}
              templateExecutions={templateExecutions}
              isFetchingExecutions={isFetchingExecutions}
              selectedExecution={selectedExecution}
              setSelectedExecution={setSelectedExecution}
            />
          )}

          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={errorMessage.length > 0}
            autoHideDuration={6000}
            onClose={() => setErrorMessage("")}
          >
            <Alert severity={"error"}>{errorMessage}</Alert>
          </Snackbar>
        </Layout>
      </ThemeProvider>
    </>
  );
};

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
  console.log("slug:", slug);
  try {
    let execution: TemplatesExecutions | null = null;

    if (hash) {
      const [_execution, _templatesResponse] = await Promise.all([
        getExecutionByHash(hash),
        authClient.get<Templates>(`/api/meta/templates/by-slug/${slug}/`),
      ]);

      execution = _execution;
      fetchedTemplate = _templatesResponse.data;
    } else {
      const _templatesResponse = await authClient.get<Templates>(`/api/meta/templates/by-slug/${slug}/`);
      fetchedTemplate = _templatesResponse.data;
      console.log("_templatesResponse:", _templatesResponse.data);
    }

    return {
      props: {
        title: fetchedTemplate.meta_title || fetchedTemplate.title,
        description: fetchedTemplate.meta_description || fetchedTemplate.description,
        meta_keywords: fetchedTemplate.meta_keywords,
        image: fetchedTemplate.thumbnail,
        hashedExecution: execution,
        fetchedTemplate,
      },
    };
  } catch (error) {
    return {
      props: {
        title: "Promptify | Boost Your Creativity",
        description:
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
        fetchedTemplate,
      },
    };
  }
}

export default Template;
