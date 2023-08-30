import { remark } from "remark";
import html from "remark-html";

export const markdownToHTML = async (markdown: string) => {
  const processedContent = await remark().use(html, { sanitize: false }).process(markdown);

  return processedContent.toString();
};
