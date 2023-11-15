import DOMPurify from "isomorphic-dompurify";
import { remark } from "remark";
import html from "remark-html";

export const markdownToHTML = async (markdown: string) => {
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(markdown.replace(/^(\s+){5,}(?![ ])/gm, "\n"));

  // remark set language name as <code class="language-js"></code>. extract language name and put in a seperated div
  const htmlContent = processedContent.toString().replace(/<code class="language-([^"]+)"/g, (match, language) => {
    return `<div class="language-label">${language}</div><code class="language-${language}"`;
  });

  return htmlContent;
};

export const sanitizeHTML = (html: string) => {
  return DOMPurify.sanitize(html, { FORBID_TAGS: ["style", "a", "script"], FORBID_ATTR: ["href"] });
};

export const isImageOutput = (output: string): boolean => {
  const IsImage =
    output.endsWith(".png") || output.endsWith(".jpg") || output.endsWith(".jpeg") || output.endsWith(".webp");

  return IsImage;
};
