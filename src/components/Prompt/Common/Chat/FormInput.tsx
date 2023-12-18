import InputLabel from "@mui/material/InputLabel";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppSelector } from "@/hooks/useStore";

import type { IPromptInput } from "@/common/types/prompt";
import RenderInputType from "./Inputs";
import CustomTooltip from "../CustomTooltip";
import { useRouter } from "next/router";

interface Props {
  input: IPromptInput;
  value: string | number | File;
  onChange: (value: string | File, input: IPromptInput) => void;
}

function FormInput({ input, value, onChange }: Props) {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const isFile = value instanceof File;
  const router = useRouter();

  const variant = router.query.variant;

  const isVariantB = variant === "b";

  return (
    <Stack
      direction={"row"}
      p={isVariantB ? "6px" : 0}
      alignItems={"center"}
      gap={1}
      borderBottom={isVariantB ? "1px solid #ECECF4" : "none"}
    >
      {isVariantB && (
        <Radio
          size="small"
          checked={!!value}
          value="a"
          name="radio-buttons"
        />
      )}

      <InputLabel
        sx={{
          fontSize: { xs: 12, md: 15 },
          fontWeight: 500,
          color: "primary.main",
        }}
      >
        {input.fullName} {input.required && <span>*</span>} :
      </InputLabel>
      <Stack
        flex={1}
        display={"flex"}
        alignItems={"start"}
      >
        <RenderInputType
          input={input}
          onChange={onChange}
          value={value}
          isGenerating={isGenerating}
          isFile={isFile}
        />
      </Stack>
      {isVariantB && (
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={"8px"}
        >
          {input.required && (
            <Typography
              sx={{
                fontSize: { xs: 12, md: 15 },
                fontWeight: 400,
                lineHeight: "100%",
                opacity: 0.3,
              }}
            >
              Required
            </Typography>
          )}
          <CustomTooltip
            title={
              <Typography
                color={"white"}
                textTransform={"capitalize"}
                fontSize={11}
              >
                {input.type}
              </Typography>
            }
          />
        </Stack>
      )}
    </Stack>
  );
}

export default FormInput;
