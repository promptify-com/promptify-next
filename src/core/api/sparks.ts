import {
  ISparkWithTemplate,
  Spark,
  TemplateExecutionsDisplay,
} from "./dto/templates";
import useDeferredAction from "../../hooks/useDeferredAction";
import { authClient } from "../../common/axios";
import { baseApi } from "./api";

export const sparksApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getSparksByTemplate: builder.query<Spark[], number>({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}/sparks`,
          method: "get",
        }),
      }),
      getSparksByMe: builder.query<TemplateExecutionsDisplay[], void>({
        query: () => ({
          url: `/api/meta/sparks/me`,
          method: "get",
        }),
        providesTags: ["Sparks"],
      }),
      

      editSparkTitle: builder.mutation<
        Spark,
        { id: number; data: ISparkWithTemplate }
      >({
        query: ({ id, data }: { id: number; data: ISparkWithTemplate }) => ({
          url: `/api/meta/sparks/${id}/`,
          method: "patch",
          headers: { "Content-Type": "application/json" },
          data,
        }),
        invalidatesTags: ["Sparks"],
      }),
      deleteSpark: builder.mutation<Spark, number>({
        query: (id: number) => ({
          url: `/api/meta/sparks/${id}/`,
          method: "delete",
        }),
        invalidatesTags: ["Sparks"],
      }),
    };
  },
});

export const {
  useGetSparksByTemplateQuery,
  useGetSparksByMeQuery,
  useEditSparkTitleMutation,
  useDeleteSparkMutation,
} = sparksApi;

export const useTemplateView = () => {
  return useDeferredAction(async (id: number) => {
    return await authClient.post(`/api/meta/templates/${id}/view/`);
  }, []);
};
