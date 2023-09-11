import { useRouter } from "next/router";
import Head from "next/head";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { Box, Grid } from "@mui/material";

import { authClient } from "@/common/axios";
import { SubCategoryCard } from "@/components/common/cards/CardSubcategory";
import { Category } from "@/core/api/dto/templates";
import { Layout } from "@/layout";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { FiltersSelected } from "@/components/explorer/FiltersSelected";
import SubCategoryPlaceholder from "@/components/placeholders/SubCategoryPlaceholder";
import { useGetTemplatesByFilter } from "@/hooks/useGetTemplatesByFilter";
import Breadcrumb from "@/components/design-system/Breadcrumb";

interface CategoryOrSubcategory {
  category: Category;
  subcategory: Category;
}

export default function Page({ category, subcategory }: CategoryOrSubcategory) {
  const router = useRouter();
  const { templates, isFetching, categories, isCategoryLoading, allFilterParamsNull, hasMore, handleNextPage } =
    useGetTemplatesByFilter(undefined, subcategory?.id);

  const navigateTo = (slug: string) => {
    router.push(`/explore/${category.slug}/${slug}`);
  };

  const breadcrumbs = [
    { label: category.name, link: `/explore/${category.slug}` },
    { label: (router.query.subcategorySlug as string).replace(/-/g, " ") },
  ];

  return (
    <>
      <Head>
        <title>{subcategory?.name}</title>
        <meta
          name="description"
          content="Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out."
        />
      </Head>
      <Layout>
        <Box
          mt={{ xs: 7, md: 0 }}
          padding={{ xs: "4px 0px", md: "0px 8px" }}
        >
          <Grid
            sx={{
              padding: { xs: "16px", md: "32px" },
            }}
          >
            {isCategoryLoading ? (
              <SubCategoryPlaceholder />
            ) : (
              <Box
                gap={"16px"}
                display={"flex"}
                flexDirection={"column"}
                width={"100%"}
              >
                <Grid>
                  <Box sx={{ display: "flex", alignItems: { xs: "self-start", md: "center" } }}>
                    <KeyboardArrowLeft sx={{ mt: { xs: 0.3 } }} />
                    <Breadcrumb crumbs={breadcrumbs} />
                  </Box>
                </Grid>
                <Grid
                  display={"flex"}
                  gap={"8px"}
                  flexWrap={{ xs: "nowrap", md: "wrap" }}
                  sx={{
                    overflow: { xs: "auto", md: "initial" },
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {categories
                    ?.filter(
                      subcategory => category?.name == subcategory.parent?.name && subcategory.prompt_template_count,
                    )
                    .map(subcategory => (
                      <Grid key={subcategory.id}>
                        <SubCategoryCard
                          subcategory={subcategory}
                          onSelected={() => navigateTo(subcategory.slug)}
                        />
                      </Grid>
                    ))}
                </Grid>

                <FiltersSelected show={!allFilterParamsNull} />

                <TemplatesSection
                  filtred={!allFilterParamsNull}
                  templates={templates ?? []}
                  isLoading={isFetching}
                  onNextPage={handleNextPage}
                  hasMore={hasMore}
                />
              </Box>
            )}
          </Grid>
        </Box>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ params }: any) {
  const { categorySlug, subcategorySlug } = params;
  try {
    const categoryPromise = authClient.get<Category>(`/api/meta/categories/by-slug/${categorySlug}`);
    const subcategoryPromise = authClient.get<Category>(`/api/meta/categories/by-slug/${subcategorySlug}`);

    const [categoryRes, subcategoryRes] = await Promise.all([categoryPromise, subcategoryPromise]);

    const category = categoryRes.data;
    const subcategory = subcategoryRes.data;

    return {
      props: {
        category,
        subcategory,
      },
    };
  } catch (error) {
    return {
      props: {
        category: {},
        subcategory: {},
      },
    };
  }
}
