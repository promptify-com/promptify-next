import { IWorkflow } from "@/components/Automation/types";
import { baseApi } from "./api";

export const workflowsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getWorkflows: builder.query<IWorkflow[], void>({
        query: () => ({
          url: "/api/n8n/workflows",
          method: "get",
        }),
      }),
      createUserWorkflow: builder.mutation({
        query: (workflowId: number) => ({
          url: "/api/n8n/workflows",
          method: "post",
          data: { workflowId },
        }),
      }),
    };
  },
});

export const { useGetWorkflowsQuery, useCreateUserWorkflowMutation } = workflowsApi;
