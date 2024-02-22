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

DOMPurify.addHook("afterSanitizeAttributes", function (node) {
  if ("href" in node) {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
    node.setAttribute("class", "link");
  }
});

export const sanitizeHTML = (html: string) => {
  return DOMPurify.sanitize(html, { FORBID_TAGS: ["style", "iframe", "script"] });
};
