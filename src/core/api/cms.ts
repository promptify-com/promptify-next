import { Variation, Section } from "./dto/cms";
import { baseApi } from "./api";

export const cmsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getContentBySectioName: builder.query<Variation, string>({
        query: sectionName => ({
          url: `/api/meta/text-content/get_section_text_content/?section_name=${sectionName}`,
          method: "get",
          keepUnusedDataFor: 3600,
        }),
        transformResponse(response: Section) {
          const variations = response.variations;

          if (!variations.length) {
            return { name: "customized", content: "" };
          }

          const randomIndex = Math.floor(Math.random() * variations.length);
          variations[randomIndex].content = variations[randomIndex].content.replace(/<\/?[a-z]>|&nbsp;/gi, "");

          return variations[randomIndex];
        },
      }),
    };
  },
});

export const { useGetContentBySectioNameQuery } = cmsApi;
