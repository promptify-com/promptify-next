import Stack from "@mui/material/Stack";

import CarouselSection from "@/components/GPTs/Sections/CarouselSection";
import WorkflowCard from "@/components/GPTs/WorkflowCard";
import WorkflowCardPlaceholder from "@/components/GPTs/WorkflowCardPlaceholder";
import type { ITemplateWorkflow, IWorkflowCreateResponse } from "@/components/Automation/types";

interface Props {
  workflows?: (ITemplateWorkflow | IWorkflowCreateResponse)[];
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
      {workflows?.map(workflow => (
        <Stack key={workflow.id}>
          <WorkflowCard
            templateWorkflow={
              ("template_workflow" in workflow ? workflow.template_workflow : workflow) as ITemplateWorkflow
            }
            periodic_task={workflow?.periodic_task}
            userWorkflowId={"template_workflow" in workflow ? workflow.id : ""}
            lastExecuted={"template_workflow" in workflow ? workflow.last_executed : null}
          />
        </Stack>
      ))}
    </CarouselSection>
  );
};

export default GPTsSection;
