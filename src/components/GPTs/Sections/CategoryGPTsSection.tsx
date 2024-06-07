import { Fragment } from "react";
import Stack from "@mui/material/Stack";

import CarouselSection from "@/components/GPTs/Sections/CarouselSection";
import WorkflowCard from "@/components/GPTs/WorkflowCard";
import WorkflowCardPlaceholder from "@/components/GPTs/WorkflowCardPlaceholder";
import type { IWorkflowCategory } from "@/components/Automation/types";

interface Props {
  workflowCategories?: IWorkflowCategory[];
  isLoading: boolean;
}

function CategoryGPTsSection({ workflowCategories, isLoading }: Props) {
  if (isLoading) {
    return <WorkflowCardPlaceholder />;
  }
  return (
    <>
      {workflowCategories?.map((workflows, index) => (
        <Fragment key={`${workflows.category}-${index}`}>
          <CarouselSection
            header={workflows.category || ""}
            subheader="Enhance your daily routines and professional output with AI-driven solutions. 
            Achieve more with less effort, maximizing your efficiency and effectiveness."
          >
            {workflows.templates.map(workflow => (
              <Stack key={workflow.id}>
                <WorkflowCard
                  templateWorkflow={workflow}
                  lastExecuted={null}
                />
              </Stack>
            ))}
          </CarouselSection>
        </Fragment>
      ))}
    </>
  );
}

export default CategoryGPTsSection;
