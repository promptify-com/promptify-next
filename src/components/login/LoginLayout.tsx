import React, { useState } from "react";
import { Box, CardMedia, Checkbox, Grid, Typography } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import CoverImage from "@/assets/images/Col.svg";
import { LogoApp } from "@/assets/icons/LogoApp";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { SocialButtons } from "./SocialButtons";
import Image from "next/image";

interface IProps {
  preLogin: () => void;
  postLogin: (data: IContinueWithSocialMediaResponse | null) => void;
  from: string;
}

export const LoginLayout: React.FC<IProps> = ({
  postLogin,
  preLogin,
  from,
}) => {
  const [isChecked, setIsChecked] = React.useState(false);
  const [errorCheckBox, setErrorCheckBox] = useState<boolean>(true);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    setErrorCheckBox(true);
  };

  return (
    <Box display="flex" sx={{ minHeight: "100vh", width: "100vw" }}>
      <Grid
        sx={{
          width: { xs: "100%", lg: "70%" },
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid
          className="button-style"
          sx={{
            height: "70vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "2em",
            // padding: { xs: '0em 2em', sm: '0em 5em' },
          }}
        >
          <Grid
            sx={{
              display: "flex",
              width: "100%",
              marginBottom: "2em",
            }}
          >
            <LogoApp width={90} />
          </Grid>
          <Grid
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              gap: "2em",
            }}
          >
            <Typography
              sx={{
                height: "56px",
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: { xs: "32px", sm: "48px" },
                lineHeight: "116.7%",
                display: "flex",
                alignItems: "center",
                color: "#1D2028",
              }}
            >
              Welcome to Promptify
            </Typography>
            <Typography
              sx={{
                height: "24px",
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: { xs: "14px", sm: "16px" },
                lineHeight: "150%",
                display: "flex",
                alignItems: "center",
                letterSpacing: "0.15px",
                color: "#1D2028",
                flex: "none",
              }}
            >
              Please, specify what type of prompts you need
            </Typography>
          </Grid>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
          >
            <SocialButtons
              preLogin={preLogin}
              postLogin={postLogin}
              isChecked={isChecked}
              setErrorCheckBox={setErrorCheckBox}
              from={from}
            />
          </GoogleOAuthProvider>

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
                color="info"
              />
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "150%",
                    letterSpacing: "0.15px",
                    color: errorCheckBox ? "#1D2028" : "red",
                  }}
                >
                  I accept
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "150%",
                    letterSpacing: "0.15px",
                    color: errorCheckBox ? "#4733ff" : "red",
                  }}
                >
                  the Terms or Conditions
                </Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>

      <Grid
        sx={{
          //   width: '30%',
          height: "100vh",
          display: { xs: "none", lg: "flex" },
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <CardMedia
          sx={{
            WebkitBackgroundSize: "contain",
            backgroundSize: "cover",
            objectFit: "contain",
            height: "100vh",
            width: "fit-content",
          }}
        >
          <Image
            src={CoverImage}
            className="MuiCardMedia-root MuiCardMedia-media MuiCardMedia-img"
            alt="cover"
            style={{
              maxHeight: "99.5%",
              maxWidth: "100%",
            }}
          />
        </CardMedia>
      </Grid>
    </Box>
  );
};
