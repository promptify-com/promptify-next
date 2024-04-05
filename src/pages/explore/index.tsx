import { useEffect, useRef, useState } from "react";
import type { GetServerSideProps } from "next";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CategoryCarousel from "@/components/common/CategoriesCarousel";

import { Layout } from "@/layout";
import useBrowser from "@/hooks/useBrowser";
import { useGetTemplatesByFilter } from "@/hooks/useGetTemplatesByFilter";
import { getCategories } from "@/hooks/api/categories";
import { isValidUserFn } from "@/core/store/userSlice";
import { SEO_DESCRIPTION } from "@/common/constants";
import { useAppSelector } from "@/hooks/useStore";
import { useGetSuggestedTemplatesByCategoryQuery } from "@/core/api/templates";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import PopularTemplates from "@/components/explorer/PopularTemplates";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { FiltersSelected } from "@/components/explorer/FiltersSelected";
import Footer from "@/components/Footer";
import ExploreCardCategory from "@/components/common/cards/ExploreCardCategory";
import TemplatesPaginatedList from "@/components/TemplatesPaginatedList";
import CardTemplate from "@/components/common/cards/CardTemplate";
import CardTemplatePlaceholder from "@/components/placeholders/CardTemplatePlaceHolder";
import type { Category, TemplateExecutionsDisplay, Templates } from "@/core/api/dto/templates";

interface Props {
  categories: Category[];
}

const scrollYThreshold = 500;

export default function ExplorePage({ categories = [] }: Props) {
  const {
    templates,
    handleNextPage,
    hasMore,
    allFilterParamsNull,
    isTemplatesLoading,
    isFetching,
    hasPrev,
    handlePrevPage,
  } = useGetTemplatesByFilter({
    ordering: "-likes",
    templateLimit: 8,
    paginatedList: true,
    initialStatus: "published",
  });
  const { isMobile } = useBrowser();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observer = useIntersectionObserver(containerRef, {
    threshold: 0.5,
  });

  const isValidUser = useAppSelector(isValidUserFn);
  const isPromptsFiltersSticky = useAppSelector(state => state.sidebar.isPromptsFiltersSticky);
  const isFavorite = useAppSelector(state => state.filters.isFavourite);

  const {
    data: suggestedTemplates,
    isLoading: isSuggestedTemplatesLoading,
    isFetching: isFetchingSuggestions,
  } = useGetSuggestedTemplatesByCategoryQuery(undefined, { skip: !isValidUser || !observer?.isIntersecting });

  const [seeAll, setSeeAll] = useState(false);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isMobile) return;
      if (window.scrollY > scrollYThreshold) {
        setHasUserScrolled(true);
      } else {
        setHasUserScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]);

  return (
    <Layout>
      <Box
        mt={{ xs: 7, md: 0 }}
        position={"relative"}
        sx={{
          maxWidth: "1184px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Grid
          display={"flex"}
          flexDirection={"column"}
          gap={"36px"}
          mt={{ xs: 2, md: 0 }}
          position={"relative"}
          sx={{
            padding: { xs: 0, md: "32px" },
          }}
        >
          <FiltersSelected show={!allFilterParamsNull} />

          {allFilterParamsNull &&
            !isFavorite &&
            (seeAll ? (
              <Stack p={"8px 16px"}>
                <Typography
                  flex={1}
                  mb="33px"
                  fontSize={{ xs: 19, md: 32 }}
                  fontWeight={400}
                  color={"onSurface"}
                  fontFamily={"Poppins"}
                  lineHeight={"120%"}
                  letterSpacing={"0.17px"}
                  fontStyle={"normal"}
                >
                  Browse category
                </Typography>
                <Grid
                  container
                  spacing={{ xs: 1, md: 2 }}
                  alignItems={"flex-start"}
                  sx={{
                    overflow: { xs: "auto", md: "initial" },
                    WebkitOverflowScrolling: { xs: "touch", md: "initial" },
                  }}
                >
                  {categories?.map(category => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={isPromptsFiltersSticky ? 5 : 3}
                      lg={isPromptsFiltersSticky ? 3 : 2.4}
                      xl={2.4}
                      key={category.id}
                    >
                      <ExploreCardCategory category={category} />
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            ) : (
              <Stack mx={"16px"}>
                <CategoryCarousel
                  categories={categories}
                  userScrolled={hasUserScrolled}
                  onClick={() => {
                    setSeeAll(true);
                  }}
                  gap={1}
                  explore
                />
              </Stack>
            ))}

          {!allFilterParamsNull && (
            <Box sx={{ px: { xs: "20px", md: "0px" } }}>
              {isTemplatesLoading ? (
                <Grid
                  display={"flex"}
                  flexDirection={"row"}
                  gap={"16px"}
                  alignItems={"flex-start"}
                  alignContent={"flex-start"}
                  alignSelf={"stretch"}
                  flexWrap={{ xs: "nowrap", md: "wrap" }}
                >
                  <CardTemplatePlaceholder count={4} />
                </Grid>
              ) : templates?.length === 0 ? (
                <Typography
                  fontSize={{ xs: 14, md: 18 }}
                  fontWeight={400}
                  textAlign={"center"}
                  color={"onSurface"}
                >
                  No templates found. Please adjust your filters.
                </Typography>
              ) : (
                <TemplatesPaginatedList
                  loading={isFetching}
                  hasNext={!!hasMore}
                  onNextPage={handleNextPage}
                  hasPrev={hasPrev}
                  onPrevPage={handlePrevPage}
                  variant="outlined"
                >
                  <Grid
                    container
                    spacing={1}
                    alignItems={"flex-start"}
                    sx={{
                      overflow: { xs: "auto", md: "initial" },
                      WebkitOverflowScrolling: { xs: "touch", md: "initial" },
                    }}
                  >
                    {templates.map((template: TemplateExecutionsDisplay | Templates, index) => (
                      <Grid
                        item
                        xs={4}
                        sm={6}
                        md={isPromptsFiltersSticky ? 5 : 4}
                        lg={3}
                        key={`${template.id}_${index}`}
                      >
                        <CardTemplate template={template as Templates} />
                      </Grid>
                    ))}
                  </Grid>
                </TemplatesPaginatedList>
              )}
            </Box>
          )}

          <PopularTemplates />
          <Box
            ref={containerRef}
            sx={{
              m: { xs: "0 20px", md: "0px" },
            }}
          >
            {isFetchingSuggestions && (
              <Grid
                display={"flex"}
                flexDirection={"row"}
                gap={"16px"}
                alignItems={"flex-start"}
                alignContent={"flex-start"}
                alignSelf={"stretch"}
                flexWrap={{ xs: "nowrap", md: "wrap" }}
              >
                <CardTemplatePlaceholder count={4} />
              </Grid>
            )}
            {isValidUser && !!suggestedTemplates?.length && (
              <TemplatesSection
                filtered={false}
                templates={suggestedTemplates ?? []}
                isLoading={isSuggestedTemplatesLoading}
                templateLoading={isSuggestedTemplatesLoading}
                title={`Because you use ${suggestedTemplates?.[0]?.category?.name ?? "various"} prompts`}
              />
            )}
          </Box>
        </Grid>
        {!isMobile && <Footer />}
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
