import DOMPurify from "isomorphic-dompurify";
import { remark } from "remark";
import html from "remark-html";

export const markdownToHTML = async (markdown: string) => {
  // TODO: investigate why 8 spaces are replace by <code> tag
  const processedContent = await remark().use(html, { sanitize: false }).process(markdown.replace("        ", ""));
  // remark set language name as <code class="language-js"></code>. extract language name and put in a seperated div
  const htmlContent = processedContent.toString().replace(/<code class="language-([^"]+)"/g, (match, language) => {
    return `<div class="language-label">${language}</div><code class="language-${language}"`;
  });

  return htmlContent;
};

export const sanitizeHTML = (html: string) => {
  return DOMPurify.sanitize(html, { FORBID_TAGS: ["style", "a", "script"], FORBID_ATTR: ["href"] });
};
