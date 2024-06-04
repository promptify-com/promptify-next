import Stack from "@mui/material/Stack";

import CarouselSection from "@/components/GPTs/CarouselSection";
import WorkflowCard from "@/components/GPTs/WorkflowCard";
import WorkflowCardPlaceholder from "@/components/GPTs/WorkflowCardPlaceholder";
import type { IWorkflow } from "@/components/Automation/types";

interface Props {
  workflows?: IWorkflow[];
  isLoading: boolean;
}

const NewGPTsSection = ({ workflows, isLoading }: Props) => {
  if (isLoading) {
    return <WorkflowCardPlaceholder />;
  }

  return (
    <CarouselSection
      header="New GPTs"
      subheader="Lorem ipsum dolor sit amet consectetur adipisicing elit volantis."
    >
      {workflows?.map((workflow, index) => (
        <Stack key={workflow.id}>
          <WorkflowCard
            index={index}
            workflow={workflow}
          />
        </Stack>
      ))}
    </CarouselSection>
  );
};

export default NewGPTsSection;
