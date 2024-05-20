import { useEffect, useRef, useState } from "react";
import type { GetServerSideProps } from "next";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import lazy from "next/dynamic";
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
import PaginatedList from "@/components/PaginatedList";
import CardTemplate from "@/components/common/cards/CardTemplate";
import CardTemplatePlaceholder from "@/components/placeholders/CardTemplatePlaceHolder";
import type { Category, TemplateExecutionsDisplay, Templates, TemplatesWithPagination } from "@/core/api/dto/templates";
import { CategoryCard } from "@/components/common/cards/CardCategory";
import { authClient } from "@/common/axios";
import usePromptsFilter from "@/components/explorer/Hooks/usePromptsFilter";

const PromptsDrawerLazy = lazy(() => import("@/components/sidebar/PromptsFilter/PromptsDrawer"), {
  ssr: false,
});

interface Props {
  categories: Category[];
  popularTemplates: TemplatesWithPagination | null;
}

const scrollYThreshold = 500;

export default function ExplorePage({ categories = [], popularTemplates = null }: Props) {
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
  const { filters } = usePromptsFilter();

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
      {isMobile && (
        <Box
          mt={-2}
          zIndex={444}
        >
          <PromptsDrawerLazy />
        </Box>
      )}
      <Box
        mt={{ xs: 7, md: 0 }}
        position={"relative"}
        sx={{
          maxWidth: "1184px",
          margin: "0 auto",
          width: "100%",
        }}
        bgcolor={{ xs: "surfaceContainerLow", md: "surfaceContainerLowest" }}
      >
        <Grid
          display={"flex"}
          flexDirection={"column"}
          gap={"36px"}
          mt={{ xs: 5, md: 0 }}
          position={"relative"}
          sx={{
            padding: { xs: 0, md: "32px" },
          }}
        >
          <FiltersSelected show={!allFilterParamsNull} />

          {allFilterParamsNull &&
            !filters.isFavorite &&
            (seeAll ? (
              <Stack p={"8px 16px"}>
                <Typography
                  flex={1}
                  mb="33px"
                  fontSize={{ xs: 19, md: 32 }}
                  fontWeight={400}
                  color={"onSurface"}
                  lineHeight={"120%"}
                  letterSpacing={"0.17px"}
                  fontStyle={"normal"}
                >
                  Browse category
                </Typography>
                <Grid
                  container
                  spacing={{ xs: 2, md: 2 }}
                  alignItems={"flex-start"}
                >
                  {categories?.map(category => (
                    <Grid
                      item
                      xs={4}
                      sm={2}
                      md={isPromptsFiltersSticky ? 5 : 3}
                      lg={isPromptsFiltersSticky ? 3 : 2.4}
                      xl={2.4}
                      key={category.id}
                    >
                      <CategoryCard
                        category={category}
                        priority={false}
                        href={`/explore/${category.slug}`}
                        min={isMobile}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            ) : (
              <Stack mx={"16px"}>
                <CategoryCarousel
                  categories={categories}
                  userScrolled={hasUserScrolled}
                  priority={true}
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
                <PaginatedList
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
                </PaginatedList>
              )}
            </Box>
          )}

          {allFilterParamsNull && (
            <>
              <PopularTemplates initTemplates={popularTemplates} />

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
            </>
          )}
        </Grid>
        {!isMobile && <Footer />}
      </Box>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=60");

  let popularTemplates: TemplatesWithPagination | null = null;
  let categories: Category[] = [];
  const [_categories, _templates] = await Promise.allSettled([
    await getCategories(),
    authClient.get(
      "/api/meta/templates?ordering=-runs&limit=12&status=published&is_internal=false&include=slug,thumbnail,title,description,favorites_count,likes,executions_count,created_by,tags",
    ),
  ]);

  if (_templates.status === "fulfilled") {
    popularTemplates = _templates.value.data as TemplatesWithPagination;
  }
  if (_categories.status === "fulfilled") {
    categories = _categories.value;
  }

  return {
    props: {
      title: "Explore and Boost Your Creativity",
      description: SEO_DESCRIPTION,
      categories,
      popularTemplates,
    },
  };
};
