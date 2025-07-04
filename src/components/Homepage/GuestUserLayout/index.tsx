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
import { useGetWorkflowsQuery } from "@/core/api/workflows";

function GuestUserLayout({ categories }: { categories: Category[] }) {
  const templateContainerRef = useRef<HTMLDivElement | null>(null);
  const learnContainerRef = useRef<HTMLDivElement | null>(null);
  const testimonialsContainerRef = useRef<HTMLDivElement | null>(null);
  const carouselContainerRef = useRef<HTMLDivElement | null>(null);

  const { data: allWorkflows, isLoading: isLoadingAllWorkflows } = useGetWorkflowsQuery(false);

  const observers = {
    templatesObserver: useIntersectionObserver(templateContainerRef, {}),
    learnObserver: useIntersectionObserver(learnContainerRef, {}),
    testimonialsObserver: useIntersectionObserver(testimonialsContainerRef, {}),
    carouselObserver: useIntersectionObserver(carouselContainerRef, {}),
  };
  const { data: popularTemplates, isLoading } = useGetTemplatesByFilterQuery(
    {
      ordering: "-runs",
      limit: 30,
      status: "published",
      include: "slug,thumbnail,title,description,favorites_count,likes,created_by,tags",
    },
    {
      skip: !observers.templatesObserver?.isIntersecting,
    },
  );

  const _categories = categories.filter(
    category => !category.parent && category.is_visible && category.prompt_template_count,
  );

  const templates = (popularTemplates?.results ?? []).map(template => ({
    ...template,
    image: template.thumbnail,
    href: `/prompt/${template.slug}`,
    type: "template",
  }));

  const workflows = (allWorkflows ?? []).map(workflow => ({
    ...workflow,
    title: workflow.name,
    href: `/apps/${workflow.slug}`,
    tags: [{ id: 1, name: workflow.category.name }],
    category_name: workflow.category.name,
    executions_count: workflow.execution_count,
    type: "workflow",
  }));

  const showLearn = observers.learnObserver?.isIntersecting;
  const showTestimonials = observers.learnObserver?.isIntersecting;
  const showCarousel = observers.carouselObserver?.isIntersecting;

  return (
    <Stack
      mx={{ md: "50px" }}
      data-cy="guest-main-container"
    >
      <Landing />
      <Box ref={carouselContainerRef}>
        {showCarousel && (
          <CategoryCarousel
            categories={_categories}
            href="/explore"
            autoPlay
            explore
          />
        )}
      </Box>

      <Services />

      <Stack minHeight={"300px"}>
        <HomepageTemplates
          title="You may like these AI Apps:"
          templates={workflows}
          templatesLoading={isLoadingAllWorkflows}
          showAdsBox
        />
      </Stack>

      <Stack
        ref={templateContainerRef}
        py={{ xs: "30px", md: "48px" }}
        gap={3}
      >
        <HomepageTemplates
          title="Most popular:"
          templates={templates}
          templatesLoading={isLoading}
        />
      </Stack>
      <Box ref={learnContainerRef}>{showLearn && <Learn />}</Box>
      <Box ref={testimonialsContainerRef}>{showTestimonials && <Testimonials />}</Box>
    </Stack>
  );
}

export default GuestUserLayout;
