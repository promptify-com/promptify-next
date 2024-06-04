import Stack from "@mui/material/Stack";

import CarouselSection from "@/components/GPTs/CarouselSection";
import WorkflowCard from "@/components/GPTs/WorkflowCard";
import WorkflowCardPlaceholder from "@/components/GPTs/WorkflowCardPlaceholder";
import type { IWorkflow } from "@/components/Automation/types";

interface Props {
  schedulableWorkflows?: IWorkflow[];
  isLoading: boolean;
}

const HistoricalGPTsSection = ({ schedulableWorkflows, isLoading }: Props) => {
  if (isLoading) {
    return <WorkflowCardPlaceholder />;
  }

  return (
    <CarouselSection
      header="Historical GPTs"
      subheader="Lorem ipsum dolor sit amet consectetur adipisicing elit volantis."
    >
      {schedulableWorkflows?.map((workflow, index) => (
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

export default HistoricalGPTsSection;
