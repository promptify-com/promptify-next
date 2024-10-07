import DOMPurify from "isomorphic-dompurify";
import { remark } from "remark";
import html from "remark-html";

export const markdownToHTML = async (markdown: string) => {
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(markdown.replace(/^(\s+){5,}(?![ ])/gm, "\n"));

  // Convert processed markdown to HTML and handle code blocks
  const htmlContent = processedContent
    .toString()
    .replace(/<code class="language-([^"]+)"[^>]*>([\s\S]*?)<\/code>/g, (match, language, codeContent) => {
      const formattedCodeContent = codeContent.replace(/\n/g, "<br>");

      // If the language is 'html', add preview and code buttons
      if (language === "html") {
        return `
          <div class="code-wrapper">
            <div class="code-wrapper-header">
              <span class="language-label">${language}</span>
              <div>
                <button class="toggle-button preview-button" onclick="togglePreview(this)">Preview</button>
                <button class="toggle-button code-button active" onclick="toggleCode(this)">Code</button>
                <button class="copy-button" label="Copy">Copy</button>
              </div>
            </div>
            <div class="preview" style="display:none;">${codeContent}</div>
            <code class="language-${language}" style="display:block;">${formattedCodeContent}</code>
          </div>
        `;
      }

      return `
        <div class="code-wrapper-header">
          <span class="language-label">${language}</span>
          <button class="copy-button" label="Copy">Copy code</button>
        </div>
        <code class="language-${language}">${formattedCodeContent}</code>
      `;
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
