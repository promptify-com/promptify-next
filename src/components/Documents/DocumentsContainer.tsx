import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useMemo } from "react";
import { Execution, ExecutionWithTemplate, TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import CardDocument from "./CardDocument";

interface Props {
  templates: TemplateExecutionsDisplay[] | undefined;
}

export default function DocumentsContainer({ templates }: Props) {
  const executions = useMemo(() => {
    // Calculate all executions from templates and add template information
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

    return allExecutions.sort((execA, execB) => {
      const aTimestamp = new Date(execA.created_at).getTime();
      const bTimestamp = new Date(execB.created_at).getTime();
      return bTimestamp - aTimestamp;
    });
  }, [templates]);

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
        {executions.map(execution => (
          <CardDocument
            key={execution.id}
            execution={execution}
          />
        ))}
      </Stack>
    </Stack>
  );
}
