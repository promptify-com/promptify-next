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
      }}
    >
      <Grid
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid
          className="button-style"
          sx={{
            height: { xs: "100%", sm: "70vh" },
            width: { xs: "100%", md: "50%" },
            display: "flex",
            justifyContent: "center",
            alignItems: { xs: "center", sm: "flex-start" },
            flexDirection: "column",
            gap: { xs: "1em", sm: "2em" },
            marginBottom: { xs: "1em", sm: 0 },
          }}
        >
          <Grid
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "center", sm: "flex-start" },
              gap: "16px",
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
              <LogoApp width={54} />
            </Box>
            <Typography
              sx={{
                display: { xs: "none", sm: "block" },
                color: "var(--on-surface, #1B1B1E)",
                textAlign: "center",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "25px",
                letterSpacing: "0.17px",
              }}
            >
              Promptify
            </Typography>
            <Typography
              sx={{ fontSize: 10 }}
              mt={0.5}
              fontWeight={"bold"}
            >
              beta
            </Typography>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              alignItems: { xs: "center", sm: "flex-start" },

              width: "100%",
              flexDirection: "column",
              gap: "1em",
            }}
          >
            <Typography
              sx={{
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: { xs: "24px", sm: "32px" },
                lineHeight: { xs: "28px", sm: "37px" },
                color: "#1D2028",
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              Welcome to Promptify
            </Typography>
            <Typography
              sx={{
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0.15px",
                color: "#1D2028",
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
                    color: "#3B4050",
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
      </Grid>

      <Grid
        sx={{
          width: { xs: "100%", sm: "50%" },
          display: { xs: "flex", sm: "none", lg: "flex" },
          justifyContent: "flex-end",
          alignItems: "flex-end",
          position: "relative",
        }}
      >
        <Grid
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              boxSizing: "border-box",
              borderRadius: "26px",
              position: "absolute",
              top: desktopView ? "5px" : "0px",
              maxHeight: "99svh",
              left: "50%",
              transform: "translateX(-50%)",
              objectFit: desktopView ? "cover" : "contain",
              height: "auto",
              width: desktopView ? "90%" : "100%",
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
              gap: "34px",
              position: "absolute",
              top: { xs: "50px", sm: "70px" },
              left: "50%",
              transform: "translateX(-50%)",
              width: { xs: "80%", sm: "70%" },
            }}
          >
            <Box
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              <LogoApp
                width={53}
                color={"#fff"}
              />
            </Box>

            <Typography
              sx={{
                color: "var(--on-primary, #FFF)",
                textAlign: "center",
                fontSize: { xs: "14px", sm: "18px" },
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "27px",
                letterSpacing: "0.15px",
              }}
            >
              Unleash your creative potential using Promptify, the ultimate ChatGPT and AI-driven content generation and
              idea inspiration platform
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
