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
  isGPTScheduled?: boolean;
  onClick?: () => void;
  category?: string;
}

const GPTsSection = ({ workflows, isLoading, header, subheader, isGPTScheduled, onClick, category }: Props) => {
  if (isLoading) {
    return <WorkflowCardPlaceholder />;
  }

  if (!workflows?.length) {
    return null;
  }

  return (
    <CarouselSection
      header={header}
      subheader={subheader}
      onClick={onClick}
    >
      {workflows?.map(workflow => (
        <Stack
          key={workflow.id}
          mr={{
            xs: workflows[workflows.length - 1] === workflow ? "16px" : 0,
            md: workflows[workflows.length - 1] === workflow ? "24px" : 0,
          }}
        >
          <WorkflowCard
            templateWorkflow={
              ("template_workflow" in workflow ? workflow.template_workflow : workflow) as ITemplateWorkflow
            }
            periodic_task={workflow?.periodic_task}
            userWorkflowId={"template_workflow" in workflow ? workflow.id : ""}
            lastExecuted={"template_workflow" in workflow ? workflow.last_executed : null}
            isGPTScheduled={isGPTScheduled}
            category={category}
          />
        </Stack>
      ))}
    </CarouselSection>
  );
};

export default GPTsSection;
