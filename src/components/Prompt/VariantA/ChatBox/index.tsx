import { useRouter } from "next/router";
import { useMemo, memo, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppSelector, useAppDispatch } from "@/hooks/useStore";
import { ChatInterface } from "./ChatInterface";
import { executionsApi } from "@/core/api/executions";
import { setGeneratedExecution, setSelectedExecution } from "@/core/store/executionsSlice";
import { getExecutionById } from "@/hooks/api/executions";
import { isDesktopViewPort, randomId } from "@/common/helpers";
import useChatBox from "@/hooks/useChatBox";
import SigninButton from "@/components/common/buttons/SigninButton";
import { setInputs, setParams, setparamsValues } from "@/core/store/chatSlice";
import { ChatInput } from "../../Common/Chat/ChatInput";
import useChat from "../../Hooks/useChat";
import useGenerateExecution from "../../Hooks/useGenerateExecution";
import type { PromptParams, ResOverrides } from "@/core/api/dto/prompts";
import type { IPromptInput } from "@/common/types/prompt";
import type { IMessage } from "@/components/Prompt/Types/chat";
import type { Templates } from "@/core/api/dto/templates";
import { useStoreAnswersAndParams } from "@/hooks/useStoreAnswersAndParams";

interface Props {
  onError: (errMsg: string) => void;
  template: Templates;
  questionPrefixContent: string;
}

const ChatBox: React.FC<Props> = ({ onError, template, questionPrefixContent }) => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const isDesktopView = isDesktopViewPort();

  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const { generatedExecution } = useAppSelector(state => state.executions);

  const { answers, paramsValues, isSimulationStreaming } = useAppSelector(state => state.chat);

  const { prepareAndRemoveDuplicateInputs } = useChatBox();

  const { messages, setMessages, initialMessages, validateVary, isValidatingAnswer, showGenerateButton } = useChat({
    questionPrefixContent,
    initialMessageTitle: template.title,
  });

  const { generateExecutionHandler, abortConnection, disableChatInput } = useGenerateExecution({
    template,
    questionPrefixContent,
    onError,
  });
  const { storeAnswers, storeParams } = useStoreAnswersAndParams();

  const [_inputs, _params]: [IPromptInput[], PromptParams[]] = useMemo(() => {
    if (!template) {
      return [[], []];
    }

    const { inputs, params } = prepareAndRemoveDuplicateInputs(template.prompts, template.questions);

    initialMessages({ questions: inputs });

    const valuesMap = new Map<number, ResOverrides>();
    params
      .filter(param => param.is_visible)
      .forEach(_param => {
        const paramId = _param.parameter.id;
        valuesMap.set(_param.prompt, {
          id: _param.prompt,
          contextual_overrides: (valuesMap.get(_param.prompt)?.contextual_overrides || []).concat({
            parameter: paramId,
            score: _param.score,
          }),
        });
      });

    dispatch(setparamsValues(Array.from(valuesMap.values())));
    dispatch(setParams(params));
    dispatch(setInputs(inputs));

    return [inputs, params];
  }, [template]);

  useEffect(() => {
    if (!isGenerating && generatedExecution?.data?.length) {
      const allPromptsCompleted = generatedExecution.data.every(execData => execData.isCompleted);

      if (allPromptsCompleted) {
        selectGeneratedExecution();
        dispatch(setGeneratedExecution(null));
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

  const showGenerate =
    !isSimulationStreaming &&
    ((showGenerateButton && messages[messages.length - 1]?.type !== "spark") ||
      Boolean(!_inputs.length || !_inputs[0]?.required));

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      bgcolor={"surface.3"}
    >
      {isDesktopView && (
        <Stack
          direction={"row"}
          alignItems={"center"}
          sx={{
            bgcolor: "surface.1",
            p: "24px 8px 24px 28px",
          }}
        >
          <Typography
            fontSize={12}
            fontWeight={500}
            letterSpacing={2}
            textTransform={"uppercase"}
          >
            Chat With Promptify
          </Typography>
        </Stack>
      )}
      <Stack
        justifyContent={"flex-end"}
        gap={2}
        height={{ xs: "100%", md: "calc(100% - 66px)" }}
        bgcolor={"surface.1"}
      >
        <ChatInterface
          template={template}
          messages={messages}
          showGenerate={showGenerate}
          onGenerate={generateExecutionHandler}
          isValidating={isValidatingAnswer}
          abortGenerating={abortConnection}
        />
        {currentUser?.id ? (
          <ChatInput
            onSubmit={validateVary}
            disabled={isValidatingAnswer || isGenerating || disableChatInput || _inputs.length === 0}
            showGenerate={showGenerate}
            onGenerate={generateExecutionHandler}
            isValidating={isValidatingAnswer}
          />
        ) : (
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={1}
            p={"16px 8px 16px 16px"}
          >
            <SigninButton
              onClick={() => {
                storeAnswers(answers);
                storeParams(paramsValues);
                router.push("/signin");
              }}
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default memo(ChatBox);
