import { IApp, IGPTDocumentPayload } from "@/components/Automation/app/hooks/types";
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
        }),
      }),
      getWorkflowById: builder.query<IWorkflow, number>({
        query: workflowsId => ({
          url: `/api/n8n/workflows/${workflowsId}/`,
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
      updateWorkflow: builder.mutation<
        IWorkflowCreateResponse,
        { workflowId: number | string | undefined; data: IWorkflowCreateResponse }
      >({
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
      saveDocument: builder.mutation<void, { payload: IGPTDocumentPayload }>({
        query: ({ payload }) => ({
          url: `/api/n8n/documents`,
          method: "post",
          body: payload,
        }),
      }),
      getUserWorkflows: builder.query<IApp[], void>({
        query: () => ({
          url: "/api/n8n/workflows/get_user_workflows",
          method: "get",
        }),
        keepUnusedDataFor: 21600,
      }),
      pauseWorkflow: builder.mutation<void, { workflowId: string }>({
        query: ({ workflowId }) => ({
          url: `/api/n8n/workflows/${workflowId}/toggle-periodic-task/pause`,
          method: "put",
        }),
      }),
      resumeWorkflow: builder.mutation<void, { workflowId: string }>({
        query: ({ workflowId }) => ({
          url: `/api/n8n/workflows/${workflowId}/toggle-periodic-task/resume`,
          method: "put",
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
  useGetAuthUrlQuery,
  useGetWorkflowQuery,
  useSaveDocumentMutation,
  useGetUserWorkflowsQuery,
  usePauseWorkflowMutation,
  useResumeWorkflowMutation,
} = workflowsApi;
