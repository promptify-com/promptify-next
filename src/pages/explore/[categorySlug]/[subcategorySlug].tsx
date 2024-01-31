import { useRouter } from "next/router";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { authClient } from "@/common/axios";
import SubCategoryCard from "@/components/common/cards/CardSubcategory";
import type { Category } from "@/core/api/dto/templates";
import { Layout } from "@/layout";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { FiltersSelected } from "@/components/explorer/FiltersSelected";
import SubCategoryPlaceholder from "@/components/placeholders/SubCategoryPlaceholder";
import { useGetTemplatesByFilter } from "@/hooks/useGetTemplatesByFilter";
import Breadcrumb from "@/components/design-system/Breadcrumb";
import { useGetCategoriesQuery } from "@/core/api/categories";

interface CategoryOrSubcategory {
  category: Category;
  subcategory: Category;
}

export default function Page({ category, subcategory }: CategoryOrSubcategory) {
  const router = useRouter();
  const { templates, isFetching, allFilterParamsNull, hasMore, handleNextPage } = useGetTemplatesByFilter({
    subCatId: subcategory?.id,
  });
  const { data: categories, isLoading: isCategoryLoading } = useGetCategoriesQuery();
  const breadcrumbs = [
    { label: category.name, link: `/explore/${category.slug}` },
    { label: (router.query.subcategorySlug as string).replace(/-/g, " ") },
  ];

  return (
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
                    subcategory =>
                      category.is_visible &&
                      subcategory.prompt_template_count &&
                      category?.name === subcategory.parent?.name,
                  )
                  .map(subcategory => (
                    <Grid key={subcategory.id}>
                      <SubCategoryCard
                        subcategory={subcategory}
                        categorySlug={category.slug}
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
        title: subcategory.name,
        description: subcategory.description,
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
