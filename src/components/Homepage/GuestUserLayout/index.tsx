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

function GuestUserLayout({ categories }: { categories: Category[] }) {
  const { data: popularTemplates, isLoading } = useGetTemplatesByFilterQuery({
    ordering: "-runs",
    limit: 30,
  });

  const _categories = categories.filter(
    category => !category.parent && category.is_visible && category.prompt_template_count,
  );

  return (
    <Stack gap={4}>
      <Landing />
      <CategoryCarousel categories={_categories} />
      <Services />
      <Stack
        py={{ xs: "30px", md: "48px" }}
        gap={4}
      >
        <Typography
          fontSize={32}
          fontWeight={400}
          color={"#2A2A3C"}
        >
          Most popular templates
        </Typography>
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
