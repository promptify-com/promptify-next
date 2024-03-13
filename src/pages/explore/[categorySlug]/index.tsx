import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { authClient } from "@/common/axios";
import type { Category } from "@/core/api/dto/templates";
import { Layout } from "@/layout";
import { useGetTemplatesByFilter } from "@/hooks/useGetTemplatesByFilter";
import { SEO_DESCRIPTION, SEO_TITLE } from "@/common/constants";
import Image from "@/components/design-system/Image";
import PopularTemplates from "@/components/explorer/PopularTemplates";
import materialDynamicColors from "material-dynamic-colors";
import { type Palette, ThemeProvider, createTheme, useTheme } from "@mui/material";
import { mix } from "polished";
import FooterPrompt from "@/components/explorer/FooterPrompt";
import { FiltersSelected } from "@/components/explorer/FiltersSelected";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";

export default function Page({ category }: { category: Category }) {
  const router = useRouter();
  const theme = useTheme();
  const [palette, setPalette] = useState(theme.palette);

  const {
    templates,
    isTemplatesLoading,
    handleNextPage,
    hasMore,
    allFilterParamsNull,
    isFetching,
    hasPrev,
    handlePrevPage,
  } = useGetTemplatesByFilter({ catId: category?.id, ordering: "-likes", templateLimit: 5, paginatedList: true });

  useEffect(() => {
    if (!category) {
      return;
    }

    if (category.image) {
      fetchDynamicColors();
    }
  }, []);

  const goBack = () => {
    router.push("/explore");
  };

  const fetchDynamicColors = () => {
    materialDynamicColors(category.image)
      .then(imgPalette => {
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
        <Box
          mt={{ xs: 7, md: -2 }}
          sx={{
            maxWidth: "1072px",
            mx: "auto",
            p: { xs: "16px", md: "32px 72px" },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            py={"16px"}
          >
            <Button
              onClick={goBack}
              variant="text"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "onSurface",
                p: "8px",
                fontSize: 16,
                fontWeight: 400,
                opacity: 0.3,
              }}
            >
              All Categories
              <KeyboardArrowLeft />
            </Button>

            <Typography
              sx={{
                color: "onSurface",
                fontSize: 16,
                fontWeight: 400,
                p: "8px",
              }}
            >
              {category.name}
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            gap="16px"
            p={"24px 16px 40px"}
          >
            <Image
              src={category.image ?? require("@/assets/images/default-thumbnail.jpg")}
              alt={category.name}
              style={{ objectFit: "cover", width: "20%", height: "auto", borderRadius: "50%" }}
              priority={true}
            />
            <Stack
              sx={{
                display: "flex",
                p: "var(--none, 0px) var(--2, 16px)",
                flexDirection: "column",
                gap: "24px",
                alignSelf: "stretch",
              }}
            >
              <Typography
                sx={{
                  fontSize: 32,
                  fontWeight: 400,
                  lineHeight: "120%",
                  letterSpacing: "0.17px",
                  color: "onSurface",
                  fontFeatureSettings: "'clig' off, 'liga' off",
                }}
              >
                {category.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: "160%",
                  letterSpacing: "0.17px",
                  color: "onSurface",
                  fontFeatureSettings: "'clig' off, 'liga' off",
                }}
              >
                {category.description}
              </Typography>{" "}
            </Stack>
          </Stack>

          <FiltersSelected show={!allFilterParamsNull} />

          {!allFilterParamsNull && (
            <Box sx={{ px: { xs: "20px", md: "0px" } }}>
              <TemplatesSection
                filtered={!allFilterParamsNull}
                templates={templates ?? []}
                isLoading={isFetching}
                templateLoading={isTemplatesLoading}
                title="Best templates"
                onNextPage={handleNextPage}
                hasMore={hasMore}
                isInfiniteScrolling={false}
                hasPrev={hasPrev}
                onPrevPage={handlePrevPage}
              />
              {templates?.length === 0 && (
                <Typography
                  fontSize={{ xs: 14, md: 18 }}
                  fontWeight={400}
                  textAlign={"center"}
                  color={"onSurface"}
                >
                  No templates found. Please adjust your filters.
                </Typography>
              )}
            </Box>
          )}

          <Box py={"40px"}>
            <PopularTemplates catId={category?.id} />
          </Box>
          <FooterPrompt />
        </Box>
      </Layout>
    </ThemeProvider>
  );
}

export async function getServerSideProps({ params }: any) {
  const { categorySlug } = params;
  try {
    const categoryRes = await authClient.get(`/api/meta/categories/by-slug/${categorySlug}/`);
    const category = categoryRes.data; // Extract the necessary data from the response

    return {
      props: {
        category,
        title: category.meta_title ?? category.name,
        description: category.meta_description ?? category.description,
        meta_keywords: category.meta_keywords,
        image: category.image,
      },
    };
  } catch (error) {
    return {
      props: {
        category: {},
        title: SEO_TITLE,
        description: SEO_DESCRIPTION,
      },
    };
  }
}
