import Storage from "@/common/storage";
import { IAnswer } from "@/components/Prompt/Types/chat";
import { ResOverrides } from "@/core/api/dto/prompts";

export const useStoreAnswersAndParams = () => {
  const storeAnswers = (answers: IAnswer[]) => {
    if (answers && answers.length) {
      Storage.set("answersStored", JSON.stringify(answers));
    }
  };

  const storeParams = (params: ResOverrides[]) => {
    if (params && params.length) {
      Storage.set("paramsStored", JSON.stringify(params));
    }
  };

  return { storeAnswers, storeParams };
};
