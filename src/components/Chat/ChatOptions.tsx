import { useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import Image from "@/components/design-system/Image";
import { CHAT_OPTIONS } from "./Constants";
import { useUpdateUserPreferencesMutation } from "@/core/api/user";
import { UserPreferences } from "@/core/api/dto/user";
import { setToast } from "@/core/store/toastSlice";
import { setSelectedChatOption } from "@/core/store/chatSlice";

type ChatOption = (typeof CHAT_OPTIONS)[number];

function ChatOptions() {
  const dispatch = useAppDispatch();
  const [isChecked, setIsChecked] = useState(false);

  const currentUser = useAppSelector(state => state.user.currentUser);

  const [updateUserPreferences, { isLoading: isLoadingPreferences }] = useUpdateUserPreferencesMutation();

  const handleOptionClick = async (option: ChatOption) => {
    if (!currentUser || isLoadingPreferences) return;
    dispatch(setSelectedChatOption(option.type));

    if (isChecked) {
      const data = { input_style: option.type };

      try {
        await updateUserPreferences({
          username: currentUser.username,
          data,
        }).unwrap();

        setToast({
          message: "Preferences updated successfully.",
          severity: "success",
          duration: 4000,
          position: { vertical: "bottom", horizontal: "left" },
        });
      } catch (error) {
        setToast({
          message: "Failed to update preferences. Please try again.",
          severity: "error",
          duration: 4000,
          position: { vertical: "bottom", horizontal: "left" },
        });

        return;
      }
    }
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 140px)",
      }}
      p={{ xs: "8px", md: 0 }}
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
          direction={{ xs: "column", md: "row" }}
          justifyContent={"center"}
          alignItems={"center"}
          gap={3}
          py={2}
        >
          {CHAT_OPTIONS.map((option, index) => {
            index++;
            return (
              <Box
                key={index}
                width={"100%"}
                borderRadius={"24px"}
                border={"1px solid"}
                borderColor={"surfaceContainerHighest"}
                p={{ xs: 1, md: 2 }}
                display={"flex"}
                flexDirection={{ xs: "row", md: "column" }}
                gap={2}
                justifyContent={{ md: "space-between" }}
                alignItems={"center"}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
                onClick={() => handleOptionClick(option)}
              >
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "24px",
                    height: { xs: "120px", md: "300px" },
                    width: { xs: "120px", md: "100%" },
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={
                      option.type === "qa"
                        ? require("@/pages/chat/images/QA.png")
                        : require("@/pages/chat/images/fill_prompt.png")
                    }
                    alt={option.label}
                    priority={true}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Box textAlign={{ md: "center" }}>
                  <Typography
                    fontSize={{ xs: 15, md: 18 }}
                    fontWeight={400}
                    lineHeight={"28.6px"}
                    letterSpacing={0.17}
                  >
                    {`${index}. ${option.label}`}
                  </Typography>
                  <Typography
                    mt={1}
                    fontSize={{ xs: 14, md: 16 }}
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
          control={
            <Checkbox
              checked={isChecked}
              onChange={e => setIsChecked(e.target.checked)}
            />
          }
          label={<LabelText />}
          sx={{
            fontSize: "50px",
          }}
        />
      </Stack>
    </Box>
  );
}

function LabelText() {
  return (
    <Box flex={1}>
      <Typography
        component="span"
        sx={{
          color: "var(--onSurface, var(--onSurface, #1B1B1F))",
          fontFeatureSettings: "'clig' off, 'liga' off",
          fontFamily: "Poppins",
          fontSize: { sm: "12px", md: "16px" },
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "160%",
          letterSpacing: "0.17px",
        }}
      >
        Don’t ask me again.
      </Typography>
      {"  "}
      <Typography
        component="span"
        sx={{
          color: "var(--secondary-light, var(--secondary, #575E71))",
          fontFeatureSettings: "'clig' off, 'liga' off",
          fontFamily: "Poppins",
          fontSize: { sm: "12px", md: "16px" },
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "160%",
          letterSpacing: "0.17px",
        }}
      >
        You always can change your choice in settings.
      </Typography>
    </Box>
  );
}
export default ChatOptions;
