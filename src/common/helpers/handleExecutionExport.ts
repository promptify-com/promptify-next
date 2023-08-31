const contentTypeMapping = {
  pdf: "application/pdf",
  word: "application/msword",
};

const extensionTypeMapping = {
  pdf: "pdf",
  word: "docx",
};

export const downloadBlobObject = (data: BlobPart, fileType: "word" | "pdf", title: string) => {
  if (!contentTypeMapping[fileType]) {
    throw new Error(`File type "${fileType}" is not supported!`);
  }

  try {
    const blob = new Blob([data], { type: contentTypeMapping[fileType] });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.${extensionTypeMapping[fileType]}`;
    a.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading incoming data:", error);
  }
};
