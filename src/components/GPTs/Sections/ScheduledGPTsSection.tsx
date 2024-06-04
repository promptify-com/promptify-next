import Stack from "@mui/material/Stack";

import CarouselSection from "@/components/GPTs/CarouselSection";
import WorkflowCard from "@/components/GPTs/WorkflowCard";
import WorkflowCardPlaceholder from "@/components/GPTs/WorkflowCardPlaceholder";
import type { IWorkflowCreateResponse } from "@/components/Automation/types";

interface Props {
  filteredUserWorkflows: IWorkflowCreateResponse[] | undefined;
  isLoading: boolean;
}

const ScheduledGPTsSection = ({ filteredUserWorkflows, isLoading }: Props) => {
  if (isLoading) {
    return <WorkflowCardPlaceholder />;
  }

  return (
    <CarouselSection
      header="Scheduled GPTs"
      subheader="Lorem ipsum dolor sit amet consectetur adipisicing elit volantis."
    >
      {filteredUserWorkflows?.map((workflow, index) => (
        <Stack key={workflow.id}>
          <WorkflowCard
            index={index}
            workflow={workflow?.template_workflow}
            periodic_task={workflow?.periodic_task}
            workflowId={workflow.id}
          />
        </Stack>
      ))}
    </CarouselSection>
  );
};

export default ScheduledGPTsSection;
