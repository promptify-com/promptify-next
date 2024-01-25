import { memo, useEffect, useMemo } from "react";
import { Templates } from "@/core/api/dto/templates";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import useChat from "@/components/Prompt/Hooks/useChat";
import useChatBox from "@/hooks/useChatBox";
import useGenerateExecution from "@/components/Prompt/Hooks/useGenerateExecution";
import { IPromptInput } from "@/common/types/prompt";
import { PromptParams } from "@/core/api/dto/prompts";
import { setInputs, setParams, setparamsValues } from "@/core/store/chatSlice";
import { setSelectedExecution } from "@/core/store/executionsSlice";
import { getExecutionById } from "@/hooks/api/executions";
import { IMessage } from "../../Types/chat";
import { randomId } from "@/common/helpers";
import { executionsApi } from "@/core/api/executions";
import useVariant from "../../Hooks/useVariant";
import ChatBoxVariantA from "@/components/Prompt/VariantA/ChatBox";
import ChatBoxVariantB from "@/components/Prompt/VariantB/ChatBox";

interface Props {
  onError: (errMsg: string) => void;
  template: Templates;
  questionPrefixContent: string;
}

const CommonChat: React.FC<Props> = ({ onError, template, questionPrefixContent }) => {
  const { isVariantA } = useVariant();
  const dispatch = useAppDispatch();

  const { generatedExecution } = useAppSelector(state => state.executions);
  const { isGenerating, activeSideBarLink: isSidebarExpanded } = useAppSelector(state => state.template);

  const {
    messages,
    setMessages,
    initialMessages,
    showGenerateButton,
    showGenerate,
    validateVary,
    isValidatingAnswer,
    handleSignIn,
  } = useChat({
    questionPrefixContent,
    initialMessageTitle: template.title,
  });
  const { prepareAndRemoveDuplicateInputs } = useChatBox();
  const { generateExecutionHandler, abortConnection, disableChatInput } = useGenerateExecution({
    template,
    questionPrefixContent,
    onError,
  });

  const [_inputs, _params]: [IPromptInput[], PromptParams[], boolean] = useMemo(() => {
    if (!template) {
      return [[], [], false];
    }

    const { inputs, params, promptHasContent, paramsValues } = prepareAndRemoveDuplicateInputs(
      template.prompts,
      template.questions,
    );

    dispatch(setparamsValues(paramsValues));

    initialMessages({ questions: inputs });

    dispatch(setParams(params));
    dispatch(setInputs(inputs));

    return [inputs, params, promptHasContent];
  }, [template]);

  useEffect(() => {
    if (!isGenerating && generatedExecution?.data?.length) {
      const allPromptsCompleted = generatedExecution.data.every(execData => execData.isCompleted);

      if (allPromptsCompleted) {
        selectGeneratedExecution();
        dispatch(executionsApi.util.invalidateTags(["Executions"]));
      }
    }
  }, [isGenerating, generatedExecution]);

  const selectGeneratedExecution = async () => {
    if (generatedExecution?.id) {
      try {
        const _newExecution = await getExecutionById(generatedExecution.id);
        dispatch(setSelectedExecution(_newExecution));

        const generatedExecutionMessage: IMessage = {
          id: randomId(),
          text: "",
          type: "spark",
          createdAt: new Date(new Date().getTime() - 1000),
          fromUser: false,
          spark: _newExecution,
        };
        setMessages(prevMessages => prevMessages.concat(generatedExecutionMessage));
      } catch {
        window.location.reload();
      }
    }
  };

  return isVariantA ? (
    <ChatBoxVariantA
      template={template}
      messages={messages}
      showGenerate={showGenerate}
      generateExecutionHandler={generateExecutionHandler}
      isValidatingAnswer={isValidatingAnswer}
      abortConnection={abortConnection}
      validateVary={validateVary}
      isGenerating={isGenerating}
      disableChatInput={disableChatInput}
      inputs={_inputs}
      handleSignIn={handleSignIn}
    />
  ) : (
    <ChatBoxVariantB
      template={template}
      messages={messages}
      showGenerate={showGenerate}
      generateExecutionHandler={generateExecutionHandler}
      isSidebarExpanded={isSidebarExpanded}
      abortConnection={abortConnection}
      validateVary={validateVary}
      isValidatingAnswer={isValidatingAnswer}
      disableChatInput={disableChatInput}
      showGenerateButton={showGenerateButton}
      handleSignIn={handleSignIn}
    />
  );
};

export default memo(CommonChat);
