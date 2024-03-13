import { Category } from "@/core/api/dto/templates";

export const getCategories = async (): Promise<Category[]> => {
  try {
    const responseCategories = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/meta/categories`);
    const categories = (await responseCategories.json()) as Category[];

    return (
      categories?.filter(category => !category.parent && category.prompt_template_count && category.is_visible) ?? []
    );
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};
