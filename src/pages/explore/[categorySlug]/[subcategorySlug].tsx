import { useRouter } from "next/router";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { Box, Button, Grid } from "@mui/material";

import { authClient } from "@/common/axios";
import { FetchLoading } from "@/components/FetchLoading";
import { SubCategoryCard } from "@/components/common/cards/CardSubcategory";
import { Category } from "@/core/api/dto/templates";
import { Layout } from "@/layout";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { useGetTemplateBySubCategoryQuery } from "@/core/api/explorer";
import Head from "next/head";
import {
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
} from "@/core/api/categories";

export default function Page({ category }: { category: Category }) {
  const router = useRouter();
  const subCategorySlug = router.query.subcategorySlug;
  console.log(router.query);

  const { data: subcategory } = useGetCategoryBySlugQuery(subCategorySlug);
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();
  const { data: templates, isLoading: isTemplatesLoading } =
    useGetTemplateBySubCategoryQuery(subCategorySlug as string);
  const navigateTo = (slug: string) => {
    router.push(`/explore/${category.slug}/${slug}`);
  };
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
        {isCategoriesLoading ? (
          <Box>
            <FetchLoading />
          </Box>
        ) : (
          <Box
            gap={"16px"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"start"}
            width={"100%"}
          >
            <Button
              onClick={() => router.push("/explore")}
              variant="text"
              sx={{ fontSize: 19, color: "onSurface", ml: -3 }}
            >
              <KeyboardArrowLeft /> {category.name}
            </Button>
            <Grid display={"flex"} gap={"8px"} flexWrap={"wrap"}>
              {categories
                ?.filter((mainCat) => category?.name == mainCat.parent?.name)
                .map((subcategory) => (
                  <Grid key={subcategory.id}>
                    <SubCategoryCard
                      subcategory={subcategory}
                      onSelected={() => navigateTo(subcategory.slug)}
                    />
                  </Grid>
                ))}
            </Grid>
            <TemplatesSection
              filtred
              templates={templates}
              isLoading={isTemplatesLoading}
            />
          </Box>
        )}
      </Layout>
    </>
  );
}

export async function getServerSideProps({ params }: any) {
  const { categorySlug } = params;
  try {
    const categoryRes = await authClient.get(
      `/api/meta/categories/by-slug/${categorySlug}`
    );
    const category = categoryRes.data; // Extract the necessary data from the response
    return {
      props: {
        category,
      },
    };
  } catch (error) {
    return {
      props: {
        category: {},
      },
    };
  }
}
