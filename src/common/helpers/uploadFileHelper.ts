import { FileResponse, FileType } from "../types/prompt";

type UploadFunction = (
  uploadFileMutation: (selectedFile: File) => unknown,
  selectedFile: File,
) => Promise<string | undefined>;

export type SelectedFile = {
  key: string;
  promptId: number;
  file: File;
};

export const uploadFileHelperObject = async (
  uploadFileMutation: (selectedFile: File) => unknown,
  selectedFile: SelectedFile,
) => {
  const fileUrl = await uploadFileHelper(uploadFileMutation, selectedFile.file);
  const { file, ...rest } = { [selectedFile.key]: fileUrl, ...selectedFile, file: undefined };
  return rest;
};

export const uploadFileHelper: UploadFunction = async (uploadFileMutation, selectedFile) => {
  try {
    if (selectedFile instanceof File) {
      const responseData = (await uploadFileMutation(selectedFile)) as FileResponse;
      if (responseData?.data) {
        const { file_url } = responseData.data;
        return file_url;
      }
    }
  } catch (_) {}
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
