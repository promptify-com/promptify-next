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
import PopularTemplates from "@/components/explorer/PopularTemplates";
import { useAppSelector } from "@/hooks/useStore";
import { useGetSuggestedTemplatesByCategoryQuery } from "@/core/api/templates";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import useBrowser from "@/hooks/useBrowser";
import FooterPrompt from "@/components/explorer/FooterPrompt";

interface Props {
  categories: Category[];
}

export default function ExplorePage({ categories }: Props) {
  const {
    templates,
    isTemplatesLoading,
    handleNextPage,
    hasMore,
    allFilterParamsNull,
    isFetching,
    hasPrev,
    handlePrevPage,
  } = useGetTemplatesByFilter({ ordering: "-likes", templateLimit: 5, paginatedList: true });
  const { isMobile } = useBrowser();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observer = useIntersectionObserver(containerRef, {
    threshold: 0.5,
  });

  const isValidUser = useAppSelector(isValidUserFn);
  const { data: suggestedTemplates, isLoading: isSuggestedTemplatesLoading } = useGetSuggestedTemplatesByCategoryQuery(
    undefined,
    { skip: !isValidUser || !observer?.isIntersecting },
  );

  const [seeAll, setSeeAll] = useState(false);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isMobile) return;
      const threshold = 200;
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
  }, [isMobile]);

  const _categories = categories.filter(
    category => !category.parent && category.is_visible && category.prompt_template_count,
  );

  return (
    <Layout>
      <Box
        mt={{ xs: 7, md: 0 }}
        sx={{
          maxWidth: "1072px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Grid
          display={"flex"}
          flexDirection={"column"}
          gap={"36px"}
          sx={{
            padding: { xs: 0, md: "32px" },
          }}
        >
          <FiltersSelected show={!allFilterParamsNull} />
          {allFilterParamsNull &&
            (seeAll ? (
              <Stack p={"8px 16px"}>
                <Typography
                  flex={1}
                  fontSize={{ xs: 22, md: 32 }}
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

          {!allFilterParamsNull && (
            <Box sx={{ px: { xs: "20px", md: "0px" } }}>
              <TemplatesSection
                filtered={!allFilterParamsNull}
                templates={templates ?? []}
                isLoading={isFetching}
                templateLoading={isTemplatesLoading}
                title="Best templates"
                onNextPage={handleNextPage}
                hasMore={hasMore}
                isInfiniteScrolling={false}
                hasPrev={hasPrev}
                onPrevPage={handlePrevPage}
              />
              {templates?.length === 0 && (
                <Typography
                  fontSize={{ xs: 14, md: 18 }}
                  fontWeight={400}
                  textAlign={"center"}
                  color={"onSurface"}
                >
                  No templates found. Please adjust your filters.
                </Typography>
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
        <FooterPrompt />
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
