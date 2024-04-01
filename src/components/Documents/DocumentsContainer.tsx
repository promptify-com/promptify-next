import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useMemo } from "react";
import type { Engine, Execution, ExecutionWithTemplate, TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import CardDocument from "./CardDocument";
import CardDocumentTemplatePlaceholder from "@/components/placeholders/CardDocumentTemplatePlaceholder";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import Grid from "@mui/material/Grid";
import { updatePopupTemplate } from "../../core/store/templatesSlice";

interface Props {
  templates: TemplateExecutionsDisplay[] | undefined;
  isLoading: boolean;
}

export default function DocumentsContainer({ templates, isLoading }: Props) {
  const dispatch = useAppDispatch();
  const isDocumentsFiltersSticky = useAppSelector(state => state.sidebar.isDocumentsFiltersSticky);
  const { status, contentTypes, engine, template } = useAppSelector(state => state.documents);

  const allExecutions = useMemo(() => {
    const allExecutions: ExecutionWithTemplate[] = [];
    templates?.forEach(template => {
      const templateInfo = {
        id: template.id,
        title: template.title,
        thumbnail: template.thumbnail,
        slug: template.slug,
      };
      // const engines = Array.from(
      //   template.prompts
      //     .reduce((map: Map<string, Engine>, prompt) => {
      //       map.set(prompt.engine.name, prompt.engine);
      //       return map;
      //     }, new Map())
      //     .values(),
      // );

      const executionsWithTemplate = template.executions.map((execution: Execution) => {
        // const output = execution.prompt_executions?.map(promptExec => promptExec.output).join() || "";
        return {
          ...execution,
          template: templateInfo,
          // engines,
          output: ".......",
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
      const templateMatch = !template || exec.template.id === template;

      // const engineMatch = !engine || exec.engines.some(eng => eng.name === engine?.name);
      // const contentTypeMatch =
      //   !contentTypes.length ||
      //   exec.engines.some(eng => contentTypes.find(type => type.toUpperCase() === eng.output_type));

      return statusMatch && templateMatch;
    });
  }, [allExecutions, status, contentTypes, engine, template]);

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
      <Grid
        container
        rowGap={2}
      >
        {isLoading ? (
          <Stack
            direction={"row"}
            flexWrap={"wrap"}
            gap={2}
          >
            <CardDocumentTemplatePlaceholder
              count={5}
              sx={{
                height: "315px",
              }}
            />
          </Stack>
        ) : executions.length ? (
          executions.map(execution => (
            <Grid
              key={execution.id}
              item
              xs={12}
              sm={6}
              md={isDocumentsFiltersSticky ? 8 : 6}
              lg={isDocumentsFiltersSticky ? 6 : 4}
              xl={3}
            >
              <CardDocument
                execution={execution}
                onClick={e => {
                  e.preventDefault();
                  dispatch(
                    updatePopupTemplate({
                      data: execution,
                    }),
                  );
                }}
              />
            </Grid>
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
      </Grid>
    </Stack>
  );
}
