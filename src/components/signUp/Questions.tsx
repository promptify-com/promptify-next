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
          width: { xs: "100%", lg: "70%" },
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
              mt: { xs: "1rem", md: "1rem", lg: "1rem", xl: "1rem" },
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
            Hello, Johnathan!
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
                    <Grid item xs={12} sm={6} key={option.id}>
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
          width: "30%",
          height: "100vh",
          display: { xs: "none", lg: "flex" },
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <CardMedia
          component="img"
          image={Images.COVERLOGIN}
          alt="Cover SignIn"
          sx={{
            display: "block",
            WebkitBackgroundSize: "cover",
            backgroundSize: "cover",
            objectFit: "contain",
            height: "100vh",
            width: "fit-content",
          }}
        />
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
