import { useRouter } from "next/router";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { authClient } from "@/common/axios";
import type { Category } from "@/core/api/dto/templates";
import { Layout } from "@/layout";
import { useGetTemplatesByFilter } from "@/hooks/useGetTemplatesByFilter";
import { SEO_DESCRIPTION, SEO_TITLE } from "@/common/constants";
import Image from "@/components/design-system/Image";
import PopularTemplates from "@/components/explorer/PopularTemplates";
import { ThemeProvider } from "@mui/material/styles";
import Footer from "@/components/Footer";
import { FiltersSelected } from "@/components/explorer/FiltersSelected";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { useDynamicColors } from "@/hooks/useDynamicColors";
import useBrowser from "@/hooks/useBrowser";

export default function Page({ category }: { category: Category }) {
  const router = useRouter();
  const { isMobile } = useBrowser();

  const {
    templates,
    isTemplatesLoading,
    handleNextPage,
    hasMore,
    allFilterParamsNull,
    isFetching,
    hasPrev,
    handlePrevPage,
  } = useGetTemplatesByFilter({
    catId: category?.id,
    ordering: "-likes",
    templateLimit: 8,
    paginatedList: true,
    initialStatus: "published",
  });

  const dynamicTheme = useDynamicColors(category.image);

  const goBack = () => {
    router.push("/explore");
  };

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
                transition: "opacity 0.3s ease-in-out",
                willChange: "opacity",
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
            gap={3}
            p={{ xs: "24px 16px 40px", md: "24px 24px 40px" }}
          >
            <Box
              sx={{
                width: "100%",
                minHeight: "192px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                src={category.image ?? require("@/assets/images/default-thumbnail.jpg")}
                alt={category.name}
                style={{ objectFit: "cover", minWidth: 168, height: "auto", borderRadius: "50%" }}
                priority={true}
              />
            </Box>
            <Stack
              sx={{
                display: "flex",
                px: { xs: 0, md: "16px" },
                flexDirection: "column",
                gap: "24px",
                alignSelf: "stretch",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  minHeight: { xs: "50px", md: "38px" },
                  width: "100%",
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
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: { xs: "200px", md: "130px" },
                  width: "100%",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: "160%",
                    letterSpacing: "0.17px",
                    color: "onSurface",
                  }}
                >
                  {category.description}
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <Stack gap={"36px"}>
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
          </Stack>

          {allFilterParamsNull && (
            <Box
              py={"40px"}
              width={"100%"}
            >
              <PopularTemplates catId={category?.id} />
            </Box>
          )}
          {!isMobile && <Footer />}
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
