import WorkflowCardPlaceholder from "@/components/GPTs/WorkflowCardPlaceholder";
import GPTsSection from "@/components/GPTs/Sections/GPTsSection";
import type { IWorkflowCategory } from "@/components/Automation/types";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/router";

interface Props {
  workflowCategories?: IWorkflowCategory[];
  isLoading: boolean;
}

function CategoryGPTsSection({ workflowCategories, isLoading }: Props) {
  const router = useRouter();

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
          category={workflows.name}
          header={workflows.name || ""}
          subheader={
            workflows.description || "Enhance your daily routines and professional output with AI-driven solutions."
          }
          onClick={() => {
            router.push(`/apps/category/${workflows.name}`);
          }}
        />
      ))}
    </Stack>
  );
}

export default CategoryGPTsSection;
