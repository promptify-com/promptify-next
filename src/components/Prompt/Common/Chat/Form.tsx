import Stack from "@mui/material/Stack";
import Fade from "@mui/material/Fade";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";
import FormParam from "@/components/Prompt/Common/Chat/FormParams";
import FormInput from "@/components/Prompt/Common/Chat/FormInput";
import useVariant from "../../Hooks/useVariant";

interface FormProps {
  onScrollToBottom?: () => void;
}

interface FormLayoutProps {
  variant: "a" | "b";
}

function FormFields({ variant }: FormLayoutProps) {
  const { params, inputs } = useAppSelector(state => state.chat);

  return (
    <Stack gap={variant === "b" ? 1 : 2}>
      {inputs.map((input, index) => {
        return (
          <FormInput
            key={index}
            input={input}
          />
        );
      })}

      {params?.map(param => {
        return (
          <FormParam
            key={param.parameter.id}
            param={param}
          />
        );
      })}
    </Stack>
  );
}

function Form({ onScrollToBottom }: FormProps) {
  const dispatch = useAppDispatch();
  const { isVariantB } = useVariant();

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
