import React, { useState } from "react";
import { BugReport } from "@mui/icons-material";
import {
  Box,
  Button,
  CardMedia,
  CircularProgress,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import { ICheckedQA, IQuestion } from "../../common/types";
import { useUpdateAnswers } from "../../hooks/api/user";
import QuestionCard from "./QuestionCard";
import { LogoApp } from "../../assets/icons/LogoApp";
import Images from "../../assets";
import MuiAlert, { AlertProps, AlertColor } from "@mui/material/Alert";
import Link from "next/link";
import { SigninImage } from "@/assets/icons/SigninImage";

interface IProps {
  skip: () => void;
  questions: IQuestion[];
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Questions: React.FC<IProps> = ({ skip, questions }) => {
  const [checkedOptions, setCheckedOptions] = useState<ICheckedQA>([]);
  const [open, setOpen] = React.useState(false);
  const [typeAlert, setTypeAlert] = React.useState<AlertColor>("success");
  const [step, setStep] = useState(1);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [setUserAnswer, _, isAnswering] = useUpdateAnswers();
  const nextStep = async () => {
    const idx = step - 1;
    const currentQuestion = questions[idx];

    // setOpen(true);
    await setUserAnswer(
      currentQuestion,
      checkedOptions[currentQuestion.id]
    ).then((res: any) => {
      if (!!res?.answer) {
        setTypeAlert("success");
      } else {
        setTypeAlert("error");
      }
      setOpen(true);
      if (step === questions.length) {
        skip();
      } else {
        setStep(step + 1);
      }
    });
  };

  return (
    <Box
      display="flex"
      sx={{
        minHeight: "100vh",
        width: "100vw",
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
            width: { xs: "90%", lg: "70%" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Link href="/">
            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "30px",
              }}
            >
              <LogoApp />
            </Grid>
          </Link>

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
            Please, answer six simple questions specify your conext
          </Typography>

          {questions.length > 0 && (
            <>
              <Typography
                sx={{
                  mt: "1rem",
                  mb: "1rem",
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
                {questions[step - 1].text}
              </Typography>
              <Grid container spacing={{ xs: 1, sm: 2 }}>
                {questions[step - 1].options.map((option) => {
                  return (
                    <Grid item xs={6} sm={6} key={option.id}>
                      <QuestionCard
                        name={option.text}
                        icon={<BugReport />}
                        id={option.id}
                        question={questions[step - 1]}
                        checkedOptions={checkedOptions}
                        setCheckedOptions={setCheckedOptions}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}

          <Button
            disabled={isAnswering}
            onClick={nextStep}
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
            {isAnswering ? (
              <CircularProgress />
            ) : (
              <Typography color="#000000">Continue</Typography>
            )}
          </Button>

          <Box
            sx={{
              mt: { xs: "0.6rem", md: "0.8rem", lg: "1rem" },
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "13px",
                lineHeight: "22px",
                letterSpacing: "0.46px",
                color: "#000000",
              }}
            >
              Question {step} of {questions.length}
            </Typography>
            <Typography
              onClick={() => skip()}
              sx={{
                fontSize: { xs: "0.8rem", md: "0.8rem", lg: "0.8rem" },
                color: "#9A9A9A",
                mb: "2rem",
              }}
            >
              Skip for now
            </Typography>
          </Box>
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
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert severity={typeAlert}>
          {typeAlert === "success"
            ? "Your answer registred successfully"
            : "Your answer not registred"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Questions;
