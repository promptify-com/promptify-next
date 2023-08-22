import { Category } from "./dto/templates";
import { baseApi } from "./api";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: build => {
    return {
      getCategories: build.query<Category[], void>({
        query: () => ({
          url: `/api/meta/categories`,
          method: "get",
        }),
        providesTags: ["Categories"],
      }),
      // works for subcategory slug as well
      getCategoryBySlug: build.query<Category, string>({
        query: (slug: string) => ({
          url: `/api/meta/categories/by-slug/${slug}`,
          method: "get",
        }),
      }),
    };
  },
});

export const { useGetCategoriesQuery, useGetCategoryBySlugQuery } = categoriesApi;
