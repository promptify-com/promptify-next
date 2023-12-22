import Stack from "@mui/material/Stack";
import Fade from "@mui/material/Fade";
import { useRouter } from "next/router";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";
import FormParam from "@/components/Prompt/Common/Chat/FormParams";
import FormInput from "@/components/Prompt/Common/Chat/FormInput";

interface FormProps {
  onScrollToBottom?: () => void;
}

interface FormLayoutProps {
  variant: "a" | "b";
}

function FormFields({ variant }: FormLayoutProps) {
  const answers = useAppSelector(state => state.chat.answers);
  const paramsValues = useAppSelector(state => state.chat.paramsValues);
  const inputs = useAppSelector(state => state.chat.inputs);
  const params = useAppSelector(state => state.chat.params);
  return (
    <Stack gap={variant === "b" ? 1 : 2}>
      {inputs.map((input, index) => {
        const value = answers.find(answer => answer.inputName === input.name)?.answer ?? "";
        return (
          <FormInput
            key={index}
            input={input}
            value={value}
          />
        );
      })}

      {params?.map(param => {
        const paramValue = paramsValues.find(paramVal => paramVal.id === param.prompt);
        return (
          <FormParam
            key={param.parameter.id}
            param={param}
            paramValue={paramValue}
          />
        );
      })}
    </Stack>
  );
}

function Form({ onScrollToBottom }: FormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const variant = router.query.variant;

  const isVariantB = variant === "b";

  return (
    <Stack>
      {isVariantB ? (
        <FormFields variant={"b"} />
      ) : (
        <Fade
          in={true}
          onTransitionEnd={() => dispatch(setIsSimulationStreaming(false))}
          addEndListener={onScrollToBottom}
        >
          <Stack>
            <FormFields variant={"a"} />
          </Stack>
        </Fade>
      )}
    </Stack>
  );
}

export default Form;
