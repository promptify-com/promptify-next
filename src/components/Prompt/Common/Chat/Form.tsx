import Stack from "@mui/material/Stack";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import FormParam from "@/components/Prompt/Common/Chat/FormParams";
import FormInput from "@/components/Prompt/Common/Chat/FormInput";
import type { IPromptInput } from "@/common/types/prompt";
import Fade from "@mui/material/Fade";
import { useEffect } from "react";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";
import { useRouter } from "next/router";

interface Props {
  onChangeInput: (value: string | File, input: IPromptInput) => void;
  onScrollToBottom?: () => void;
}

// function FormLayout({}) {
//   return (
//     <Stack gap={isVariantB ? 1 : 2}>
//       {inputs.map((input, index) => {
//         const value = answers.find(answer => answer.inputName === input.name)?.answer ?? "";
//         return (
//           <FormInput
//             key={index}
//             input={input}
//             value={value}
//             onChange={onChangeInput}
//           />
//         );
//       })}

//       {params?.map(param => {
//         const paramValue = paramsValues.find(paramVal => paramVal.id === param.prompt);
//         return (
//           <FormParam
//             key={param.parameter.id}
//             param={param}
//             paramValue={paramValue}
//           />
//         );
//       })}
//     </Stack>
//   );
// }

function Form({ onChangeInput, onScrollToBottom }: Props) {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const variant = router.query.variant;

  const isVariantB = variant === "b";

  const fadeTimeout = isVariantB ? 0 : 800;

  const answers = useAppSelector(state => state.chat.answers);
  const paramsValues = useAppSelector(state => state.chat.paramsValues);
  const inputs = useAppSelector(state => state.chat.inputs);
  const params = useAppSelector(state => state.chat.params);

  return (
    <Fade
      in={true}
      unmountOnExit
      timeout={fadeTimeout}
      // onTransitionEnd={() => dispatch(setIsSimulationStreaming(false))}
      addEndListener={onScrollToBottom}
    >
      <Stack gap={isVariantB ? 1 : 2}>
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
    </Fade>
  );
}

export default Form;
