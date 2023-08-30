import { remark } from "remark";
import html from "remark-html";

export const markdownToHTML = async (markdown: string) => {
  const processedContent = await remark().use(html, { sanitize: false }).process(markdown);

  // remark set language name as <code class="language-js"></code>. extract language name and put in a seperated div
  const htmlContent = processedContent.toString().replace(/<code class="language-([^"]+)"/g, (match, language) => {
    return `<div class="language">${language}</div><code class="language-${language}"`;
  });

  return htmlContent;
};
