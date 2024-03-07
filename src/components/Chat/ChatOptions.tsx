import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import type { ChatOption } from "@/components/Prompt/Types/chat";
import { useAppDispatch } from "@/hooks/useStore";
import { setSelectedChatOption } from "@/core/store/chatSlice";
import Image from "../design-system/Image";

interface Option {
  imagePath: string;
  label: string;
  hint: string;
  type: ChatOption;
}

function ChatOptions() {
  const dispatch = useAppDispatch();
  const options: Option[] = [
    {
      imagePath: "@/pages/chats/images/QA.png",
      label: "Complete questionary",
      hint: "Easy for new users",
      type: "QA",
    },

    {
      imagePath: "@/pages/chats/images/fill_prompt.png",
      label: "Fill prompt instructions",
      hint: "Better for advanced users",
      type: "FORM",
    },
  ];
  return (
    <Box
      sx={{
        height: "calc(100vh - 140px)",
      }}
    >
      <Stack
        direction={"column"}
        gap={1}
        sx={{
          justifyContent: "flex-end",
          minHeight: "100%",
        }}
      >
        <Box>
          <Typography
            fontSize={24}
            fontWeight={400}
            letterSpacing={0.17}
            lineHeight={"38.4px"}
          >
            Before we go forward
          </Typography>

          <Typography
            fontSize={16}
            fontWeight={400}
            letterSpacing={0.17}
            lineHeight={"25.6px"}
          >
            We need to decide how you will interact with prompt instructions, please select one option below:
          </Typography>
        </Box>
        <Stack
          direction={"row"}
          justifyContent={"center"}
          gap={3}
          py={2}
        >
          {options.map((option, index) => {
            index++;
            return (
              <Box
                key={index}
                width={"50%"}
                borderRadius={"24px"}
                border={"1px solid"}
                borderColor={"surfaceContainerHighest"}
                p={2}
                display={"flex"}
                flexDirection={"column"}
                gap={2}
                justifyContent={"space-between"}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
                onClick={() => dispatch(setSelectedChatOption(option.type))}
              >
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "24px",
                    height: "300px",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={
                      option.type === "QA"
                        ? require("@/pages/chats/images/QA.png")
                        : require("@/pages/chats/images/fill_prompt.png")
                    }
                    alt={option.label}
                    priority={true}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Box textAlign={"center"}>
                  <Typography
                    fontSize={18}
                    fontWeight={400}
                    lineHeight={"28.6px"}
                    letterSpacing={0.17}
                  >
                    {`${index}. ${option.label}`}
                  </Typography>
                  <Typography
                    mt={1}
                    fontSize={16}
                    fontWeight={400}
                    lineHeight={"16.8px"}
                    letterSpacing={0.17}
                    color={"text.secondary"}
                  >
                    {option.hint}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>

        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Don’t ask me again."
          sx={{
            fontSize: "50px",
          }}
        />
      </Stack>
    </Box>
  );
}

export default ChatOptions;
