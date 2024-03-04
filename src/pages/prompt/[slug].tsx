import { useEffect, useState } from "react";
import { type Palette, ThemeProvider, createTheme, useTheme } from "@mui/material";
import materialDynamicColors from "material-dynamic-colors";
import { mix } from "polished";
import { useViewTemplateMutation } from "@/core/api/templates";
import { Templates } from "@/core/api/dto/templates";
import { Layout } from "@/layout";
import { isValidUserFn } from "@/core/store/userSlice";
import { updateTemplateData } from "@/core/store/templatesSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { getTemplateBySlug } from "@/hooks/api/templates";
import { stripTags } from "@/common/helpers";
import TemplatePage from "@/components/Prompt";
import { GetServerSideProps } from "next/types";
import { SEO_DESCRIPTION, SEO_TITLE } from "@/common/constants";

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
  fetchedTemplate: Templates;
}

function Template({ fetchedTemplate }: TemplateProps) {
  const [updateViewTemplate] = useViewTemplateMutation();
  const theme = useTheme();
  const [palette, setPalette] = useState(theme.palette);
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

  const fetchDynamicColors = () => {
    //@ts-expect-error unfound-new-type
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
        <TemplatePage template={fetchedTemplate} />
      </Layout>
    </ThemeProvider>
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
