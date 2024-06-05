import Stack from "@mui/material/Stack";

import CarouselSection from "@/components/GPTs/Sections/CarouselSection";
import WorkflowCard from "@/components/GPTs/WorkflowCard";
import WorkflowCardPlaceholder from "@/components/GPTs/WorkflowCardPlaceholder";
import type { IWorkflow, IWorkflowCreateResponse } from "@/components/Automation/types";

interface Props {
  workflows?: (IWorkflow | IWorkflowCreateResponse)[];
  isLoading: boolean;
  header: string;
  subheader?: string;
}

const GPTsSection = ({ workflows, isLoading, header, subheader }: Props) => {
  if (isLoading) {
    return <WorkflowCardPlaceholder />;
  }

  return (
    <CarouselSection
      header={header}
      subheader={subheader}
    >
      {workflows?.map((workflow, index) => (
        <Stack key={workflow.id}>
          <WorkflowCard
            index={index}
            workflow={("template_workflow" in workflow ? workflow.template_workflow : workflow) as IWorkflow}
            periodic_task={workflow?.periodic_task}
            workflowId={"template_workflow" in workflow ? workflow.id : ""}
          />
        </Stack>
      ))}
    </CarouselSection>
  );
};

export default GPTsSection;
