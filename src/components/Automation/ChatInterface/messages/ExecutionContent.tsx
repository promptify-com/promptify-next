import { useAppSelector } from "@/hooks/useStore";
import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect } from "react";

// Function to wrap image URLs in <img> tags
function wrapImages(content: string) {
  const imgRegex = /(https?:\/\/\S+\.(?:jpg|jpeg|png|gif|bmp|svg))/g;
  return content.replace(imgRegex, match => `<img src="${match}" alt="image" width="100%" />`);
}

export const ExecutionContent = ({ content, sx }: { content: string; sx?: SxProps }) => {
  const gptGenerationStatus = useAppSelector(state => state.chat?.gptGenerationStatus ?? "pending");

  useEffect(() => {
    const initializePreview = () => {
      const previewButtons = document.querySelectorAll(".preview-button");

      previewButtons.forEach(button => {
        const codeWrapper = button.closest(".code-wrapper") as HTMLElement | null;
        if (codeWrapper) {
          const codeBlock = codeWrapper.querySelector("code") as HTMLElement | null;
          const previewContainer = codeWrapper.querySelector(".preview") as HTMLElement | null;
          const codeButton = codeWrapper.querySelector(".code-button") as HTMLElement | null;

          if (codeBlock && previewContainer && codeButton) {
            if (!previewContainer.querySelector("iframe")) {
              const iframe = document.createElement("iframe");
              iframe.style.width = "100%";
              iframe.style.height = "400px";
              iframe.style.border = "none";
              iframe.srcdoc = codeBlock.textContent || "";
              previewContainer.innerHTML = "";
              previewContainer.appendChild(iframe);
            }

            if (gptGenerationStatus === "pending") {
              previewContainer.style.display = "block";
              codeBlock.style.display = "none";

              // Update active state of buttons
              button.classList.add("active");
              codeButton.classList.remove("active");
            } else if (gptGenerationStatus === "streaming") {
              previewContainer.style.display = "none";
              codeBlock.style.display = "block";

              // Update active state of buttons
              button.classList.remove("active");
              codeButton.classList.add("active");
            }
          }
        }
      });
    };

    // Initialize when the status changes
    initializePreview();

    // Handle click events for switching between preview and code
    const handleClick = async (event: MouseEvent) => {
      const clickTarget = event.target as HTMLElement;

      if (clickTarget.classList.contains("copy-button")) {
        const codeWrapper = clickTarget.closest(".code-wrapper") as HTMLElement | null;
        if (codeWrapper) {
          const codeElement = codeWrapper.querySelector("code") as HTMLElement | null;
          if (codeElement) {
            try {
              await navigator.clipboard.writeText(codeElement.innerText);
              clickTarget.innerText = "Copied!";
              setTimeout(() => (clickTarget.innerText = "Copy"), 3000);
            } catch (error) {
              console.error("Failed to copy code:", error);
            }
          }
        }
      }

      if (clickTarget.classList.contains("preview-button")) {
        const codeWrapper = clickTarget.closest(".code-wrapper") as HTMLElement | null;
        if (codeWrapper) {
          const codeBlock = codeWrapper.querySelector("code") as HTMLElement | null;
          const previewContainer = codeWrapper.querySelector(".preview") as HTMLElement | null;

          if (codeBlock && previewContainer) {
            previewContainer.style.display = "block";
            codeBlock.style.display = "none";
            clickTarget.classList.add("active");
            codeWrapper.querySelector(".code-button")?.classList.remove("active");
          }
        }
      }

      if (clickTarget.classList.contains("code-button")) {
        const codeWrapper = clickTarget.closest(".code-wrapper") as HTMLElement | null;
        if (codeWrapper) {
          const codeBlock = codeWrapper.querySelector("code") as HTMLElement | null;
          const previewContainer = codeWrapper.querySelector(".preview") as HTMLElement | null;

          if (codeBlock && previewContainer) {
            previewContainer.style.display = "none";
            codeBlock.style.display = "block";
            clickTarget.classList.add("active");
            codeWrapper.querySelector(".preview-button")?.classList.remove("active");
          }
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [gptGenerationStatus]);

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
            display: gptGenerationStatus === "streaming" ? "block" : "none", // Show code block first
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
          backgroundColor: "surfaceContainer",
          color: "#4d5562",
          borderBottom: "2px solid #4d5562",
          borderRadius: "16px",
        },
        ...(sx || {}),
      }}
      dangerouslySetInnerHTML={{
        __html: wrapImages(content),
      }}
    />
  );
};
