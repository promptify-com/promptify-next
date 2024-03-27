import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import ContentWrapper from "@/components/profile2/ContentWrapper";
import SectionWrapper from "@/components/profile2/SectionWrapper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

function ProfilePreferences() {
  const [inputStyle, setInputStyle] = useState("Input Form");

  return (
    <Protected>
      <Layout>
        <ContentWrapper
          title="Preferences"
          description=" Here, you can customize your experience to suit your preferences and needs"
        >
          <SectionWrapper title="App settings">
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={5}
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
              <Select
                value={inputStyle}
                onChange={e => setInputStyle(e.target.value)}
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
                {["Input Form", "Questionary"].map(option => (
                  <MenuItem
                    key={option}
                    value={option}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Select>
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
                <Stack
                  gap={1}
                  px={"8px"}
                ></Stack>
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
