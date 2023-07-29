import React from "react";
import {
  Box,
  Button,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import Images from "../../assets";
import { LogoApp } from "../../assets/icons/LogoApp";
import { useUpdateUser } from "../../hooks/api/user";
import { useRouter } from "next/router";
import Link from "next/link";
import { SigninImage } from "@/assets/icons/SigninImage";

const Finish = () => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateUser, error, isLoading] = useUpdateUser();

  const handleFinish = async () => {
    // await updateUser(values)
    router.push("/profile/edit");
  };

  return (
    <Box
      display="flex"
      sx={{
        width: "100vw",
        minHeight: "100vh",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{
          width: { xs: "100%", lg: "50%" },
          height: "100vh",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: { xs: "70%", lg: "70%" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Link href="/">
            <Grid
              sx={{
                display: "flex",
              }}
            >
              <LogoApp />
            </Grid>
          </Link>

          <Typography
            sx={{
              mt: { xs: "2rem", md: "2rem", lg: "3rem", xl: "5rem" },
              fontWeight: 500,
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontSize: "48px",
              lineHeight: "116.7%",
              display: "flex",
              alignItems: "center",
              color: "#1D2028",
            }}
          >
            Good job!
          </Typography>
          <Typography
            sx={{
              mt: "0.5rem",
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "150%",
              display: "flex",
              alignItems: "center",
              letterSpacing: "0.15px",
              color: "#1D2028",
            }}
          >
            Please, set up your profile to finish
          </Typography>

          {/* <FinishCard formik={formik}/> */}

          <Button
            disabled={isLoading}
            onClick={handleFinish}
            sx={{
              bgcolor: "#D6D6D6",
              color: "common.black",
              mt: "2rem",
              paddingLeft: "2rem",
              paddingRight: "2rem",
              textTransform: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "8px 22px",
              width: "100%",
              height: "42px",
              background: "rgba(29, 32, 40, 0.12)",
              borderRadius: "100px",
            }}
          >
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Typography color="#FFFFFF">Finish</Typography>
            )}
          </Button>
        </Box>
      </Box>
      <Grid
        sx={{
          width: "50%",
          height: "100vh",
          display: { xs: "none", lg: "flex" },
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <CardMedia
          sx={{
            padding: { xs: "0px", sm: "24px" },
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
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
              <LogoApp width={53} color={"#fff"} />
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
              Unleash your creative potential using Promptify, the ultimate
              ChatGPT and AI-driven content generation and idea inspiration
              platform
            </Typography>
          </Box>

          <SigninImage style={{ borderRadius: "25px" }} />
        </CardMedia>
      </Grid>
    </Box>
  );
};

export default Finish;
