import type { ExecutionWithTemplate, TemplateExecutionsDisplay, TemplatesExecutions } from "@/core/api/dto/templates";
import { getTemplateById } from "@/hooks/api/templates";
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

        let template = templates.find(template => template.id === templateId)!;

        // if (!template) {
        //   template = await getTemplateById(templateId);
        // }

        return { ...execution, template };
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
