import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import ContentWrapper from "@/components/profile2/ContentWrapper";
import SectionWrapper from "@/components/profile2/SectionWrapper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { CHAT_OPTIONS, CHAT_OPTIONS_MAPPING } from "@/components/Chat/Constants";
import type { ChatOption } from "@/core/api/dto/chats";
import { DynamicThemeIcon } from "@/assets/icons/DynamicThemeIcon";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";
import type { UpdateUserPreferences } from "@/core/api/dto/user";
import { useUpdateUserPreferencesMutation } from "@/core/api/user";
import { updateUser } from "@/core/store/userSlice";
import { setToast } from "@/core/store/toastSlice";
import { useEffect, useState } from "react";

function ProfilePreferences() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const [chatOption, setChatOption] = useState<ChatOption>((currentUser?.preferences?.input_style as ChatOption) ?? "");
  const [updateUserPreferences, { isLoading: isLoadingPreferences }] = useUpdateUserPreferencesMutation();
  const handleChangeInputStyle = async (data: UpdateUserPreferences) => {
    if (!currentUser || isLoadingPreferences) return;

    try {
      const preferences = await updateUserPreferences({
        username: currentUser.username,
        data,
      }).unwrap();
      dispatch(updateUser({ ...currentUser, preferences }));
      data.input_style && setChatOption(data.input_style);
      dispatch(setToast({ message: "Preferences have been successfully updated.", severity: "success" }));
    } catch (err) {
      dispatch(setToast({ message: "Something went wrong please try again", severity: "error" }));
    }
  };

  useEffect(() => {
    setChatOption((currentUser?.preferences?.input_style as ChatOption) ?? "");
  }, [currentUser]);

  const isBlue = currentUser?.preferences?.theme === "blue";
  const inputStyle = currentUser?.preferences?.input_style?.toUpperCase();

  return (
    <Protected>
      <Layout>
        <ContentWrapper
          title="Preferences"
          description=" Here, you can customize your experience to suit your preferences and needs"
        >
          <SectionWrapper title="App settings">
            <Stack
              direction={{ md: "row" }}
              justifyContent={"space-between"}
              alignItems={{ md: "center" }}
              gap={{ xs: 1, md: 5 }}
              sx={{
                width: "calc(100% - 48px)",
                p: "16px 24px",
              }}
            >
              <Stack
                gap={1}
                flex={4}
              >
                <Typography
                  fontSize={16}
                  fontWeight={400}
                  color={"onSurface"}
                >
                  Instructions input style
                </Typography>
                <Typography
                  fontSize={14}
                  fontWeight={400}
                  color={"secondary.light"}
                >
                  How Promptify will gather instructions
                </Typography>
              </Stack>

              <Stack
                alignItems={"flex-end"}
                flexDirection={"row"}
                ml={"auto"}
              >
                {CHAT_OPTIONS_MAPPING[chatOption] ?? ""}
                <Select
                  value={inputStyle}
                  onChange={e => handleChangeInputStyle({ input_style: e.target.value.toLowerCase() as ChatOption })}
                  displayEmpty
                  MenuProps={{
                    disableScrollLock: true,
                    sx: {
                      ".MuiList-root": {
                        p: 0,
                        fontSize: 16,
                        fontWeight: 400,
                        color: "onSurface",
                      },
                      ".MuiMenuItem-root": {
                        borderTop: "1px solid #E3E3E3",
                        gap: 2,
                        fontSize: 16,
                        fontWeight: 400,
                        color: "onSurface",
                      },
                    },
                  }}
                  sx={{
                    flex: 1,
                    ".MuiSelect-select": {
                      p: 0,
                      img: { display: "none" },
                    },
                    fieldset: {
                      border: "none",
                    },
                  }}
                >
                  {CHAT_OPTIONS.map(option => (
                    <MenuItem
                      key={option.label}
                      value={option.type}
                      disabled={option.type === chatOption}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Stack>
          </SectionWrapper>
          <SectionWrapper title="Appearance">
            <Stack
              gap={3}
              sx={{
                width: "calc(100% - 48px)",
                p: "16px 24px",
              }}
            >
              <Stack
                gap={1}
                flex={4}
              >
                <Typography
                  fontSize={16}
                  fontWeight={400}
                  color={"onSurface"}
                >
                  Theme
                </Typography>
                <Typography
                  fontSize={14}
                  fontWeight={400}
                  color={"secondary.light"}
                >
                  Main theme for Promptify app
                </Typography>
              </Stack>
              <Stack
                direction={"row"}
                gap={1}
              >
                <Button
                  onClick={e => handleChangeInputStyle({ theme: "dynamic" })}
                  sx={themeBtnStyle}
                  className={!isBlue ? "active" : ""}
                >
                  <Box
                    component={"span"}
                    className="icon"
                  >
                    <DynamicThemeIcon />
                  </Box>
                  Dynamic
                </Button>
                <Button
                  onClick={e => handleChangeInputStyle({ theme: "blue" })}
                  sx={themeBtnStyle}
                  className={isBlue ? "active" : ""}
                >
                  <Box
                    component={"span"}
                    className="icon"
                  >
                    <Box
                      component={"span"}
                      sx={{
                        display: "inline-block",
                        width: 48,
                        height: 48,
                        bgcolor: "primary.main",
                        borderRadius: "50%",
                      }}
                    />
                  </Box>
                  Blue
                </Button>
              </Stack>
            </Stack>
          </SectionWrapper>
        </ContentWrapper>
      </Layout>
    </Protected>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: "Preferences",
      description: SEO_DESCRIPTION,
    },
  };
}

export default ProfilePreferences;

const themeBtnStyle = {
  flexDirection: "column",
  gap: 1,
  px: "8px",
  fontSize: 12,
  fontWeight: 500,
  color: "secondary.light",
  ".icon": {
    width: 48,
    height: 48,
    p: "8px",
    borderRadius: "50%",
    transition: "background-color .3s",
  },
  ":hover .icon": {
    bgcolor: "surfaceContainerLow",
  },
  "&.active": {
    color: "onSurface",
    ".icon": {
      bgcolor: "surfaceContainerLow",
    },
    ":hover .icon": {
      bgcolor: alpha("#147EFF", 0.3),
    },
  },
};
