import { useRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { useGetTemplatesByFilterQuery } from "@/core/api/templates";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Landing from "@/components/Homepage/GuestUserLayout/Landing";
import CategoryCarousel from "@/components/common/CategoriesCarousel";
import Services from "@/components/Homepage/GuestUserLayout/Services";
import Learn from "@/components/Homepage/GuestUserLayout/Learn";
import Testimonials from "@/components/Homepage/GuestUserLayout/Testimonials";
import HomepageTemplates from "@/components/Homepage/HomepageTemplates";
import type { Category } from "@/core/api/dto/templates";

function GuestUserLayout({ categories }: { categories: Category[] }) {
  const templateContainerRef = useRef<HTMLDivElement | null>(null);
  const learnContainerRef = useRef<HTMLDivElement | null>(null);
  const testimonialsContainerRef = useRef<HTMLDivElement | null>(null);
  const observers = {
    templatesObserver: useIntersectionObserver(templateContainerRef, {}),
    learnObserver: useIntersectionObserver(learnContainerRef, {}),
    testimonialsObserver: useIntersectionObserver(testimonialsContainerRef, {}),
  };

  const { data: popularTemplates, isLoading } = useGetTemplatesByFilterQuery(
    {
      ordering: "-runs",
      limit: 30,
    },
    {
      skip: !observers.templatesObserver?.isIntersecting,
    },
  );

  const _categories = categories.filter(
    category => !category.parent && category.is_visible && category.prompt_template_count,
  );

  const showLearn = observers.learnObserver?.isIntersecting;
  const showTestimonials = observers.learnObserver?.isIntersecting;

  return (
    <Stack mx={{ md: "50px" }}>
      <Landing />
      <CategoryCarousel
        categories={_categories}
        href="/explore"
        autoPlay
        explore
      />
      <Services />
      <Stack
        ref={templateContainerRef}
        py={{ xs: "30px", md: "48px" }}
        gap={3}
      >
        <HomepageTemplates
          title="Most popular:"
          templates={popularTemplates?.results || []}
          templatesLoading={isLoading}
          showAdsBox
        />
      </Stack>
      <Box ref={learnContainerRef}>{showLearn && <Learn />}</Box>
      <Box ref={testimonialsContainerRef}>{showTestimonials && <Testimonials />}</Box>
    </Stack>
  );
}

export default GuestUserLayout;
