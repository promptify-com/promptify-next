import { IAnswer } from "@/components/Prompt/Types/chat";
import { uploadFileHelper } from "@/components/Prompt/Utils/uploadFileHelper";
import { useUploadFileMutation } from "@/core/api/uploadFile";

const useUploadPromptFiles = () => {
  const [uploadFile] = useUploadFileMutation();

  const uploadPromptFiles = (answers: IAnswer[], uploadedFiles: Map<string, string>) =>
    new Promise<{
      status: boolean;
      answers: IAnswer[];
      uploadedFiles: Map<string, string>;
    }>(async resolve => {
      let status = true;
      const _answers = await Promise.all(
        [...answers].map(async answer => {
          if (answer.answer instanceof File && !uploadedFiles.has(answer.inputName)) {
            const res = await uploadFileHelper(uploadFile, { file: answer.answer });
            const fileUrl = res?.file;

            if (typeof fileUrl === "string" && fileUrl) {
              uploadedFiles.set(answer.inputName, fileUrl);
            } else {
              answer.error = true;
              if (answer.required) {
                status = false;
              }
            }
          }
          return answer;
        }),
      );
      resolve({ status, answers: _answers, uploadedFiles });
    });

  return {
    uploadPromptFiles,
  };
};

export default useUploadPromptFiles;
