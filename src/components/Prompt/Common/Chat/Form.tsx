import Stack from "@mui/material/Stack";
import Fade from "@mui/material/Fade";
import { useRouter } from "next/router";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";
import FormParam from "@/components/Prompt/Common/Chat/FormParams";
import FormInput from "@/components/Prompt/Common/Chat/FormInput";
import type { IPromptInput } from "@/common/types/prompt";

interface FormProps {
  onChangeInput: (value: string | File, input: IPromptInput) => void;
  onScrollToBottom?: () => void;
}

interface FormLayoutProps {
  variant: "a" | "b";
  onChangeInput: (value: string | File, input: IPromptInput) => void;
}

function FormFields({ variant, onChangeInput }: FormLayoutProps) {
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
            onChange={onChangeInput}
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

function Form({ onChangeInput, onScrollToBottom }: FormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const variant = router.query.variant;

  const isVariantB = variant === "b";

  const fadeTimeout = 800;

  return (
    <Stack>
      {isVariantB ? (
        <FormFields
          variant={"b"}
          onChangeInput={onChangeInput}
        />
      ) : (
        <Fade
          in={true}
          timeout={fadeTimeout}
          onTransitionEnd={() => dispatch(setIsSimulationStreaming(false))}
          addEndListener={onScrollToBottom}
        >
          <Stack>
            <FormFields
              variant={"a"}
              onChangeInput={onChangeInput}
            />
          </Stack>
        </Fade>
      )}
    </Stack>
  );
}

export default Form;
