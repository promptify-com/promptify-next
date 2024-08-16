import { useEffect, useRef, useState } from "react";
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
import type { Category, ICardTemplate } from "@/core/api/dto/templates";
import { useGetWorkflowsQuery } from "@/core/api/workflows";

function GuestUserLayout({ categories }: { categories: Category[] }) {
  const [templates, setTemplates] = useState<ICardTemplate[]>([]);
  const [workflows, setWorkflows] = useState<ICardTemplate[]>([]);

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

  const showLearn = observers.learnObserver?.isIntersecting;
  const showTestimonials = observers.learnObserver?.isIntersecting;
  const showCarousel = observers.carouselObserver?.isIntersecting;

  useEffect(() => {
    if (popularTemplates) {
      const tempTemplates = popularTemplates?.results.map(template => ({
        image: template.thumbnail,
        title: template.title,
        href: `/prompt/${template.slug}`,
        executionsCount: template.executions_count,
        tags: template.tags,
        description: template.description,
        slug: template.slug,
        likes: template.likes,
        created_by: template.created_by,
      }));
      setTemplates(tempTemplates);
    }
  }, [popularTemplates]);

  useEffect(() => {
    if (allWorkflows) {
      const tempWorkflows = allWorkflows.map(workflow => ({
        image: workflow.image ?? "",
        title: workflow.name,
        href: `/apps/${workflow.slug}`,
        executionsCount: workflow.execution_count,
        tags: [{ id: 1, name: workflow.category.name }],
        description: workflow.description ?? "",
        slug: workflow.slug,
        likes: workflow.likes,
        created_by: workflow.created_by,
      }));
      setWorkflows(tempWorkflows);
    }
  }, [allWorkflows]);

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
          templates={templates || []}
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
          templates={workflows || []}
          templatesLoading={isLoading}
        />
      </Stack>
      <Box ref={learnContainerRef}>{showLearn && <Learn />}</Box>
      <Box ref={testimonialsContainerRef}>{showTestimonials && <Testimonials />}</Box>
    </Stack>
  );
}

export default GuestUserLayout;
