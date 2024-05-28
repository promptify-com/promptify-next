import { useState, type FC } from "react";
import { useRouter } from "next/router";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";

import { LogoApp } from "@/assets/icons/LogoApp";
import SocialButtons from "@/components/login/SocialMediaAuth";
import backgroundImage from "@/assets/images/signup.webp";
import useBrowser from "@/hooks/useBrowser";

interface IProps {
  preLogin: (isLoading: boolean) => void;
}

const thisYear = new Date().getFullYear();

export const LoginLayout: FC<IProps> = ({ preLogin }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [errorCheckBox, setErrorCheckBox] = useState<boolean>(true);
  const router = useRouter();
  const from = router.query?.from as string;
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setErrorCheckBox(true);
  };
  const { isMobile } = useBrowser();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        position: "relative",
        height: "100svh",
      }}
    >
      <Stack
        direction={"row"}
        sx={{
          padding: "8px",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "stretch",
          flex: 3,
          background: `url(${backgroundImage.src}) lightgray 50% / cover no-repeat`,
          pt: { xs: "40px", sm: "40px", md: "48px" },
        }}
      >
        <Stack
          gap={3}
          sx={{
            width: { xs: "271", sm: "471px" },
            alignSelf: "stretch",
          }}
        >
          <Typography
            sx={{
              color: "onPrimary",
              textAlign: "center",
              fontSize: { xs: "24px", sm: "32px", md: "48px" },
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "120%",
              letterSpacing: "0.15px",
            }}
          >
            Unleash your creative potential using Promptify
          </Typography>

          {!isMobile && (
            <Typography
              sx={{
                color: "onPrimary",
                textAlign: "center",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "150%",
                letterSpacing: "0.15px",
              }}
            >
              The ultimate ChatGPT and AI-driven content generation and idea inspiration platform
            </Typography>
          )}
        </Stack>
      </Stack>

      <Stack
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 2,
          height: { md: "100svh" },
          overflowY: { md: "auto" },
          mt: { xs: "-24px", md: 0 },
          bgcolor: "onPrimary",
          borderTopRightRadius: { xs: 0, sm: "24px", md: 0 },
          borderTopLeftRadius: { xs: 0, sm: "24px", md: 0 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            padding: "24px 0px",
            justifyContent: "center",
            alignItems: "center",
            gap: "4px",
            alignSelf: "stretch",
          }}
        >
          <Box
            sx={{
              my: { xs: "32px 0", md: 0 },
            }}
          >
            <LogoApp width={!isMobile ? 57 : 37} />
          </Box>
          <Typography
            sx={{
              color: "onSurface",
              fontSize: { xs: "25px", md: "32px" },
              fontStyle: "normal",
              fontWeight: "500",
              m: { xs: "-10px 0 0 0", md: "-31px 0 0 0" },
            }}
          >
            Promptify
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            width: { xs: "90%", sm: "360px", md: "560px" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: "32px", md: "48px" },
            flex: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              padding: "0px 16px",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
              alignSelf: "stretch",
            }}
          >
            {!isMobile && (
              <Typography
                sx={{
                  fontWeight: 300,
                  fontSize: { xs: "18px", sm: "28px", m: "38px", lg: "48px" },
                  lineHeight: { xs: "28px", sm: "52.8px" },
                  color: "onSurface",
                  textAlign: "center",
                  letterSpacing: "0.17px",
                }}
              >
                Welcome to Promptify
              </Typography>
            )}
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "16px",
                letterSpacing: "0.17px",
                lineHeight: "25.6px",
                color: "onSurface",
              }}
            >
              Please, register via social network
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              padding: "0px 16px",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              width: { xs: "100%", md: "60%", lg: "70%" },
            }}
          >
            <SocialButtons
              preLogin={preLogin}
              isChecked={isChecked}
              setErrorCheckBox={setErrorCheckBox}
              from={from}
            />
          </Box>

          {from === "signup" && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                alignSelf: "stretch",
              }}
            >
              <Checkbox
                checked={isChecked}
                onChange={handleCheckboxChange}
                sx={{
                  color: "#3B4050",
                  "&.Mui-checked": {
                    color: "#0059C6",
                  },
                }}
              />
              <Typography
                sx={{
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "25.6px",
                  letterSpacing: "0.17px",
                  color: errorCheckBox ? "onSurface" : "red",
                  display: "inline",
                  cursor: "pointer",
                }}
                onClick={handleCheckboxChange}
              >
                I accept the{" "}
                <Typography
                  sx={{
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "25.6px",
                    letterSpacing: "0.17px",
                    color: errorCheckBox ? "#0059C6" : "red",
                    display: "inline",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  onClick={() => {
                    window.open("https://blog.promptify.com/post/terms-of-use", "_blank");
                  }}
                  component={"span"}
                >
                  Terms or Conditions
                </Typography>
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            width: { xs: "100%" },
            p: "48px 0",
            justifyContent: "center",
            alignItems: "center",
            gap: "24px",
            alignSelf: "stretch",
          }}
        >
          <Typography
            sx={{
              color: "secondary.light",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "150%",
              textAlign: "center",
            }}
          >
            © {thisYear}{" "}
            <a
              href="https://promptify.com/"
              target="_blank"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Promptify.com
            </a>{" "}
            - Promptify LLC. All rights reserved.
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};
