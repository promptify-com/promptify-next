import { useState } from "react";

import BaseButton from "@/components/base/BaseButton";
import CodeFieldModal from "@/components/modals/CodeFieldModal";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptInputType } from "@/components/Prompt/Types";

interface CodeInputProps {
  input: IPromptInput;
  isGenerating: boolean;
  value: PromptInputType;
  onChange: (value: string | File, input: IPromptInput) => void;
  disabled?: boolean;
}

function Code({ input, isGenerating, value, onChange, disabled }: CodeInputProps) {
  const [codeFieldOpen, setCodeFieldOpen] = useState(false);

  return (
    <>
      <BaseButton
        disabled={disabled || isGenerating}
        size="small"
        onClick={() => {
          setCodeFieldOpen(true);
        }}
        color="custom"
        variant="text"
        sx={{
          border: "1px solid",
          borderRadius: "8px",
          borderColor: "secondary.main",
          color: "secondary.main",
          p: "3px 12px",
          fontSize: { xs: 12, md: 14 },
          ":hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        {value ? " Update code" : "Insert Code"}
      </BaseButton>
      {codeFieldOpen && (
        <CodeFieldModal
          open
          setOpen={setCodeFieldOpen}
          value={value as string}
          onSubmit={val => onChange(val, input)}
        />
      )}
    </>
  );
}

export default Code;
