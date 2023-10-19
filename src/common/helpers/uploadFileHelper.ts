import { UploadFileResponse, FileType } from "@/common/types/prompt";

export interface FileReponse {
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
    const responseData = (await uploadFileMutation(selectedFile.file)) as UploadFileResponse;

    const { file, ...rest } = {
      [selectedFile.key ?? "fileUrl"]: responseData.data?.file_url || undefined,
      ...selectedFile,
      file: undefined,
    };

    return rest;
  } catch (_) {}
};

const extensionType = {
  pdf: ".pdf",
  docx: ".docx",
  txt: ".txt",
};

export const getFileTypesExtensions = (types: FileType[]): string => {
  const extensionTypes = types.map(type => extensionType[type]).filter(Boolean);
  return extensionTypes.join(",");
};
