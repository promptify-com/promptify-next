import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useMemo } from "react";
import { Execution, ExecutionWithTemplate, TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import CardDocument from "./CardDocument";
import CardDocumentTemplatePlaceholder from "../placeholders/CardDocumentTemplatePlaceholder";
import { useAppSelector } from "@/hooks/useStore";

interface Props {
  templates: TemplateExecutionsDisplay[] | undefined;
  isLoading: boolean;
}

export default function DocumentsContainer({ templates, isLoading }: Props) {
  const { status } = useAppSelector(state => state.documents);

  const allExecutions = useMemo(() => {
    const allExecutions: ExecutionWithTemplate[] = [];
    templates?.forEach(template => {
      const templateInfo = {
        title: template.title,
        thumbnail: template.thumbnail,
        slug: template.slug,
      };
      const executionsWithTemplate = template.executions.map((execution: Execution) => ({
        ...execution,
        template: templateInfo,
      }));
      allExecutions.push(...executionsWithTemplate);
    });

    return allExecutions.sort(
      (execA, execB) => new Date(execB.created_at).getTime() - new Date(execA.created_at).getTime(),
    );
  }, [templates]);

  const executions = useMemo(() => {
    return allExecutions.filter(exec => {
      if (status === "draft") return !exec.is_favorite;
      else if (status === "saved") return exec.is_favorite;
      else return true;
    });
  }, [allExecutions, status]);

  return (
    <Stack gap={3}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={1}
        p={"8px 16px"}
      >
        <Typography
          fontSize={32}
          fontWeight={400}
        >
          All documents
        </Typography>
      </Stack>
      <Stack
        direction={"row"}
        flexWrap={"wrap"}
        rowGap={3}
      >
        {isLoading ? (
          <CardDocumentTemplatePlaceholder
            count={5}
            sx={{
              height: "315px",
              width: "368px",
              mx: "8px",
            }}
          />
        ) : (
          executions.map(execution => (
            <CardDocument
              key={execution.id}
              execution={execution}
            />
          ))
        )}
      </Stack>
    </Stack>
  );
}
