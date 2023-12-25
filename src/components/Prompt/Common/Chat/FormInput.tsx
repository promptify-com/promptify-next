import InputLabel from "@mui/material/InputLabel";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppSelector } from "@/hooks/useStore";
import RenderInputType from "./Inputs";
import CustomTooltip from "../CustomTooltip";
import useVariant from "../../Hooks/useVariant";
import type { IPromptInput } from "@/common/types/prompt";
import { Box } from "@mui/material";

interface Props {
  input: IPromptInput;
}

function FormInput({ input }: Props) {
  const answers = useAppSelector(state => state.chat.answers);

  const { isVariantB } = useVariant();
  const { fullName, required, type, name } = input;

  const value = answers.find(answer => answer.inputName === name)?.answer ?? "";

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
      <Box>
        <InputLabel
          sx={{
            fontSize: { xs: 12, md: 15 },
            fontWeight: 500,
            color: "primary.main",
          }}
        >
          {fullName} {required && isVariantB && <span>*</span>} :
        </InputLabel>
      </Box>

      <Stack
        display={"flex"}
        alignItems={"start"}
        position={"relative"}
        flex={1}
        width={"100%"}
        maxWidth={"95%"}
      >
        <RenderInputType
          input={input}
          value={value}
        />
      </Stack>
      {isVariantB && (
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={"8px"}
        >
          {required && (
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
                {type}
              </Typography>
            }
          />
        </Stack>
      )}
    </Stack>
  );
}

export default FormInput;
