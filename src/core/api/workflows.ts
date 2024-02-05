import { baseApi } from "./api";
import type {
  CreateCredentialPayload,
  CredentialResponse,
  IWorkflow,
  IWorkflowCreateResponse,
} from "@/components/Automation/types";

export const workflowsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getWorkflows: builder.query<IWorkflow[], void>({
        query: () => ({
          url: "/api/n8n/workflows/?enabled=true",
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

      getCredentials: builder.query<CredentialResponse[], void>({
        query: () => ({
          url: `/api/n8n/workflows/credentials/`,
          method: "get",
        }),
      }),
      createCredentials: builder.mutation<CredentialResponse, CreateCredentialPayload>({
        query: data => ({
          url: `/api/n8n/workflows/credentials/`,
          method: "post",
          data,
        }),
      }),
      deleteCredential: builder.mutation<CredentialResponse, string>({
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
    };
  },
});

export const {
  useGetWorkflowsQuery,
  useCreateUserWorkflowMutation,
  useGetWorkflowByIdQuery,
  useCreateCredentialsMutation,
  useGetCredentialsQuery,
  useDeleteCredentialMutation,
  useUpdateWorkflowMutation,
} = workflowsApi;
