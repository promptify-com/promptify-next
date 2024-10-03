import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect } from "react";

// Function to wrap image URLs in <img> tags
function wrapImages(content: string) {
  const imgRegex = /(https?:\/\/\S+\.(?:jpg|jpeg|png|gif|bmp|svg))/g;

  return content.replace(imgRegex, match => {
    return `<img src="${match}" alt="image" width="100%" />`;
  });
}

export const ExecutionContent = ({ content, sx }: { content: string; sx?: SxProps }) => {
  useEffect(() => {
    // Handle click events for copying code and toggling preview/code views
    const handleClick = async (event: MouseEvent) => {
      const clickTarget = event.target as HTMLElement;

      // Handle code copy
      if (clickTarget.classList.contains("copy-button")) {
        const codeWrapper = clickTarget.closest("pre") as HTMLElement | null;
        if (codeWrapper) {
          const codeElement = codeWrapper.querySelector("code") as HTMLElement | null;
          if (codeElement) {
            try {
              await navigator.clipboard.writeText(codeElement.innerText);
              clickTarget.innerText = "Copied!";
              setTimeout(() => (clickTarget.innerText = "Copy code"), 3000);
            } catch (error) {
              console.error("Failed to copy code:", error);
            }
          }
        }
      }

      // Handle toggle between preview (iframe) and code view
      if (clickTarget.classList.contains("preview-button")) {
        const codeWrapper = clickTarget.closest(".code-wrapper") as HTMLElement | null;
        if (codeWrapper) {
          const codeBlock = codeWrapper.querySelector("code") as HTMLElement | null;
          const previewContainer = codeWrapper.querySelector(".preview") as HTMLElement | null;
          const previewButton = codeWrapper.querySelector(".preview-button") as HTMLElement | null;
          const codeButton = codeWrapper.querySelector(".code-button") as HTMLElement | null;

          if (codeBlock && previewContainer && previewButton && codeButton) {
            // Inject HTML content into the iframe if not already done
            if (!previewContainer.querySelector("iframe")) {
              const iframe = document.createElement("iframe");
              iframe.style.width = "100%";
              iframe.style.height = "400px";
              iframe.style.border = "none";

              // Use srcdoc to inject the HTML content into the iframe
              iframe.srcdoc = codeBlock.textContent || ""; // Ensure raw HTML is inserted

              previewContainer.innerHTML = ""; // Clear any existing preview
              previewContainer.appendChild(iframe); // Insert the iframe into the preview container
            }

            // Toggle the visibility of the preview (iframe) and code block
            previewContainer.style.display = "block";
            codeBlock.style.display = "none";

            // Update active tab styles
            previewButton.classList.add("active");
            codeButton.classList.remove("active");
          }
        }
      }

      // Handle code view toggle
      if (clickTarget.classList.contains("code-button")) {
        const codeWrapper = clickTarget.closest(".code-wrapper") as HTMLElement | null;
        if (codeWrapper) {
          const codeBlock = codeWrapper.querySelector("code") as HTMLElement | null;
          const previewContainer = codeWrapper.querySelector(".preview") as HTMLElement | null;
          const previewButton = codeWrapper.querySelector(".preview-button") as HTMLElement | null;
          const codeButton = codeWrapper.querySelector(".code-button") as HTMLElement | null;

          if (codeBlock && previewContainer && previewButton && codeButton) {
            // Show code block and hide preview
            previewContainer.style.display = "none";
            codeBlock.style.display = "block";

            // Update active tab styles
            codeButton.classList.add("active");
            previewButton.classList.remove("active");
          }
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        fontSize: { xs: 14, md: 15 },
        lineHeight: "170%",
        fontWeight: 400,
        color: "onSurface",
        wordWrap: "break-word",
        textAlign: "justify",
        float: "none",
        ".highlight": {
          backgroundColor: "yellow",
          color: "black",
        },
        pre: {
          m: "10px 0",
          borderRadius: "8px",
          overflowX: "auto",
          whiteSpace: "nowrap",
          code: {
            display: "block",
            padding: "16px 24px",
            borderRadius: 0,
            margin: 0,
          },
        },
        code: {
          bgcolor: "#282a35",
          color: "common.white",
          borderRadius: "4px",
          padding: "4px 6px",
          marginBottom: "10px",
          overflowX: "auto",
          fontSize: { xs: 12, md: 13 },
          whiteSpace: "pre-wrap",
          display: "block",
          maxWidth: "100%",
          boxSizing: "border-box",
        },
        ".code-wrapper-header": {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: "8px 24px",
          bgcolor: "#4d5562",
          color: "#ffffff",
          fontSize: 13,
        },
        ".copy-button, .toggle-button": {
          bgcolor: "transparent",
          color: "#ffffff",
          border: "none",
          cursor: "pointer",
          p: 0,
          ":hover": {
            color: "#efefef",
          },
        },
        ".preview": {
          display: "none", // Preview hidden by default
        },
        ".tab-buttons": {
          display: "flex",
          gap: "10px",
        },
        ".toggle-button": {
          padding: "8px 16px",
          backgroundColor: "transparent",
          color: "#ffffff",
          border: "none",
          cursor: "pointer",
          fontSize: "14px",
          borderBottom: "2px solid transparent",
        },
        ".toggle-button.active": {
          backgroundColor: "#ffffff",
          color: "#4d5562",
          borderBottom: "2px solid #4d5562",
        },
        ...(sx || {}),
      }}
      dangerouslySetInnerHTML={{
        __html: wrapImages(content),
      }}
    />
  );
};
