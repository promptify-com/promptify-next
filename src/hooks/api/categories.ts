import { Category, HomePageSimplifiedCategory } from "@/core/api/dto/templates";

export const getCategories = async (
  req: string | "other",
): Promise<{
  originalCategories?: Category[];
  homePageCategories?: HomePageSimplifiedCategory[];
}> => {
  try {
    const responseCategories = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/meta/categories/`, {
      cache: "force-cache",
    });
    const originalCategories = (await responseCategories.json()) as Category[];

    // Optimize the filter property
    const filteredCategories = originalCategories.filter(
      category => category.prompt_template_count && category.is_visible && !category.parent,
    );

    // Create a simplified version of the categories
    const homePageCategories = filteredCategories.map(({ id, name, image, slug, prompt_template_count }) => ({
      id,
      name,
      image,
      slug,
      prompt_template_count,
    })) as HomePageSimplifiedCategory[];

    if (req === "homepage") {
      return { homePageCategories };
    }

    return { originalCategories: filteredCategories };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { originalCategories: [], homePageCategories: [] };
  }
};
