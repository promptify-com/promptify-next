import Stack from "@mui/material/Stack";
import CarouselSection from "@/components/GPTs/Sections/CarouselSection";
import WorkflowCardPlaceholder from "@/components/GPTs/WorkflowCardPlaceholder";
import type { IWorkflowCategory } from "@/components/Automation/types";
import CategoryCard from "../CategoryCard";

interface Props {
  categories?: IWorkflowCategory[];
  isLoading: boolean;
  header: string;
}

const CategoriesSection = ({ categories, isLoading, header }: Props) => {
  if (isLoading) {
    return <WorkflowCardPlaceholder />;
  }

  if (!categories?.length) {
    return null;
  }

  return (
    <CarouselSection header={header}>
      {categories?.map(category => (
        <Stack
          key={category.name}
          mr={{
            xs: categories[categories.length - 1] === category ? "16px" : 0,
            md: categories[categories.length - 1] === category ? "24px" : 0,
          }}
        >
          <CategoryCard
            name={category.name}
            description={category.description}
            templates={category.templates}
          />
        </Stack>
      ))}
    </CarouselSection>
  );
};

export default CategoriesSection;
