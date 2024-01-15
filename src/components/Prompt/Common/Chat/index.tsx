import { useState, useMemo, memo, useEffect } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { LogoApp } from "@/assets/icons/LogoApp";
import { useAppSelector, useAppDispatch } from "@/hooks/useStore";
import useToken from "@/hooks/useToken";
import { ChatInterface } from "./ChatInterface";
import { ChatInput } from "./ChatInput";
import { executionsApi } from "@/core/api/executions";
import { vary } from "@/common/helpers/varyValidator";
import { setGeneratedExecution, setSelectedExecution } from "@/core/store/executionsSlice";
import useChatBox from "@/hooks/useChatBox";
import useChat from "@/components/Prompt/Hooks/useChat";
import { randomId } from "@/common/helpers";
import { getExecutionById } from "@/hooks/api/executions";
import { setAnswers, setInputs, setParams, setParamsValues } from "@/core/store/chatSlice";
import useGenerateExecution from "../../Hooks/useGenerateExecution";
import type { Templates } from "@/core/api/dto/templates";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptParams, ResOverrides } from "@/core/api/dto/prompts";
import type { IAnswer, IMessage, VaryValidatorResponse } from "@/components/Prompt/Types/chat";
import type { PromptInputType } from "@/components/Prompt/Types";
import { useStoreAnswersAndParams } from "@/hooks/useStoreAnswersAndParams";

interface Props {
  onError: (errMsg: string) => void;
  template: Templates;
  questionPrefixContent: string;
}

const GeneratorChat: React.FC<Props> = ({ onError, template, questionPrefixContent }) => {
  const token = useToken();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(state => state.user.currentUser);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const { isGenerating, activeSideBarLink: isSidebarExpanded } = useAppSelector(state => state.template);
  const { answers, isSimulationStreaming, paramsValues } = useAppSelector(state => state.chat);

  const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);

  const { prepareAndRemoveDuplicateInputs } = useChatBox();

  const { storeAnswers, storeParams } = useStoreAnswersAndParams();

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

  const showGenerate =
    !isSimulationStreaming && (showGenerateButton || Boolean(!_inputs.length || !_inputs[0]?.required));

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

  const validateVary = async (variation: string) => {
    dispatch(setSelectedExecution(null));
    dispatch(setGeneratedExecution(null));
    if (variation) {
      const userMessage: IMessage = {
        id: randomId(),
        text: variation,
        type: "text",
        createdAt: new Date(new Date().getTime() - 1000),
        fromUser: true,
      };

      setMessages(prevMessages =>
        prevMessages.filter(msg => msg.type !== "form" && msg.type !== "spark").concat(userMessage),
      );

      setIsValidatingAnswer(true);

      const questionAnswerMap: Record<string, PromptInputType> = {};
      _inputs.forEach(input => {
        const matchingAnswer = answers.find(answer => answer.inputName === input.name);
        questionAnswerMap[input.name] = matchingAnswer?.answer ?? "";
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

      const validatedAnswers = varyResponse;

      const newAnswers: IAnswer[] = _inputs
        .map(input => {
          const { name: inputName, required, question, prompt } = input;
          const answer = validatedAnswers[input.name];
          const promptId = prompt!;

          return {
            inputName,
            required,
            question: question ?? "",
            prompt: promptId,
            answer,
          };
        })
        .filter(answer => answer.answer);
      dispatch(setAnswers(newAnswers));
      setIsValidatingAnswer(false);

      const isReady = allRequiredInputsAnswered() ? " Let’s imagine something like this! Prepared request for you" : "";
      messageAnswersForm(`Ok!${isReady}, please check input information and we are ready to start!`);
    }
  };

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
            <Button
              onClick={handleSignIn}
              variant={"contained"}
              startIcon={
                <LogoApp
                  width={18}
                  color="white"
                />
              }
              sx={{
                flex: 1,
                p: "10px 25px",
                fontWeight: 500,
                borderColor: "primary.main",
                borderRadius: "999px",
                bgcolor: "primary.main",
                color: "onPrimary",
                whiteSpace: "pre-line",
                ":hover": {
                  bgcolor: "surface.1",
                  color: "primary.main",
                },
              }}
            >
              <Typography
                ml={2}
                color={"inherit"}
              >
                Sign in or Create an account
              </Typography>
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default memo(GeneratorChat);
