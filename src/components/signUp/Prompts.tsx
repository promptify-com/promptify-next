import React from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Button, CardMedia, Grid, Typography } from "@mui/material";
import { ReactElement, useCallback, useState } from "react";
import Images from "../../assets";
import { LogoApp } from "../../assets/icons/LogoApp";
import { IInterest, OnboardingPage } from "../../common/types";
import { useInterests, useUpdateInterests } from "../../hooks/api/interests";
import PromptsCard from "./PromptsCard";
import { promptCards } from "@/common/constants/signup";
import Link from "next/link";
import { SigninImage } from "@/assets/icons/SigninImage";

const Prompts = ({ setStep }: OnboardingPage) => {
  const [checkedPrompts, setCheckedPrompts] = useState<number[]>([]);
  const [interests] = useInterests();

  const [updateInterests] = useUpdateInterests();

  const handleContinue = async () => {
    await updateInterests(checkedPrompts);
    setStep(2);
  };

  // TODO: temporary hardcoded icons
  const getIconByName = useCallback((name: string): ReactElement => {
    return (
      promptCards.find((card) => card.name === name)?.icon || (
        <ErrorOutlineIcon />
      )
    );
  }, []);

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
          width: { xs: "100%", lg: "50%" },
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
            width: "100%",
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
                marginTop: { xs: "40px", sm: "0em" },
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
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0.15px",
                color: "#1D2028",
              }}
            >
              Please, answer six simple questions specify your contex. Choose
              your favorite animal:
            </Typography>
          </Grid>

          <Box
            display="flex"
            flexWrap="wrap"
            mt="1rem"
            justifyContent={{ xs: "center", sm: "flex-start" }}
            rowGap="0.5rem"
            columnGap="0.5rem"
          >
            <Grid container rowGap={{ xs: 1, sm: 2 }}>
              {interests.map(({ id, name }: IInterest) => {
                return (
                  <Grid item xs={12} sm={4} key={id}>
                    <PromptsCard
                      name={name}
                      icon={getIconByName(name)}
                      id={id}
                      checkedPrompts={checkedPrompts}
                      setCheckedPrompts={setCheckedPrompts}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          <Button
            // disabled={!allowedToPass}
            onClick={handleContinue}
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
            Continue
          </Button>
        </Grid>
      </Grid>

      <Grid
        sx={{
          width: { xs: "100%", sm: "50%" },
          display: { xs: "flex", sm: "none", lg: "flex" },
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

export default Prompts;
