import { useMemo, memo, useEffect } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useAppSelector, useAppDispatch } from "@/hooks/useStore";
import { ChatInterface } from "@/components/Prompt/Common/Chat/ChatInterface";
import { ChatInput } from "@/components/Prompt/Common/Chat/ChatInput";
import { executionsApi } from "@/core/api/executions";
import { setSelectedExecution } from "@/core/store/executionsSlice";
import useChatBox from "@/hooks/useChatBox";
import useChat from "@/components/Prompt/Hooks/useChat";
import { getExecutionById } from "@/hooks/api/executions";
import { setInputs, setParams, setParamsValues } from "@/core/store/chatSlice";
import useGenerateExecution from "@/components/Prompt/Hooks/useGenerateExecution";
import type { Templates } from "@/core/api/dto/templates";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptParams } from "@/core/api/dto/prompts";
import { useStoreAnswersAndParams } from "@/hooks/useStoreAnswersAndParams";
import SigninButton from "@/components/common/buttons/SigninButton";

interface Props {
  onError: (errMsg: string) => void;
  template: Templates;
  questionPrefixContent: string;
}

const GeneratorChat: React.FC<Props> = ({ onError, template, questionPrefixContent }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(state => state.user.currentUser);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const { isGenerating, activeSideBarLink: isSidebarExpanded } = useAppSelector(state => state.template);
  const { answers, isSimulationStreaming, paramsValues } = useAppSelector(state => state.chat);

  const { prepareAndRemoveDuplicateInputs } = useChatBox();

  const { storeAnswers, storeParams } = useStoreAnswersAndParams();

  const {
    messages,
    initialMessages,
    messageAnswersForm,
    showGenerateButton,
    showGenerate,
    validateVary,
    isValidatingAnswer,
  } = useChat({
    questionPrefixContent,
    initialMessageTitle: template.title,
  });

  const { generateExecutionHandler, abortConnection, disableChatInput } = useGenerateExecution({
    template,
    messageAnswersForm,
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
      } catch {
        window.location.reload();
      }
    }
  };

  //to be moved to useChat

  const handleSignIn = () => {
    storeAnswers(answers);
    storeParams(paramsValues);
    router.push("/signin");
  };

  return (
    <Box
      width={{ md: isSidebarExpanded ? "100%" : "80%" }}
      mx={{ md: "auto" }}
      height={"100%"}
    >
      <Stack
        justifyContent={"flex-end"}
        height={"calc(100% - 20px)"}
        gap={2}
      >
        <ChatInterface
          messages={messages}
          template={template}
          showGenerate={showGenerate}
          onGenerate={generateExecutionHandler}
          onAbort={abortConnection}
        />
        {currentUser?.id ? (
          <ChatInput
            onSubmit={validateVary}
            disabled={isValidatingAnswer || disableChatInput}
            isValidating={isValidatingAnswer}
            showGenerate={showGenerateButton}
            onGenerate={generateExecutionHandler}
          />
        ) : (
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={1}
            width={{ md: "100%" }}
            p={{ md: "16px 8px 16px 16px" }}
          >
            <SigninButton onClick={handleSignIn} />
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default memo(GeneratorChat);
