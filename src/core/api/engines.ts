import { Engine } from "./dto/templates";
import { baseApi } from "./api";

export const enginesApi = baseApi.injectEndpoints({
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

export const { useGetEnginesQuery } = enginesApi;
