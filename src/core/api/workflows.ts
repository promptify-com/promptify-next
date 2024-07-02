import { baseApi } from "./api";
import type {
  CreateCredentialPayload,
  ICredential,
  ITemplateWorkflow,
  IWorkflowCreateResponse,
  UserWorkflowExecutionsResponse,
  UserWorkflowsResponse,
  IWorkflowCategory,
  IGPTDocumentPayload,
  IGPTDocumentResponse,
} from "@/components/Automation/types";

export const workflowsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getWorkflows: builder.query<ITemplateWorkflow[], boolean>({
        query: enable => ({
          url: `/api/n8n/workflows/${enable ? "?enabled=true" : ""}`,
          method: "get",
          keepUnusedDataFor: 21600,
        }),
        providesTags: ["TemplateWorkflows"],
      }),

      getWorkflowBySlug: builder.query<ITemplateWorkflow, string>({
        query: workflowSlug => ({
          url: `/api/n8n/workflows/by-slug/${workflowSlug}`,
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
      getUserWorkflows: builder.query<UserWorkflowsResponse, void>({
        query: () => ({
          url: `/api/n8n/workflows/get_user_workflows`,
          method: "get",
          keepUnusedDataFor: 21600,
        }),
        providesTags: ["UserWorkflows"],
      }),
      getWorkflowExecutions: builder.query<UserWorkflowExecutionsResponse, string>({
        query: workflowId => ({
          url: `/api/n8n/workflows/${workflowId}/executions?includeData=true`,
          method: "get",
          keepUnusedDataFor: 21600,
        }),
        transformResponse(executions: UserWorkflowExecutionsResponse) {
          if (!executions?.data?.length) {
            return {
              data: [],
              nextCursor: null,
            };
          }

          return {
            data: executions.data.map(execution => ({
              id: execution.id,
              status: execution.status,
              startedAt: execution.startedAt,
              error: execution.data?.resultData?.error?.message ?? "",
            })),
            nextCursor: executions.nextCursor,
          };
        },
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
      updateWorkflow: builder.mutation<IWorkflowCreateResponse, { workflowId: string; data: IWorkflowCreateResponse }>({
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
      getWorkflowByCategory: builder.query<IWorkflowCategory[], void>({
        query: () => ({
          url: `/api/n8n/workflows/by_category`,
          method: "get",
          params: {
            enabled: true,
          },
        }),
        keepUnusedDataFor: 3600,
        providesTags: ["CategoryWorkflows"],
        transformResponse(items: IWorkflowCategory[] = []) {
          return items.map(item => ({
            ...item,
            templates: item.templates.filter((template: ITemplateWorkflow) => template.enabled),
          }));
        },
      }),
      deleteWorkflow: builder.mutation<void, string>({
        query: workflowId => ({
          url: `/api/n8n/workflows/${workflowId}/delete`,
          method: "delete",
        }),
        invalidatesTags: ["UserWorkflows"],
      }),
      likeWorkflow: builder.mutation<void, number>({
        query: templateWorkflowId => ({
          url: `/api/n8n/workflows/${templateWorkflowId}/like`,
          method: "post",
        }),
        invalidatesTags: ["TemplateWorkflows", "UserWorkflows", "CategoryWorkflows"],
      }),
      dislikeWorkflow: builder.mutation<void, number>({
        query: templateWorkflowId => ({
          url: `/api/n8n/workflows/${templateWorkflowId}/like`,
          method: "delete",
        }),
        invalidatesTags: ["TemplateWorkflows", "UserWorkflows", "CategoryWorkflows"],
      }),
      pauseWorkflow: builder.mutation<void, string>({
        query: workflowId => ({
          url: `/api/n8n/workflows/${workflowId}/toggle-periodic-task/pause`,
          method: "put",
          invalidatesTags: ["Workflow"],
        }),
      }),
      resumeWorkflow: builder.mutation<void, string>({
        query: workflowId => ({
          url: `/api/n8n/workflows/${workflowId}/toggle-periodic-task/resume`,
          method: "put",
          invalidatesTags: ["Workflow"],
        }),
      }),
      saveGPTDocument: builder.mutation<void, IGPTDocumentPayload>({
        query: data => ({
          url: `/api/n8n/documents`,
          method: "post",
          data,
        }),
      }),
      getGPTDocuments: builder.query<IGPTDocumentResponse[], void>({
        query: () => ({
          url: `/api/n8n/documents`,
          method: "get",
          keepUnusedDataFor: 21600,
        }),
      }),
      updateGPTDocument: builder.mutation<void, { workflowDbId: number; data: Partial<IGPTDocumentPayload> }>({
        query: ({ workflowDbId, data }) => ({
          url: `/api/n8n/documents/${workflowDbId}`,
          method: "patch",
          data,
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
  useGetWorkflowBySlugQuery,
  useGetWorkflowExecutionsQuery,
  useGetWorkflowByCategoryQuery,
  useGetUserWorkflowsQuery,
  useDeleteWorkflowMutation,
  useLikeWorkflowMutation,
  useDislikeWorkflowMutation,
  usePauseWorkflowMutation,
  useResumeWorkflowMutation,
  useSaveGPTDocumentMutation,
  useGetGPTDocumentsQuery,
  useUpdateGPTDocumentMutation,
} = workflowsApi;
