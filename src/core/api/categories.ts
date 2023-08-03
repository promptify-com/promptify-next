import { Category } from "./dto/templates";
import { globalApi } from "./api";

export const categoriesApi = globalApi.injectEndpoints({
  endpoints: (build) => {
    return {
      getCategories: build.query<Category[], void>({
        query: () => ({
          url: `/api/meta/categories`,
          method: "get",
        }),
        providesTags: ["Categories"],
      }),
      getCategoryById: build.query<Category, number>({
        query: (id: number) => ({
          url: `/api/meta/categories/${id}`,
          method: "get",
        }),
      }),
      //   works for subcategory slug as well
      getCategoryBySlug: build.query<Category, string>({
        query: (slug: string) => ({
          url: `/api/meta/categories/by-slug/${slug}`,
          method: "get",
        }),
      }),
    };
  },
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetCategoryBySlugQuery,
} = categoriesApi;
