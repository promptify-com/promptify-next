import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useMemo } from "react";
import type { Engine, Execution, ExecutionWithTemplate, TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import CardDocument from "./CardDocument";
import CardDocumentTemplatePlaceholder from "@/components/placeholders/CardDocumentTemplatePlaceholder";
import { useAppSelector } from "@/hooks/useStore";

interface Props {
  templates: TemplateExecutionsDisplay[] | undefined;
  isLoading: boolean;
}

export default function DocumentsContainer({ templates, isLoading }: Props) {
  const { status, contentType, engine } = useAppSelector(state => state.documents);

  const allExecutions = useMemo(() => {
    const allExecutions: ExecutionWithTemplate[] = [];
    templates?.forEach(template => {
      const templateInfo = {
        title: template.title,
        thumbnail: template.thumbnail,
        slug: template.slug,
      };
      const engines = Array.from(
        template.prompts
          .reduce((map: Map<string, Engine>, prompt) => {
            map.set(prompt.engine.name, prompt.engine);
            return map;
          }, new Map())
          .values(),
      );

      const executionsWithTemplate = template.executions.map((execution: Execution) => {
        const output = execution.prompt_executions?.map(promptExec => promptExec.output).join() || "";
        return {
          ...execution,
          template: templateInfo,
          engines,
          output,
        };
      });
      allExecutions.push(...executionsWithTemplate);
    });

    return allExecutions.sort(
      (execA, execB) => new Date(execB.created_at).getTime() - new Date(execA.created_at).getTime(),
    );
  }, [templates]);

  const executions = useMemo(() => {
    return allExecutions.filter(exec => {
      const isDraft = status === "draft" && !exec.is_favorite;
      const isSaved = status === "saved" && exec.is_favorite;
      const statusMatch = !status || isDraft || isSaved;

      const engineMatch = !engine || exec.engines.some(eng => eng.name === engine?.name);
      const contentTypeMatch = !contentType || exec.engines.some(eng => eng.output_type === contentType.toUpperCase());

      return statusMatch && engineMatch && contentTypeMatch;
    });
  }, [allExecutions, status, contentType, engine]);

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
        ) : executions.length ? (
          executions.map(execution => (
            <CardDocument
              key={execution.id}
              execution={execution}
            />
          ))
        ) : (
          <Stack
            alignItems={"center"}
            justifyContent={"center"}
            sx={{
              m: "80px 0",
              width: "100%",
              opacity: 0.7,
              fontSize: 14,
              fontWeight: 400,
              color: "onSurface",
            }}
          >
            No document found
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
