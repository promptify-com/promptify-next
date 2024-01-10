import { IAnswer } from "@/components/Prompt/Types/chat";
import { uploadFileHelper } from "@/components/Prompt/Utils/uploadFileHelper";
import { useUploadFileMutation } from "@/core/api/uploadFile";
import { useRef } from "react";

interface IInputFile {
  name: string;
  file: File;
  error?: boolean;
}

const useUploadPromptFiles = () => {
  const [uploadFile] = useUploadFileMutation();
  const uploadedFiles = useRef(new Map<string, string>());

  const uploadPromptFiles = (inputs: IInputFile[]) =>
    new Promise<{
      status: boolean;
      inputs: IInputFile[];
    }>(async resolve => {
      let status = true;
      await Promise.all(
        inputs.map(async input => {
          if (!uploadedFiles.current.has(input.name)) {
            const res = await uploadFileHelper(uploadFile, { file: input.file });
            const fileUrl = res?.file;

            if (typeof fileUrl === "string" && fileUrl) {
              uploadedFiles.current.set(input.name, fileUrl);
            } else {
              input.error = true;
              status = false;
            }
          }
          return input;
        }),
      );
      resolve({ status, inputs });
    });

  const uploadPromptAnswersFiles = (answers: IAnswer[], uploadedFiles: Map<string, string>) =>
    new Promise<{
      status: boolean;
      answers: IAnswer[];
      uploadedFiles: Map<string, string>;
    }>(async resolve => {
      let status = true;
      const _answers = await Promise.all(
        [...answers].map(async answer => {
          const _answer = { ...answer };
          if (answer.answer instanceof File && !uploadedFiles.has(answer.inputName)) {
            const res = await uploadFileHelper(uploadFile, { file: answer.answer });
            const fileUrl = res?.file;

            if (typeof fileUrl === "string" && fileUrl) {
              uploadedFiles.set(answer.inputName, fileUrl);
            } else {
              _answer.error = true;
              if (answer.required) {
                status = false;
              }
            }
          }
          return _answer;
        }),
      );
      resolve({ status, answers: _answers, uploadedFiles });
    });

  return {
    uploadedFiles,
    uploadPromptFiles,
    uploadPromptAnswersFiles,
  };
};

export default useUploadPromptFiles;
