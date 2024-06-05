import { baseApi } from "./api";
import type {
  CreateCredentialPayload,
  ICredential,
  IWorkflow,
  IWorkflowCreateResponse,
  UserWorkflowExecutionsResponse,
  UserWorkflowsResponse,
  IWorkflowCategory,
} from "@/components/Automation/types";

export const workflowsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getWorkflows: builder.query<IWorkflow[], boolean>({
        query: enable => ({
          url: `/api/n8n/workflows/${enable ? "?enabled=true" : ""}`,
          method: "get",
          keepUnusedDataFor: 21600,
          providesTags: ["Workflows"],
        }),
      }),

      getWorkflowBySlug: builder.query<IWorkflow, string>({
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
            templates: item.templates.filter((template: IWorkflow) => template.enabled),
          }));
        },
      }),
      deleteWorkflow: builder.mutation<void, string>({
        query: workflowId => ({
          url: `/api/n8n/workflows/${workflowId}/delete`,
          method: "delete",
        }),
        invalidatesTags: ["Workflows"],
      }),
      likeWorkflow: builder.mutation<void, string | number>({
        query: workflowId => ({
          url: `/api/n8n/workflows/${workflowId}/like`,
          method: "post",
        }),
        invalidatesTags: ["Workflows", "UserWorkflows", "CategoryWorkflows"],
      }),
      dislikeWorkflow: builder.mutation<void, string | number>({
        query: workflowId => ({
          url: `/api/n8n/workflows/${workflowId}/unlike`,
          method: "delete",
        }),
        invalidatesTags: ["Workflows", "UserWorkflows", "CategoryWorkflows"],
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
} = workflowsApi;
