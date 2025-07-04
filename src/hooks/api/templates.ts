import { authClient } from "@/common/axios";
import type { IEditTemplate } from "@/common/types/editTemplate";
import type { ITemplateWorkflow } from "@/components/Automation/types";
import type { Templates } from "@/core/api/dto/templates";

export const updateTemplate = async (id: number, data: IEditTemplate) => {
  return await authClient
    .put(
      `/api/meta/templates/${id}/`,
      {
        ...data,
      },
      { headers: { "Content-Type": "application/json" } },
    )
    .then(response => {
      return response.data;
    });
};

export const createTemplate = async (data: IEditTemplate) => {
  return await authClient
    .post(`/api/meta/templates/`, { ...data }, { headers: { "Content-Type": "application/json" } })
    .then(response => {
      return response.data;
    });
};

export const importTemplate = async (data: IEditTemplate) => {
  return await authClient
    .post(`/api/meta/templates/import/`, { ...data }, { headers: { "Content-Type": "application/json" } })
    .then(response => {
      return response.data;
    });
};

export const getTemplateBySlug = async (slug: string): Promise<Templates> => {
  return await authClient
    .get(`/api/meta/templates/by-slug/${slug}/`, {
      headers: { "Content-Type": "application/json" },
    })
    .then(response => {
      return response.data ?? {};
    });
};

export const getTemplateById = async (id: number): Promise<Templates> => {
  return await authClient.get(`/api/meta/templates/${id}/`).then(response => {
    return response.data;
  });
};

export const getWorkflowById = async (id: number): Promise<ITemplateWorkflow> => {
  return await authClient.get(`/api/n8n/workflows/${id}/`).then(response => {
    return response.data;
  });
};
