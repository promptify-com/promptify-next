import { type ReactNode } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppSelector } from "@/hooks/useStore";
import RunButton from "@/components/Prompt/Common/RunButton";
import { initialState } from "@/core/store/chatSlice";

interface Props {
  title: string;
  children: ReactNode;
  onGenerate: () => void;
  showRunButton: boolean;
}

function AccordionContentPrompt({ title, children, onGenerate, showRunButton }: Props) {
  const inputs = useAppSelector(state => state.chat?.inputs ?? initialState.inputs);

  return (
    <>
      <Stack>
        <Typography
          width={{ xs: "70%", sm: "auto" }}
          borderRadius={"8px"}
          bgcolor={"primary.main"}
          p={"10px 8px 16px 16px"}
          color={"white"}
          lineHeight={"100%"}
          letterSpacing={"1px"}
          fontSize={"10px"}
          textTransform={"uppercase"}
          display={!!inputs.length ? "block" : "none"}
        >
          {title}
        </Typography>
        {children}
      </Stack>
      {showRunButton && (
        <Stack
          direction={"row"}
          justifyContent={"end"}
          mr={3}
        >
          <RunButton
            title={`Run prompts`}
            onClick={onGenerate}
          />
        </Stack>
      )}
    </>
  );
}

export default AccordionContentPrompt;
