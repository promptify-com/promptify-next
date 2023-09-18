import DOMPurify from "isomorphic-dompurify";
import { remark } from "remark";
import html from "remark-html";

export const markdownToHTML = async (markdown: string) => {
  const lines = markdown.split("\n");
  const processedLines = lines.map(line => {
    // Check if the line starts with more than 4 spaces
    if (/^ {5,}/.test(line)) {
      return line.replace(/^ {5,}/, "");
    } else {
      return line;
    }
  });

  const processedMarkdown = processedLines.join("\n");
  const processedContent = await remark().use(html, { sanitize: false }).process(processedMarkdown);

  // remark set language name as <code class="language-js"></code>. extract language name and put in a seperated div
  const htmlContent = processedContent.toString().replace(/<code class="language-([^"]+)"/g, (match, language) => {
    return `<div class="language-label">${language}</div><code class="language-${language}"`;
  });

  return htmlContent;
};

export const sanitizeHTML = (html: string) => {
  return DOMPurify.sanitize(html, { FORBID_TAGS: ["style", "a", "script"], FORBID_ATTR: ["href"] });
};
