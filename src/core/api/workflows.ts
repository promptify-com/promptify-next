import { baseApi } from "./api";
import type { IWorkflow, IWorkflowCreateResponse } from "@/components/Automation/types";

export const workflowsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getWorkflows: builder.query<IWorkflow[], void>({
        query: () => ({
          url: "/api/n8n/workflows",
          method: "get",
        }),
      }),
      getWorkflowById: builder.query<IWorkflow, number>({
        query: workflowsId => ({
          url: `/api/n8n/workflows/${workflowsId}/`,
          method: "get",
          keepUnusedDataFor: 60 * 60,
        }),
      }),
      createUserWorkflow: builder.mutation<IWorkflowCreateResponse, number>({
        query: workflowId => ({
          url: `/api/n8n/workflows/${workflowId}/create/`,
          method: "post",
          data: { active: true },
        }),
      }),
    };
  },
});

export const { useGetWorkflowsQuery, useCreateUserWorkflowMutation, useGetWorkflowByIdQuery } = workflowsApi;
