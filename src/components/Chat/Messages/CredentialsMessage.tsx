import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { useAppSelector } from "@/hooks/useStore";
import Form from "@/components/Prompt/Common/Chat/Form";
import AccordionMessage from "@/components/common/AccordionMessage";
import AccordionContentAutomation from "@/components/common/AccordionMessage/AccordionDetails/AccordionContentAutomation";
import type { IMessage } from "@/components/Prompt/Types/chat";
import RunButton from "@/components/Prompt/Common/RunButton";

interface Props {
  message: IMessage;
  onExecuteWorkflow?: () => void;
}

function CredentialsMessage({ message, onExecuteWorkflow }: Props) {
  const { inputs, answers } = useAppSelector(state => state.chat);
  const currentUser = useAppSelector(state => state.user.currentUser);

  const { type, text } = message;

  const allRequiredInputsAnswered = (): boolean => {
    const requiredQuestionNames = inputs.filter(question => question.required).map(question => question.name);
    if (!requiredQuestionNames.length) {
      return true;
    }
    const answeredQuestionNamesSet = new Set(answers.map(answer => answer.inputName));
    return requiredQuestionNames.every(name => answeredQuestionNamesSet.has(name));
  };

  const allowGenerate = allRequiredInputsAnswered();
  const hasInputs = inputs.length > 0;
  return (
    <Stack spacing={1}>
      <Typography
        fontSize={16}
        lineHeight={"25.6px"}
        fontWeight={400}
        letterSpacing={"0.17px"}
        display={"flex"}
        alignItems={"center"}
        color={"onSurface"}
      >
        {text}
      </Typography>
      {!hasInputs && text !== "" ? (
        <RunButton
          title={`Run workflow`}
          onClick={() => onExecuteWorkflow?.()}
        />
      ) : (
        <AccordionMessage messageType={type}>
          <AccordionContentAutomation
            title={type === "credentials" ? "CREDENTIALS information." : "WORKFLOW information."}
            onGenerate={() => onExecuteWorkflow?.()}
            showRunButton={Boolean(allowGenerate && type === "credsForm" && currentUser?.id)}
          >
            <Stack
              mt={"-10px"}
              bgcolor={"surface.1"}
              borderRadius={"8px"}
              position={"relative"}
            >
              {(type === "credsForm" || type === "credentials") && <Form messageType={type} />}
            </Stack>
          </AccordionContentAutomation>
        </AccordionMessage>
      )}
    </Stack>
  );
}

export default CredentialsMessage;
