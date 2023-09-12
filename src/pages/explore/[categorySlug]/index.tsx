import Link from "next/link";
import { useRouter } from "next/router";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";

import { authClient } from "@/common/axios";
import { SubCategoryCard } from "@/components/common/cards/CardSubcategory";
import { Category } from "@/core/api/dto/templates";
import { Layout } from "@/layout";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { FiltersSelected } from "@/components/explorer/FiltersSelected";
import SubCategoryPlaceholder from "@/components/placeholders/SubCategoryPlaceholder";
import { useGetTemplatesByFilter } from "@/hooks/useGetTemplatesByFilter";
import { useGetCategoriesQuery } from "@/core/api/categories";

export default function Page({ category }: { category: Category }) {
  const router = useRouter();
  const { templates, isFetching, categorySlug, allFilterParamsNull, isTemplatesLoading, hasMore, handleNextPage } =
    useGetTemplatesByFilter(category?.id);
  const { data: categories, isLoading: isCategoryLoading } = useGetCategoriesQuery(undefined);

  const goBack = () => {
    router.push("/explore");
  };
  const navigateTo = (item: Category) => {
    router.push(`/explore/${categorySlug}/${item.slug}`);
  };
  console.log(categories);
  return (
    <Layout>
      <Box
        mt={{ xs: 7, md: -2 }}
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
              display={"flex"}
              flexDirection={"column"}
              gap={"16px"}
            >
              <Grid>
                <Link
                  style={{ textDecoration: "none" }}
                  href={"/explore"}
                >
                  <Button
                    onClick={() => goBack()}
                    variant="text"
                    sx={{ fontSize: 19, color: "onSurface", ml: -3 }}
                  >
                    <KeyboardArrowLeft /> {category.name}
                  </Button>
                </Link>
                <Typography variant="body1">{category.description}</Typography>{" "}
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
                        onSelected={() => {
                          navigateTo(subcategory);
                        }}
                      />
                    </Grid>
                  ))}
              </Grid>
              <FiltersSelected show={!allFilterParamsNull} />
              <TemplatesSection
                filtred={!allFilterParamsNull}
                templates={templates ?? []}
                isLoading={isFetching}
                templateLoading={isTemplatesLoading}
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
  const { categorySlug } = params;
  try {
    const categoryRes = await authClient.get(`/api/meta/categories/by-slug/${categorySlug}/`);
    const category = categoryRes.data; // Extract the necessary data from the response
    console.log(category);
    return {
      props: {
        category,
        title: category.meta_title || category.name,
        description:
          category.meta_description ||
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
        meta_keywords: category.meta_keywords,
        image: category.image,
      },
    };
  } catch (error) {
    return {
      props: {
        category: {},
        title: "Promptify | Boost Your Creativity",
        description:
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
      },
    };
  }
}
