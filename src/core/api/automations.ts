import { IWorkflow } from "@/common/types/automation";
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
    };
  },
});

export const { useGetWorkflowsQuery } = workflowsApi;
