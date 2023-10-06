import { FileResponse, FileType } from "../types/prompt";

type UploadFunction = (
  uploadFileMutation: (selectedFile: File) => unknown,
  selectedFile: File,
) => Promise<string | undefined>;

export const uploadFileHelper: UploadFunction = async (uploadFileMutation, selectedFile) => {
  try {
    const responseData = (await uploadFileMutation(selectedFile)) as FileResponse;

    if (responseData?.data) {
      const { file_url } = responseData.data;
      return file_url;
    }
  } catch (error) {
    console.error(error);
  }
  return undefined;
};

const extensionType = {
  pdf: ".pdf",
  docx: ".docx",
  txt: ".txt",
};

export const generateAcceptString = (types: FileType[]): string => {
  const extensionTypes = types.map(type => extensionType[type]).filter(Boolean);
  return extensionTypes.join(",");
};
