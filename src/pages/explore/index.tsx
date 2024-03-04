import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CategoryCarousel from "@/components/common/CategoriesCarousel";

import type { GetServerSideProps } from "next";
import { Layout } from "@/layout";
import { FiltersSelected } from "@/components/explorer/FiltersSelected";
import { Category } from "@/core/api/dto/templates";
import { useGetTemplatesByFilter } from "@/hooks/useGetTemplatesByFilter";
import { getCategories } from "@/hooks/api/categories";
import { isValidUserFn } from "@/core/store/userSlice";
import { SEO_DESCRIPTION } from "@/common/constants";
import { CategoryCard } from "@/components/common/cards/CardCategory";
import PopularTemplate from "@/components/explorer/PopularTemplate";
import { useAppSelector } from "@/hooks/useStore";
import { useGetSuggestedTemplatesByCategoryQuery } from "@/core/api/templates";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
interface Props {
  categories: Category[];
}

export default function ExplorePage({ categories }: Props) {
  const ITEM_PER_PAGE = 12;
  const {
    templates: popularTemplates,
    isTemplatesLoading: isLoading,
    handleNextPage,
    hasMore,
    allFilterParamsNull,
    handlePrevPage,
    isFetching,
  } = useGetTemplatesByFilter({ ordering: "-runs", templateLimit: ITEM_PER_PAGE });

  const isValidUser = useAppSelector(isValidUserFn);
  const { data: suggestedTemplates, isLoading: isSuggestedTemplatesLoading } = useGetSuggestedTemplatesByCategoryQuery(
    undefined,
    { skip: !isValidUser },
  );

  const [seeAll, setSeeAll] = useState(false);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 180;
      if (window.scrollY > threshold) {
        setHasUserScrolled(true);
      } else {
        setHasUserScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const _categories = categories.filter(
    category => !category.parent && category.is_visible && category.prompt_template_count,
  );

  return (
    <Layout>
      <Box
        mt={{ xs: 7, md: 0 }}
        padding={{ xs: "4px 0px", md: "0px 142px" }}
      >
        <Grid
          display={"flex"}
          flexDirection={"column"}
          gap={"36px"}
          sx={{
            padding: { xs: "16px", md: "32px" },
          }}
        >
          <FiltersSelected show={!allFilterParamsNull} />
          {allFilterParamsNull &&
            (seeAll ? (
              <Stack p={"8px 16px"}>
                <Typography
                  flex={1}
                  fontSize={{ xs: 28, md: 32 }}
                  fontWeight={400}
                  color={"#2A2A3C"}
                  mb="33px"
                >
                  Browse category
                </Typography>
                <Grid
                  display={"flex"}
                  flexDirection={"row"}
                  gap={"8px"}
                  alignItems={"flex-start"}
                  alignContent={"flex-start"}
                  alignSelf={"stretch"}
                  flexWrap={{ xs: "nowrap", md: "wrap" }}
                  sx={{
                    overflow: { xs: "auto", md: "initial" },
                    WebkitOverflowScrolling: { xs: "touch", md: "initial" },
                  }}
                >
                  {_categories.map(category => (
                    <Grid
                      key={category.id}
                      gap={"8px"}
                    >
                      <CategoryCard
                        category={category}
                        priority={false}
                        href={`/explore/${category.slug}`}
                        min
                      />
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            ) : (
              <CategoryCarousel
                categories={_categories}
                userScrolled={hasUserScrolled}
                onClick={() => setSeeAll(true)}
                gap={1}
              />
            ))}
          <PopularTemplate
            loading={isLoading}
            hasNext={hasMore}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            popularTemplate={popularTemplates}
            isFetching={isFetching}
          />
          {isValidUser && !!suggestedTemplates?.length && (
            <TemplatesSection
              filtered={false}
              templates={suggestedTemplates ?? []}
              isLoading={isSuggestedTemplatesLoading}
              templateLoading={isSuggestedTemplatesLoading}
              title={`Because you use ${suggestedTemplates?.[0]?.category?.name ?? "various"} prompts`}
            />
          )}
        </Grid>
      </Box>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=60");

  const categories = await getCategories();

  return {
    props: {
      title: "Explore and Boost Your Creativity",
      description: SEO_DESCRIPTION,
      categories,
    },
  };
};
