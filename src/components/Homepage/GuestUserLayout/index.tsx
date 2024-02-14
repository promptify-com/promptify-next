import { useGetTemplatesByFilterQuery } from "@/core/api/templates";
import { Category } from "@/core/api/dto/templates";
import Landing from "./Landing";
import CategoryCarousel from "./CategoriesCarousel";
import Services from "./Services";
import Learn from "./Learn";
import Testimonials from "./Testimonials";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

function GuestUserLayout({ categories }: { categories: Category[] }) {
  const templateContainerRef = useRef<HTMLDivElement | null>(null);
  const observer = useIntersectionObserver(templateContainerRef, {
    threshold: 0.5,
  });

  const { data: popularTemplates, isLoading } = useGetTemplatesByFilterQuery(
    {
      ordering: "-runs",
      limit: 30,
    },
    {
      skip: !observer?.isIntersecting,
    },
  );

  const _categories = categories.filter(
    category => !category.parent && category.is_visible && category.prompt_template_count,
  );

  return (
    <Stack>
      <Landing />
      <CategoryCarousel categories={_categories} />
      <Services />
      <Stack
        ref={templateContainerRef}
        py={{ xs: "30px", md: "48px" }}
        gap={3}
      >
        <Stack p={"8px 16px"}>
          <Typography
            fontSize={{ xs: 28, md: 32 }}
            fontWeight={400}
            color={"#2A2A3C"}
          >
            Most popular templates:
          </Typography>
        </Stack>
        <TemplatesSection
          templateLoading={isLoading}
          templates={popularTemplates?.results}
          type="popularTemplates"
        />
      </Stack>
      <Learn />
      <Testimonials />
    </Stack>
  );
}

export default GuestUserLayout;
