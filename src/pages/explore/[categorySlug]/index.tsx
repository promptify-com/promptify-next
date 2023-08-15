import { useRouter } from "next/router";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import { authClient } from "@/common/axios";
import { FetchLoading } from "@/components/FetchLoading";
import { SubCategoryCard } from "@/components/common/cards/CardSubcategory";
import {
  Category,
  FilterParams,
  SelectedFilters,
} from "@/core/api/dto/templates";
import { useGetTemplatesByFilterQuery } from "@/core/api/templates";
import { Layout } from "@/layout";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { RootState } from "@/core/store";
import { FiltersSelected } from "@/components/explorer/FiltersSelected";
import { useGetCategoriesQuery } from "@/core/api/categories";

export default function Page({ category }: { category: Category }) {
  const router = useRouter();
  const categorySlug = router.query.categorySlug;
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();

  const title = useSelector((state: RootState) => state.filters.title);
  const filters = useSelector((state: RootState) => state.filters);
  const tags = useSelector((state: RootState) => state.filters.tag);
  const engineId = useSelector((state: RootState) => state.filters.engine?.id);

  function areAllStatesNull(filters: SelectedFilters): boolean {
    return (
      filters.engine === null &&
      filters.tag.every((tag) => tag === null) &&
      filters.title === null &&
      filters.category === null &&
      filters.subCategory === null
    );
  }

  const allNull = areAllStatesNull(filters);

  const filteredTags = tags
    .filter((item) => item !== null)
    .map((item) => item?.name)
    .join("&tag=");

  const params: FilterParams = {
    tag: filteredTags,
    engineId,
    title,
    categoryId: category.id,
  };
  const { data: templates, isLoading: isTemplatesLoading } =
    useGetTemplatesByFilterQuery(params);

  const filteredTemplates = useMemo(() => {
    if (templates) {
      return templates.filter((template) => template.status !== "ARCHIVED");
    }
    return templates ?? [];
  }, [templates]);

  const goBack = () => {
    router.push("/explore");
  };
  const navigateTo = (item: Category) => {
    router.push(`/explore/${categorySlug}/${item.slug}`);
  };

  return (
    <Layout>
      <Box mt={{ xs: 7, md: -2 }} padding={{ xs: "4px 0px", md: "0px 8px" }}>
        <Grid
          sx={{
            padding: { xs: "16px", md: "32px" },
          }}
        >
          {isCategoriesLoading ? (
            <Box>
              <FetchLoading />
            </Box>
          ) : (
            <Box display={"flex"} flexDirection={"column"} gap={"16px"}>
              <Grid>
                <Link style={{ textDecoration: "none" }} href={"/explore"}>
                  <Button
                    onClick={() => goBack()}
                    variant="text"
                    sx={{ fontSize: 19, color: "onSurface", ml: -3 }}
                  >
                    <KeyboardArrowLeft /> {category.name}
                  </Button>
                </Link>
                <Typography
                  variant="body1"
                  color={"text.secondary"}
                  sx={{ ml: 2.5 }}
                >
                  {category.description}
                </Typography>{" "}
                {/* Adding category description using Typography */}
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
                  ?.filter((mainCat) => category?.name == mainCat.parent?.name)
                  .map((subcategory) => (
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
              <FiltersSelected show={!allNull} />
              <TemplatesSection
                filtred
                templates={filteredTemplates}
                isLoading={isTemplatesLoading}
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
    const categoryRes = await authClient.get(
      `/api/meta/categories/by-slug/${categorySlug}/`
    );
    const category = categoryRes.data; // Extract the necessary data from the response

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
