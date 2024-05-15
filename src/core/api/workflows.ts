import { baseApi } from "./api";
import type {
  CreateCredentialPayload,
  ICredential,
  IWorkflow,
  IWorkflowCreateResponse,
} from "@/components/Automation/types";

export const workflowsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getWorkflows: builder.query<IWorkflow[], boolean>({
        query: enable => ({
          url: `/api/n8n/workflows/${enable ? "?enabled=true" : ""}`,
          method: "get",
          keepUnusedDataFor: 21600,
        }),
      }),

      getWorkflowByslug: builder.query<IWorkflow, string>({
        query: workflowSlug => ({
          url: `/api/n8n/workflow_by_slug/${workflowSlug}`,
          method: "get",
          keepUnusedDataFor: 21600,
        }),
      }),
      createUserWorkflow: builder.mutation<IWorkflowCreateResponse, number>({
        query: workflowId => ({
          url: `/api/n8n/workflows/${workflowId}/create/`,
          method: "post",
          data: { active: true },
        }),
      }),
      getWorkflow: builder.query<IWorkflowCreateResponse, string>({
        query: workflowId => ({
          url: `/api/n8n/workflows/${workflowId}/get_workflow`,
          method: "get",
          keepUnusedDataFor: 21600,
        }),
      }),

      getCredentials: builder.query<ICredential[], void>({
        query: () => ({
          url: `/api/n8n/workflows/credentials/`,
          method: "get",
          keepUnusedDataFor: 21600,
        }),
      }),
      createCredentials: builder.mutation<ICredential, CreateCredentialPayload>({
        query: data => ({
          url: `/api/n8n/workflows/credentials/`,
          method: "post",
          data,
        }),
      }),
      deleteCredential: builder.mutation<ICredential, string>({
        query: id => ({
          url: `/api/n8n/workflows/credentials/${id}`,
          method: "delete",
        }),
      }),
      updateWorkflow: builder.mutation<IWorkflowCreateResponse, { workflowId: number; data: IWorkflowCreateResponse }>({
        query: ({ workflowId, data }) => ({
          url: `/api/n8n/workflows/${workflowId}/update`,
          method: "put",
          data,
        }),
      }),
      getAuthUrl: builder.query<{ authUri: string }, { id: string; redirectUri: string }>({
        query: ({ id, redirectUri }) => ({
          url: `/api/oauth2/auth?id=${id}&redirectUri=${redirectUri}`,
          method: "get",
        }),
      }),
    };
  },
});

export const {
  useGetWorkflowsQuery,
  useCreateUserWorkflowMutation,
  useCreateCredentialsMutation,
  useGetCredentialsQuery,
  useDeleteCredentialMutation,
  useUpdateWorkflowMutation,
  useGetAuthUrlQuery,
  useGetWorkflowQuery,
  useGetWorkflowByslugQuery,
} = workflowsApi;
