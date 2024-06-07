import WorkflowCardPlaceholder from "@/components/GPTs/WorkflowCardPlaceholder";
import GPTsSection from "@/components/GPTs/Sections/GPTsSection";
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
        <GPTsSection
          key={`${workflows.category}-${index}`}
          workflows={workflows.templates}
          isLoading={isLoading}
          header={workflows.category || ""}
          subheader="Enhance your daily routines and professional output with AI-driven solutions. "
        />
      ))}
    </>
  );
}

export default CategoryGPTsSection;
