import { useState, useMemo, memo, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppSelector, useAppDispatch } from "@/hooks/useStore";
import useToken from "@/hooks/useToken";
import { ChatInterface } from "./ChatInterface";
import { executionsApi } from "@/core/api/executions";
import { vary } from "@/common/helpers/varyValidator";
import { setGeneratedExecution, setSelectedExecution } from "@/core/store/executionsSlice";
import { getExecutionById } from "@/hooks/api/executions";
import { isDesktopViewPort, randomId } from "@/common/helpers";
import useChatBox from "@/hooks/useChatBox";
import SigninButton from "@/components/common/buttons/SigninButton";
import { setAnswers, setInputs, setParams, setParamsValues } from "@/core/store/chatSlice";
import { ChatInput } from "../../Common/Chat/ChatInput";
import useChat from "../../Hooks/useChat";
import useGenerateExecution from "../../Hooks/useGenerateExecution";
import type { PromptParams, ResOverrides } from "@/core/api/dto/prompts";
import type { IPromptInput, AnsweredInputType } from "@/common/types/prompt";
import type { PromptInputType } from "../../Types";
import type { IAnswer, IMessage, VaryValidatorResponse } from "@/components/Prompt/Types/chat";
import type { Templates } from "@/core/api/dto/templates";
import { useStoreAnswersAndParams } from "@/hooks/useStoreAnswersAndParams";
import { useRouter } from "next/router";

interface Props {
  onError: (errMsg: string) => void;
  template: Templates;
  questionPrefixContent: string;
}

const ChatBox: React.FC<Props> = ({ onError, template, questionPrefixContent }) => {
  const token = useToken();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const isDesktopView = isDesktopViewPort();
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const { generatedExecution } = useAppSelector(state => state.executions);
  const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);

  const { answers, paramsValues, isSimulationStreaming } = useAppSelector(state => state.chat);

  const { prepareAndRemoveDuplicateInputs } = useChatBox();

  const { messages, setMessages, initialMessages, messageAnswersForm, allRequiredInputsAnswered, showGenerateButton } =
    useChat({
      questionPrefixContent,
      template,
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

    const { inputs, params, paramsValues } = prepareAndRemoveDuplicateInputs(template.prompts, template.questions);

    dispatch(setParamsValues(paramsValues));

    initialMessages({ questions: inputs });

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

  const validateVary = async (variation: string) => {
    dispatch(setSelectedExecution(null));
    if (variation) {
      const userMessage: IMessage = {
        id: randomId(),
        text: variation,
        type: "text",
        createdAt: new Date(new Date().getTime() - 1000),
        fromUser: true,
      };
      setMessages(prevMessages => prevMessages.concat(userMessage));

      setIsValidatingAnswer(true);

      const questionAnswerMap: Record<string, PromptInputType> = {};
      _inputs.forEach(input => {
        const matchingAnswer = answers.find(answer => answer.inputName === input.name);
        questionAnswerMap[input.name] = matchingAnswer?.answer || "";
      });

      const payload = {
        prompt: variation,
        variables: questionAnswerMap,
      };

      let varyResponse: VaryValidatorResponse | string;
      try {
        varyResponse = await vary({ token, payload });
      } catch (err) {
        varyResponse = "error";
      }

      if (typeof varyResponse === "string") {
        setIsValidatingAnswer(false);
        messageAnswersForm("Oops! I couldn't get your reponse, Please try again.");
        return;
      }

      const answeredInputs: AnsweredInputType[] = [];
      const validatedAnswers = varyResponse;
      const newAnswers: IAnswer[] = _inputs
        .map(input => {
          const { name: inputName, type, required, question, prompt } = input;
          const answer = validatedAnswers[inputName];
          const promptId = prompt!;
          const toNumber = type === "number" && typeof answer === "string";
          const value = toNumber ? Number(answer.toString().replace(/[^\d]+/g, "")) : answer;

          if (answer) {
            answeredInputs.push({
              promptId,
              inputName,
              value,
              modifiedFrom: "chat",
            });
          }
          return {
            inputName,
            required,
            question: question || "",
            prompt: promptId,
            answer: value,
          };
        })
        .filter(answer => answer.answer);
      dispatch(setAnswers(newAnswers));
      setIsValidatingAnswer(false);

      const isReady = allRequiredInputsAnswered() ? " We are ready to create a new document." : "";
      messageAnswersForm(`Ok!${isReady} I have prepared the incoming parameters, please check!`);
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
