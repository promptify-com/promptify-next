import { Variation, Section } from "@/core/api/dto/cms";

export const getContentBySectioName = async (sectionName: string): Promise<Variation> => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/api/meta/text-content/get_section_text_content/?section_name=${sectionName}`,
      {
        next: { revalidate: 3600 },
        cache: "force-cache",
      },
    );
    const data = (await response.json()) as Section;
    const variations = data.variations;

    if (variations.length) {
      const randomIndex = Math.floor(Math.random() * variations.length);
      variations[randomIndex].content = variations[randomIndex].content.replace(/<\/?[a-z]>|&nbsp;/gi, "");

      return variations[randomIndex];
    }
  } catch (error) {
    console.error("Failed to fetch CMS content for section name:", sectionName, error);
  }

  return { name: "customized", content: "" };
};
