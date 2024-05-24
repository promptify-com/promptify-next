import { LocalStorage } from "@/common/storage";
import { IAnswer } from "@/components/Prompt/Types/chat";
import { ResOverrides } from "@/core/api/dto/prompts";

export const useStoreAnswersAndParams = () => {
  const storeAnswers = (answers: IAnswer[]) => {
    if (answers && answers.length) {
      LocalStorage.set("answers", JSON.stringify(answers));
    }
  };

  const storeParams = (params: ResOverrides[]) => {
    if (params && params.length) {
      LocalStorage.set("paramsValue", JSON.stringify(params));
    }
  };

  return { storeAnswers, storeParams };
};
