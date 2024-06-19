import { useMemo, memo, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useStore";
import { executionsApi } from "@/core/api/executions";
import { initialState as initialExecutionsState, setSelectedExecution } from "@/core/store/executionsSlice";
import useChat from "@/components/Prompt/Hooks/useChat";
import { getExecutionById } from "@/hooks/api/executions";
import { setInputs, setParams, setParamsValues } from "@/core/store/chatSlice";
import useGenerateExecution from "@/components/Prompt/Hooks/useGenerateExecution";
import type { Templates } from "@/core/api/dto/templates";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptParams } from "@/core/api/dto/prompts";
import useVariant from "@/components/Prompt/Hooks/useVariant";
import dynamic from "next/dynamic";
import PromptPlaceholder from "@/components/placeholders/PromptPlaceholder";
import { IMessage } from "@/components/Prompt/Types/chat";
import { randomId } from "@/common/helpers";
import useChatBox from "../../Hooks/useChatBox";
import { initialState as initialTemplatesState } from "@/core/store/templatesSlice";

interface Props {
  template: Templates;
  questionPrefixContent: string;
}

const ChatBoxVariantA = dynamic(() => import("@/components/Prompt/VariantA/ChatBox"), {
  loading: () => <PromptPlaceholder />,
});
const ChatBoxVariantB = dynamic(() => import("@/components/Prompt/VariantB/ChatBox"), {
  loading: () => <PromptPlaceholder />,
});

const CommonChat: React.FC<Props> = ({ template, questionPrefixContent }) => {
  const { isVariantA } = useVariant();
  const dispatch = useAppDispatch();

  const generatedExecution = useAppSelector(
    state => state.executions?.generatedExecution ?? initialExecutionsState.generatedExecution,
  );
  const { isGenerating, activeSideBarLink: isSidebarExpanded } = useAppSelector(
    state => state.templates ?? initialTemplatesState,
  );
  const {
    messages,
    initialMessages,
    messageAnswersForm,
    showGenerateButton,
    showGenerate,
    validateVary,
    isValidatingAnswer,
    setMessages,
    handleSignIn,
  } = useChat({
    questionPrefixContent,
    initialMessageTitle: template.title,
  });
  const { prepareAndRemoveDuplicateInputs } = useChatBox();
  const { generateExecutionHandler, abortConnection, disableChatInput } = useGenerateExecution({
    template,
    messageAnswersForm,
  });

  const [_inputs, _params]: [IPromptInput[], PromptParams[], boolean] = useMemo(() => {
    if (!template) {
      return [[], [], false];
    }

    const { inputs, params, promptHasContent, paramsValues } = prepareAndRemoveDuplicateInputs(
      template.prompts,
      template.questions,
    );

    dispatch(setParamsValues(paramsValues));

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
        if (isVariantA) {
          const generatedExecutionMessage: IMessage = {
            id: randomId(),
            text: "",
            type: "spark",
            createdAt: new Date(new Date().getTime() - 1000),
            fromUser: false,
            spark: _newExecution,
          };
          setMessages(messages.concat(generatedExecutionMessage));
        }
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
