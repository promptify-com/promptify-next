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
            subheader="Lorem ipsum dolor sit amet consectetur adipisicing elit volantis."
          >
            {workflows.templates.map((workflow, index) => (
              <Stack key={workflow.id}>
                <WorkflowCard
                  index={index}
                  workflow={workflow}
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
