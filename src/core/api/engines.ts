import { Engine } from "./dto/templates";
import { globalApi } from "./api";

export const explorerApi = globalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getEngines: builder.query<Engine[], void>({
        query: () => ({
          url: `/api/meta/engines`,
          method: "get",
        }),
        providesTags: ["Engines"],
      }),
    };
  },
});

export const { useGetEnginesQuery } = explorerApi;
