import { ExecutionWithTemplate } from "@/core/api/dto/templates";
import { exportExecution } from "@/hooks/api/executions";

export const handleExport = async (execution: ExecutionWithTemplate | null, fileType: "word" | "pdf") => {
  const isPdf = fileType === "pdf";
  if (execution) {
    try {
      const fileData = await exportExecution(execution.id, fileType);

      const blob = new Blob([fileData], { type: isPdf ? "application/pdf" : "application/msword" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${execution.title}.${isPdf ? "pdf" : "docx"}`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting and downloading:", error);
    }
  }
};
