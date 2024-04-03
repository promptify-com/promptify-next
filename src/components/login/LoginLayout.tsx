import { useState, type FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import { LogoApp } from "@/assets/icons/LogoApp";
import { useRouter } from "next/router";
import { isDesktopViewPort } from "@/common/helpers";
import SocialButtons from "./SocialMediaAuth";
import Stack from "@mui/material/Stack";
import backgroundImage from "@/assets/images/signup.webp";

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
  const desktopView = isDesktopViewPort();

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
        sx={{
          display: "flex",
          padding: "var(--1, 8px)",
          justifyContent: "flex-start",
          alignItems: "center",
          alignSelf: "stretch",
          flex: 3,
          background: `url(${backgroundImage.src}) lightgray 50% / cover no-repeat`,
          pt: { xs: "40px", sm: "40px", md: "48px" },
        }}
      >
        <Box
          sx={{
            width: { xs: "271", sm: "471px" },
            alignSelf: "stretch",
          }}
        >
          <Typography
            sx={{
              color: "var(--onPrimary, #FFF)",
              textAlign: "center",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontFamily: "Poppins",
              fontSize: { xs: "24px", sm: "32px", md: "48px" },
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "120%",
              letterSpacing: "0.15px",
            }}
          >
            Unleash your creative potential using Promptify
          </Typography>

          {desktopView && (
            <Typography
              sx={{
                color: "var(--onPrimary, #FFF)",
                textAlign: "center",
                fontFeatureSettings: "'clig' off, 'liga' off",
                fontFamily: "Poppins",
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
        </Box>
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
            padding: "var(--3, 24px) var(--none, 0px)",
            justifyContent: "center",
            alignItems: "center",
            gap: "var(--borderRadius, 4px)",
            alignSelf: "stretch",
          }}
        >
          <Box
            sx={{
              my: { xs: "32px 0", md: 0 },
            }}
          >
            <LogoApp width={desktopView ? 57 : 37} />
          </Box>
          <Typography
            sx={{
              color: "#1B1B1F",
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
              padding: "var(--none, 0px) var(--2, 16px)",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--3, 24px)",
              alignSelf: "stretch",
            }}
          >
            {desktopView && (
              <Typography
                sx={{
                  fontStyle: "normal",
                  fontWeight: 300,
                  fontSize: { xs: "18px", sm: "28px", m: "38px", lg: "48px" },
                  lineHeight: { xs: "28px", sm: "52.8px" },
                  color: "var(--onSurface, #1B1B1F))",
                  fontFamily: "Poppins",
                  textAlign: "center",
                  letterSpacing: "0.17px",
                }}
              >
                Welcome to Promptify
              </Typography>
            )}
            <Typography
              sx={{
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "16px",
                letterSpacing: "0.17px",
                lineHeight: "25.6px",
                color: "var(--onSurface, var(--onSurface, #1B1B1F))",
              }}
            >
              Please, register via social network
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              padding: "var(--none, 0px) var(--2, 16px)",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--2, 16px)",
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
                gap: "var(--1, 8px)",
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
                  fontFamily: "Poppins",
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
                    fontFamily: "Poppins",
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
            gap: "var(--3, 24px)",
            alignSelf: "stretch",
          }}
        >
          <Typography
            sx={{
              color: "var(--secondary-light, var(--secondary, #575E71))",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontFamily: "Poppins",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "150%",
              textAlign: "center",
            }}
          >
            © {thisYear} Promptify.com - Promptify LLC. All rights reserved.
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};
