import { UploadFileResponse, FileType } from "@/common/types/prompt";

export interface FileReponse {
  key?: string;
  promptId?: number;
  file?: string;
}

type UploadFunction = (
  uploadFileMutation: (selectedFile: File) => unknown,
  selectedFile: SelectedFile,
) => Promise<SelectedFile | undefined>;

export type SelectedFile = {
  key?: string;
  promptId?: number;
  file: File | string | undefined;
};

export const uploadFileHelper: UploadFunction = async (uploadFileMutation, selectedFile) => {
  if (!(selectedFile.file instanceof File)) return;

  try {
    const responseData = (await uploadFileMutation(selectedFile.file)) as UploadFileResponse;
    return {
      ...selectedFile,
      file: responseData.data?.file_url,
    };
  } catch (_) {
    throw {
      ...selectedFile,
      file: undefined,
    };
  }
};

const extensionType = {
  pdf: ".pdf",
  docx: ".docx",
  txt: ".txt",
  mp3: ".mp3",
  wav: ".wav",
  webm: ".webm",
  mp4: ".mp4",
  mpeg: ".mpeg",
  mpga: ".mpga",
  m4a: ".m4a",
};

export const getFileTypeExtensionsAsString = (types: FileType[]): string => {
  const extensionTypes = types.map(type => extensionType[type]).filter(Boolean);
  return extensionTypes.join(",");
};
