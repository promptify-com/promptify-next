import InputLabel from "@mui/material/InputLabel";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppSelector } from "@/hooks/useStore";

import type { IPromptInput } from "@/common/types/prompt";
import RenderInputType from "./InputsType";
import CustomTooltip from "../CustomTooltip";

interface Props {
  input: IPromptInput;
  value: string | number | File;
  onChangeInput: (value: string | File, input: IPromptInput) => void;
}

function FormInput({ input, value, onChangeInput }: Props) {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const isFile = value instanceof File;

  return (
    <Stack
      key={input.name}
      direction={"row"}
      p={"6px"}
      alignItems={"center"}
      gap={1}
      borderBottom={"1px solid #ECECF4"}
    >
      <Radio
        size="small"
        checked={!!value}
        value="a"
        name="radio-buttons"
      />
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
          onChange={onChangeInput}
          value={value}
          isGenerating={isGenerating}
          isFile={isFile}
        />
      </Stack>
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
    </Stack>
  );
}

export default FormInput;
