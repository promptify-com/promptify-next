import { useState, type FC } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import { LogoApp } from "@/assets/icons/LogoApp";
import { useRouter } from "next/router";
import Image from "../design-system/Image";
import { isDesktopViewPort } from "@/common/helpers";
import SocialButtons from "./SocialMediaAuth";

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
      display="flex"
      sx={{
        height: "100vh",
        overflowY: { xs: "hidden", sm: "auto" },
        width: "100%",
        flexDirection: { xs: "column", sm: "row" },
        position: "relative",
      }}
    >
      <Grid
        sx={{
          width: { xs: "100%", sm: "70%" },
          height: { xs: "100%", sm: "auto" },
          display: { xs: "flex", sm: "none", lg: "flex" },
          justifyContent: "flex-end",
          alignItems: "flex-end",
          position: "relative",
        }}
      >
        <Grid
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: { xs: "absolute", sm: "relative" },
            top: 0,
            left: 0,
            height: "100%",
            zIndex: 0,
          }}
        >
          <Image
            style={{
              maxHeight: "100vh",
              objectFit: "cover",
              height: "100%",
              width: "100%",
            }}
            alt="Signin"
            src={require("@/assets/images/signup.webp")}
            loading={"eager"}
            priority
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "24px",
              position: "absolute",
              top: { xs: "50px", sm: "70px" },
              left: "50%",
              transform: "translateX(-50%)",
              width: { xs: "95%", sm: "50%" },
            }}
          >
            <Typography
              sx={{
                color: "var(--onPrimary, #FFF)",
                textAlign: "center",
                fontFeatureSettings: "'clig' off, 'liga' off",
                fontFamily: "Poppins",
                fontSize: { xs: "32px", md: "48px" },
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: { xs: "38.4px", md: "57.6px" },
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
                  fontWeight: "400",
                  lineHeight: "120%",
                  letterSpacing: "0.15px",
                }}
              >
                The ultimate ChatGPT and AI-driven content generation and idea inspiration platform
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      <Grid
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          position: { xs: "absolute", md: "relative" },
          bgcolor: "onPrimary",
          borderRadius: "24px 24px 0 0",
          bottom: 0,
        }}
      >
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center" },
            gap: { xs: "48px", md: "16px" },
            width: "100%",
            marginBottom: { xs: 0, sm: "80px" },
          }}
        >
          <Box
            sx={{
              marginTop: { xs: "20px", sm: "0em" },
              marginBottom: { xs: "10px", sm: "0em" },
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
        </Grid>
        <Grid
          className="button-style"
          sx={{
            height: { xs: "100%", sm: "70vh" },
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: { xs: "1em", sm: "2em" },
            marginBottom: { xs: "1em", sm: 0 },
          }}
        >
          <Grid
            sx={{
              display: "flex",
              alignItems: "center",
              width: "80%",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {desktopView && (
              <Typography
                sx={{
                  fontStyle: "normal",
                  fontWeight: 300,
                  fontSize: { xs: "24px", sm: "48px" },
                  lineHeight: { xs: "28px", sm: "52.8px" },
                  color: "var(--onSurface, #1B1B1F))",
                  textAlign: "center",
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
          </Grid>
          <SocialButtons
            preLogin={preLogin}
            isChecked={isChecked}
            setErrorCheckBox={setErrorCheckBox}
            from={from}
          />
          {from === "signup" && (
            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
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
                  lineHeight: "24px",
                  letterSpacing: "0.15px",
                  color: errorCheckBox ? "#1D2028" : "red",
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
                    lineHeight: "24px",
                    letterSpacing: "0.15px",
                    color: errorCheckBox ? "#4733ff" : "red",
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
            </Grid>
          )}
        </Grid>

        <Typography
          sx={{
            color: "var(--secondary-light, var(--secondary, #575E71))",
            fontFeatureSettings: "'clig' off, 'liga' off",
            fontFamily: "Poppins",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: "150%",
          }}
        >
          © {thisYear} Promptify.com - Promptify LLC. All rights reserved.
        </Typography>
      </Grid>
    </Box>
  );
};
