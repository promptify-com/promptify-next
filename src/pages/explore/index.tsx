import { useEffect, useState } from "react";
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
import { SEO_DESCRIPTION } from "@/common/constants";
import { useRouter } from "next/router";
import { CategoryCard } from "@/components/common/cards/CardCategory";
import PopularTemplate from "@/components/explorer/PopularTemplate";
interface Props {
  categories: Category[];
}

export default function ExplorePage({ categories }: Props) {
  const { pathname } = useRouter();
  const ITEM_PER_PAGE = 12;
  const {
    templates: popularTemplates,
    isTemplatesLoading: isLoading,
    handleNextPage,
    hasMore,
    allFilterParamsNull,
    handlePrevPage,
  } = useGetTemplatesByFilter({ ordering: "-runs", templateLimit: ITEM_PER_PAGE });

  const [seeAll, setSeeAll] = useState(false);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 0) {
        setHasUserScrolled(true);
      } else {
        setHasUserScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const _categories = categories.filter(
    category => !category.parent && category.is_visible && category.prompt_template_count,
  );

  const isExplorePage = pathname === "/explore";

  return (
    <Layout>
      <Box
        mt={{ xs: 7, md: 0 }}
        padding={{ xs: "4px 0px", md: "0px 8px" }}
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
                  display="flex"
                  gap="8px"
                  alignItems="flex-start"
                  alignContent="flex-start"
                  alignSelf="stretch"
                  flexWrap={{ xs: "nowrap", md: "wrap" }}
                  sx={{
                    overflow: { xs: "auto", md: "initial" },
                    WebkitOverflowScrolling: { xs: "touch", md: "initial" },
                    justifyContent: "space-between",
                    px: { xs: "8px", md: "16px" },
                  }}
                >
                  {_categories.map(category => (
                    <Box
                      key={category.id}
                      sx={{
                        flex: "1 1 auto",
                        maxWidth: {
                          xs: `calc(100% / 2 - 8px)`,
                          sm: `calc(100% / 4 - 8px)`,
                          md: `calc((100% - (5 * 8px)) / 6)`,
                        },
                        mx: "8px",
                      }}
                    >
                      <CategoryCard
                        category={category}
                        priority={false}
                        href={`/explore/${category.slug}`}
                        isExplorePage={isExplorePage}
                        min
                      />
                    </Box>
                  ))}
                </Grid>
              </Stack>
            ) : (
              <CategoryCarousel
                categories={_categories}
                isExplorePage={isExplorePage}
                showAllCategories={() => setSeeAll(true)}
                userScrolled={hasUserScrolled}
              />
            ))}
          <PopularTemplate
            loading={isLoading}
            hasNext={hasMore}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            popularTemplate={popularTemplates}
            isExplorePage={isExplorePage}
            itemPerPage={ITEM_PER_PAGE}
          />
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
