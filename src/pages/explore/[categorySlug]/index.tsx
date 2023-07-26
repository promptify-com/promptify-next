import { useRouter } from "next/router";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { Box, Button, Grid } from "@mui/material";

import { authClient } from "@/common/axios";
import { FetchLoading } from "@/components/FetchLoading";
import { SubCategoryCard } from "@/components/common/cards/CardSubcategory";
import { Category } from "@/core/api/dto/templates";
import {
  useGetCategoriesQuery,
  useGetTemplatesByFilterQuery,
} from "@/core/api/explorer";
import { Layout } from "@/layout";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/core/store";
import { FiltersSelected } from "@/components/explorer/FiltersSelected";
import {
  setSelectedCategory,
  setSelectedSubCategory,
} from "@/core/store/filtersSlice";

export default function Page({ category }: { category: Category }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const categorySlug = router.query.categorySlug;
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();

  const navigateTo = (item: Category) => {
    router.push(`/explore/${categorySlug}/${item.slug}`);
    dispatch(setSelectedSubCategory(item));
  };

  const filters = useSelector((state: RootState) => state.filters);
  const tag = useSelector((state: RootState) => state.filters.tag?.name);
  const engineId = useSelector((state: RootState) => state.filters.engine?.id);

  const isFiltersNullish = Object.values(filters).every((value) => {
    return value === null ? true : false;
  });

  const { data: templates, isLoading: isTemplatesLoading } =
    useGetTemplatesByFilterQuery({
      categoryId: category.id,
      tag,
      engineId,
    });

  const goBack = () => {
    router.push("/explore");
    dispatch(setSelectedCategory(null));
  };

  return (
    <Layout>
      <Box padding={{ xs: "4px 0px", md: "0px 8px" }}>
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
                <Button
                  onClick={() => goBack()}
                  variant="text"
                  sx={{ fontSize: 19, color: "onSurface", ml: -3 }}
                >
                  <KeyboardArrowLeft /> {category.name}
                </Button>
              </Grid>
              <Grid
                display={"flex"}
                gap={"8px"}
                flexWrap={{ xs: "nowrap", md: "wrap" }}
                overflow={{ xs: "auto", md: "initial" }}
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
              <FiltersSelected show={!isFiltersNullish} />
              <TemplatesSection
                filtred
                templates={templates}
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
        title: category?.name,
        description:
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
        meta_keywords: "",
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
