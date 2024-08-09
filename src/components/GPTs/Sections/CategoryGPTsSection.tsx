import WorkflowCardPlaceholder from "@/components/GPTs/WorkflowCardPlaceholder";
import GPTsSection from "@/components/GPTs/Sections/GPTsSection";
import type { IWorkflowCategory } from "@/components/Automation/types";
import Stack from "@mui/material/Stack";

interface Props {
  workflowCategories?: IWorkflowCategory[];
  isLoading: boolean;
}

function CategoryGPTsSection({ workflowCategories, isLoading }: Props) {
  console.log(workflowCategories, "wsad");
  if (isLoading) {
    return <WorkflowCardPlaceholder />;
  }
  return (
    <Stack gap={"48px"}>
      {workflowCategories?.map((workflows, index) => (
        <GPTsSection
          key={`${workflows.name}-${index}`}
          workflows={workflows.templates}
          isLoading={isLoading}
          header={workflows.name || ""}
          subheader={
            workflows.description || "Enhance your daily routines and professional output with AI-driven solutions."
          }
        />
      ))}
    </Stack>
  );
}

export default CategoryGPTsSection;
