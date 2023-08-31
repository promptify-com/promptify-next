export const handleExport = async (data: any, fileType: "word" | "pdf", title: string) => {
  const isPdf = fileType === "pdf";
  try {
    const blob = new Blob([fileData], { type: isPdf ? "application/pdf" : "application/msword" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.${isPdf ? "pdf" : "docx"}`;
    a.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting and downloading:", error);
  }
};
