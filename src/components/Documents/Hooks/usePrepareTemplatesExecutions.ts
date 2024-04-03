import type { ExecutionWithTemplate, TemplateExecutionsDisplay, TemplatesExecutions } from "@/core/api/dto/templates";
import { useEffect, useState } from "react";

export const usePrepareTemplatesExecutions = (
  executions: TemplatesExecutions[],
  templates: TemplateExecutionsDisplay[],
  isFetching: boolean,
) => {
  const [preparedExecutions, setPreparedExecutions] = useState<ExecutionWithTemplate[]>([]);

  const mapExecutionsTemplates = async () => {
    const mappedExecutions = await Promise.all(
      executions.map(async execution => {
        const templateId = execution.template?.id!;

        let templateData = templates.find(template => template.id === templateId);

        return {
          ...execution,
          template: templateData ?? (execution.template as TemplateExecutionsDisplay),
        };
      }),
    );

    setPreparedExecutions(mappedExecutions || []);
  };

  useEffect(() => {
    if (!isFetching) {
      mapExecutionsTemplates();
    }
  }, [executions, isFetching]);

  return {
    executions: preparedExecutions,
  };
};
