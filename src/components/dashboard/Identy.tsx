import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { IdentyImg } from "@/assets/icons/identy";
import { IdentyImgIverse } from "@/assets/icons/identyInve";
import { IOption, IQuestion } from "@/common/types";
import { useQuestions } from "@/hooks/api/questions";
import { useUserAnswers } from "@/hooks/api/user";
import useUser from "@/hooks/useUser";
import { IdentityItem } from "./IdentityItem";

export const Identy = () => {
  const user = useUser();

  const [questions] = useQuestions();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [qa, error, isLoading] = useUserAnswers();

  const getUserAnswer = (question: IQuestion): IOption | null => {
    const option = qa.find(
      (userAnswer) => userAnswer?.question?.id === question.id
    )?.option;
    return option || null;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [open, setOpen] = React.useState(false);

  const prevOpen = React.useRef(open);
  const anchorRef = React.useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (prevOpen.current && !open) {
      anchorRef.current?.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <section
      id="identy"
      style={{ scrollMarginTop: "100px", marginTop: "8rem" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "1em",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: { xs: "center", sm: "flex-start" },
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "24px",
                lineHeight: "133.4%",
                display: "flex",
                alignItems: "center",
                textAlign: "center",
                color: "#1B1B1E",
              }}
            >
              Identity Setup
            </Typography>
            <Typography
              mt="1rem"
              width={{ xs: "100%", sm: "100%" }}
              sx={{
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "143%",
                display: "flex",
                alignItems: "center",
                textAlign: { xs: "center", sm: "start" },
                letterSpacing: "0.17px",
                color: "#1B1B1E",
              }}
            >
              Identity for Personlized AI at Promptify, blah balh blah, short
              description in 3 rows to fill in the information, and
              personalization will improve the data output by 34 percent
            </Typography>
            <Typography
              mt="1rem"
              sx={{
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "143%",
                display: "flex",
                alignItems: "center",
                textAlign: { xs: "center", sm: "start" },
                letterSpacing: "0.17px",
                color: "#375CA9",
              }}
            >
              Learn about Personalized AI
            </Typography>
          </Box>
          <Box display={{ xs: "flex", sm: "flex" }}>
            {/* <img src={UnicornLeft} alt={'Unicorn'} loading="lazy" /> */}
            <IdentyImg />
          </Box>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", sm: "100%" },
          }}
        >
          <Box
            border="1px solid rgba(236, 236, 244, 1)"
            borderRadius={{ xs: "10px", sm: "15px" }}
            mt="2rem"
          >
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              padding="20px"
              alignItems="center"
              borderBottom=" 1px solid rgba(236, 236, 244, 1)"
              borderRadius={{ xs: "10px", sm: "15px" }}
            >
              <Box>
                {/* <img src={UnicornRight} alt={'Unicorn'} loading="lazy" /> */}
                <IdentyImgIverse />
              </Box>
              <Box
                ml={{ xs: "0px", sm: "25px" }}
                sx={{
                  marginLeft: "0px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "center", sm: "flex-start" },
                  justifyContent: "center",
                  gap: "1em",
                  marginTop: "2em",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontStyle: "normal",
                    fontWeight: { xs: 400, sm: 500 },
                    fontSize: "16px",
                    lineHeight: "150%",
                    display: "flex",
                    alignItems: "center",
                    textAlign: { xs: "center", sm: "start" },
                    letterSpacing: "0.15px",
                    color: "#1B1B1E",
                  }}
                >
                  Your current Identity:
                </Typography>
                <Typography
                  fontWeight={500}
                  fontSize="2rem"
                  textAlign={{ xs: "center", sm: "start" }}
                  sx={{
                    fontFamily: "Poppins",
                    fontStyle: "normal",
                    fontWeight: 500,
                    fontSize: "34px",
                    lineHeight: "123.5%",
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    letterSpacing: "0.25px",
                    color: "#1B1B1E",
                  }}
                >
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Typography
                  fontWeight={500}
                  fontSize="0.8rem"
                  mt="0.4rem"
                  textAlign={{ xs: "center", sm: "start" }}
                  sx={{
                    fontFamily: "Poppins",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "143%",
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    letterSpacing: "0.17px",
                    color: "#1B1B1E",
                  }}
                >
                  Generated friendly text about user identity
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "0px 16px",
                gap: "8px",
              }}
            >
              {questions.map((question, index) => {
                return (
                  <IdentityItem
                    length={questions.length}
                    question={question}
                    defaultOption={getUserAnswer(question)}
                    index={index}
                    key={index}
                  />
                );
              })}
            </Box>

            <Box
              // height={{ xs: '180px', sm: '75px' }}
              // borderTop="1px solid #BCBCBC"
              // borderRadius={{ xs: '0px', sm: '15px' }}
              // display="flex"
              // flexDirection={{ xs: 'column', sm: 'row' }}
              // justifyContent="space-between"
              // alignItems="center"
              // color="#0F6FFF"
              height={{ xs: "180px", sm: "75px" }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "80px",
                background: "rgba(48, 48, 51, 1)",
                borderRadius: "8px",
                padding: { xs: "1em", sm: "0em 1em" },
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: "1em", sm: "0em" },
              }}
              // mt={{ xs: '1rem', sm: '2rem' }}
            >
              <Box
                display="flex"
                ml="2rem"
                sx={{ cursor: "pointer" }}
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "center", sm: "center" }}
                justifyContent={{ xs: "center", sm: "space-between" }}
                height="100%"
              >
                <Typography
                  // ml={{ xs: '0rem', sm: '0.5rem' }}
                  // mt={{ xs: '1rem', sm: '0rem' }}
                  sx={{
                    fontFamily: "Poppins",
                    fontStyle: "normal",
                    fontWeight: { xs: 400, sm: 500 },
                    fontSize: "14px",
                    lineHeight: "143%",
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    letterSpacing: "0.17px",
                    color: "#FFFFFF",
                  }}
                >
                  Precision Setup with Pro Plan
                </Typography>
              </Box>

              <Button
                sx={{
                  fontSize: "1rem",
                  bgcolor: "#4733FF",
                  height: { xs: "42px", sm: "40px" },
                  borderRadius: { xs: "100px", sm: "15px" },
                  color: "#FFF",
                  textTransform: "none",
                  width: { xs: "144px", sm: "150px" },
                  mr: { xs: "0rem", sm: "1rem" },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "8px 22px",
                  background: "#375CA9",
                  boxShadow:
                    "0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Typography color="#FFF" fontSize="0.8rem" fontWeight={500}>
                  Choose Plan
                </Typography>
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </section>
  );
};
