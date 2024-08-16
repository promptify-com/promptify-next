import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import ClientOnly from "@/components/base/ClientOnly";
import CategoryCarousel from "@/components/common/CategoriesCarousel";
import Learn from "@/components/Homepage/GuestUserLayout/Learn";
import Testimonials from "@/components/Homepage/GuestUserLayout/Testimonials";
import SuggestionsSection from "@/components/Homepage/SuggestionsSection";
import { useGetTemplatesSuggestedQuery } from "@/core/api/templates";
import HomepageTemplates from "@/components/Homepage/HomepageTemplates";
import type { Category } from "@/core/api/dto/templates";
import { useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useGetWorkflowsQuery } from "@/core/api/workflows";
import { useSearchParams } from "next/navigation";
import HomepageAITemplates from "./HomepageAITemplates";

function HomepageLayout({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams();

  const { data: suggestedTemplates, isFetching } = useGetTemplatesSuggestedQuery(undefined);
  const { data: allWorkflows, isLoading: isLoadingAllWorkflows } = useGetWorkflowsQuery(
    searchParams.get("enable") === "true",
  );

  const carouselContainerRef = useRef<HTMLDivElement | null>(document.createElement("div"));
  const learnContainerRef = useRef<HTMLDivElement | null>(null);
  const testimonialsContainerRef = useRef<HTMLDivElement | null>(null);

  const observers = {
    carouselObserver: useIntersectionObserver(carouselContainerRef, { threshold: 0.5 }),
    learnObserver: useIntersectionObserver(learnContainerRef, { threshold: 0.5 }),
    testimonialsObserver: useIntersectionObserver(testimonialsContainerRef, { threshold: 0.5 }),
  };

  const showCarousel = observers.carouselObserver?.isIntersecting;
  const showLearn = observers.learnObserver?.isIntersecting;
  const showTestimonials = observers.learnObserver?.isIntersecting;

  return (
    <ClientOnly>
      <Grid
        mt={{ xs: 4, md: 0 }}
        flexDirection="column"
        display={"flex"}
        gap={{ xs: "35px", md: "80px" }}
        mx={{ md: "50px" }}
        maxWidth={{ xs: "90vw", md: "fit-content" }}
        data-cy="logged-in-main-container"
      >
        <SuggestionsSection />

        <Stack minHeight={"300px"}>
          <HomepageAITemplates
            title="You may like these AI Apps:"
            templates={allWorkflows || []}
            templatesLoading={isLoadingAllWorkflows}
            showAdsBox
          />
        </Stack>

        <Stack minHeight={"300px"}>
          <HomepageTemplates
            title="You may like these prompts:"
            templates={suggestedTemplates || []}
            templatesLoading={isFetching}
          />
        </Stack>

        <Stack
          mr={{ md: "16px" }}
          ref={carouselContainerRef}
        >
          {showCarousel && (
            <CategoryCarousel
              categories={categories}
              userScrolled={false}
              priority={false}
              href="/explore"
              gap={1}
              explore
              autoPlay
            />
          )}
        </Stack>

        <Stack ref={learnContainerRef}>{showLearn && <Learn />}</Stack>
        <Stack ref={testimonialsContainerRef}>{showTestimonials && <Testimonials />}</Stack>
      </Grid>
    </ClientOnly>
  );
}

export default HomepageLayout;
