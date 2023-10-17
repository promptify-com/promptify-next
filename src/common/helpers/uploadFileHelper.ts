import { FileResponse, FileType } from "../types/prompt";

interface FileReponse {
  key?: string;
  promptId?: number;
  fileUrl?: string;
}

type UploadFunction = (
  uploadFileMutation: (selectedFile: File) => unknown,
  selectedFile: {
    file: File;
    promptId?: number;
    key?: string;
  },
) => Promise<FileReponse | undefined>;

export type SelectedFile = {
  key: string;
  promptId: number;
  file: File;
};

export const uploadFileHelper: UploadFunction = async (uploadFileMutation, selectedFile) => {
  try {
    if (selectedFile.file instanceof File) {
      const responseData = (await uploadFileMutation(selectedFile.file)) as FileResponse;
      if (responseData?.data) {
        const { file_url } = responseData.data;
        const { file, ...rest } = {
          [selectedFile.key ? selectedFile.key : "fileUrl"]: file_url,
          ...selectedFile,
          file: undefined,
        };
        return rest;
      } else {
        const { file, ...rest } = {
          [selectedFile.key ? selectedFile.key : "fileUrl"]: undefined,
          ...selectedFile,
          file: undefined,
        };
        return rest;
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
