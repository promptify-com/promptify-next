import { useRef } from "react";
import { useGetTemplatesByFilterQuery } from "@/core/api/templates";
import { Category } from "@/core/api/dto/templates";
import Landing from "./Landing";
import CategoryCarousel from "./CategoriesCarousel";
import Services from "./Services";
import Learn from "./Learn";
import Testimonials from "./Testimonials";
import { TemplatesSection } from "../../explorer/TemplatesSection";
import { Stack, Typography } from "@mui/material";

const ioLatestsOptions = {
  threshold: 0,
  rootMargin: "150px",
  disconnectNodeOnceVisible: true,
};
const ioPopularOptions = {
  threshold: 0.5,
  rootMargin: "100px",
  disconnectNodeOnceVisible: true,
};

function GuestUserLayout({ categories }: { categories: Category[] }) {
  const popularTemplatesRef = useRef<HTMLDivElement | null>(null);
  const { data: popularTemplates, isLoading } = useGetTemplatesByFilterQuery({
    ordering: "-runs",
    limit: 30,
  });

  return (
    <>
      <Landing />
      <CategoryCarousel categories={categories} />
      <Services />
      <Stack
        py={"48px"}
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
    </>
  );
}

export default GuestUserLayout;
