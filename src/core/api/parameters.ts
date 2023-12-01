import { IParameters } from "@/common/types";
import { baseApi } from "./api";
import { IParametersPreset, IParametersPresetPost } from "@/common/types/parametersPreset";

export const parametersApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getParameters: builder.query<IParameters[], void>({
        query: () => ({
          url: `/api/meta/predefined-parameters/`,
          method: "get",
        }),
        providesTags: ["Parameters"],
        keepUnusedDataFor: 3600,
      }),
      getParametersPresets: builder.query<IParametersPreset[], void>({
        query: () => ({
          url: `/api/meta/presets/`,
          method: "get",
        }),
        providesTags: ["ParametersPresets"],
        keepUnusedDataFor: 3600,
      }),
      createParametersPreset: builder.mutation<IParametersPreset[], IParametersPresetPost>({
        query: newPreset => ({
          url: `/api/meta/presets/`,
          method: "post",
          data: newPreset,
        }),
        invalidatesTags: ["ParametersPresets"],
      }),
    };
  },
});

export const { useGetParametersQuery, useGetParametersPresetsQuery, useCreateParametersPresetMutation } = parametersApi;
