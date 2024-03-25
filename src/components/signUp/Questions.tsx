import React, { useState } from "react";
import { BugReport } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import QuestionCard from "./QuestionCard";

import { useUpdateAnswers } from "@/hooks/api/user";
import { IQuestion } from "@/common/types";
import { setToast } from "@/core/store/toastSlice";
import { useAppDispatch } from "@/hooks/useStore";

interface IProps {
  skip: () => void;
  questions: IQuestion[];
}

const Questions: React.FC<IProps> = ({ skip, questions }) => {
  const dispatch = useAppDispatch();

  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [step, setStep] = useState(1);

  const [setUserAnswer, _, isAnswering] = useUpdateAnswers();

  const nextStep = async () => {
    if (!selectedOptionId) return;

    const idx = step - 1;
    const currentQuestion = questions[idx];
    await setUserAnswer(currentQuestion, selectedOptionId).then((res: any) => {
      if (res?.answer) {
        dispatch(
          setToast({
            message: "Your answer registred successfully.",
            severity: "success",
            position: { vertical: "bottom", horizontal: "left" },
          }),
        );
      } else {
        dispatch(
          setToast({
            message: "Your answer not registred.",
            severity: "error",
            position: { vertical: "bottom", horizontal: "left" },
          }),
        );
      }
      if (step === questions.length) {
        skip();
      } else {
        setStep(step + 1);
      }
    });
  };

  return (
    <Box
      sx={{
        width: "100vw",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "48px",
          flex: "1 0 0",
          height: "822px",
          width: "952px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "560px",
            padding: "var(--none, 0px) var(--2, 16px)",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--3, 24px)",
          }}
        >
          {step === 1 && (
            <Typography
              sx={{
                color: "var(--onSurface, var(--onSurface, #1B1B1F))",
                textAlign: "center",
                fontFeatureSettings: "'clig' off, 'liga' off",
                fontFamily: "Poppins",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "110%",
                letterSpacing: "0.17px",
              }}
            >
              Please, answer six simple questions to specify your context.
            </Typography>
          )}

          <div></div>
          <div></div>
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

          {questions.length > 0 && (
            <Typography
              sx={{
                color: "var(--onSurface, var(--onSurface, #1B1B1F))",
                textAlign: "center",
                fontFeatureSettings: "'clig' off, 'liga' off",
                fontFamily: "Poppins",
                fontSize: "32px",
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "110%",
                letterSpacing: "0.17px",
              }}
            >
              {questions[step - 1].text}
            </Typography>
          )}
        </Box>

        {questions.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              gap: "var(--2, 16px)",
            }}
          >
            {questions[step - 1].options.map(option => {
              return (
                <QuestionCard
                  name={option.text}
                  icon={<BugReport />}
                  id={option.id}
                  question={questions[step - 1]}
                  selectedOptionId={selectedOptionId}
                  setSelectedOptionId={setSelectedOptionId}
                />
              );
            })}
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            width: "560px",
            padding: "var(--none, 0px) var(--2, 16px)",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            disabled={isAnswering || !selectedOptionId}
            onClick={nextStep}
            sx={{
              display: "flex",
              width: "528px",
              height: "48px",
              padding: "12px 16px",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "99px",
              background: !selectedOptionId ? "var(--surfaceContainerHighest, #E3E2E6)" : "var(--onSurface, #1B1B1F)",
              "&:hover": {
                background: "var(--onSurface, #1B1B1F)",
              },
            }}
          >
            {isAnswering ? (
              <CircularProgress style={{ color: "#fff" }} />
            ) : (
              <Typography
                sx={{
                  color: "var(--onPrimary, var(--onPrimary, #FFF))",
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: "500",
                  lineHeight: "150%",
                }}
              >
                Continue
              </Typography>
            )}
          </Button>

          <Box
            sx={{
              mt: { xs: "0.6rem", md: "0.8rem", lg: "1rem" },
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
              height: "40px",
              p: "8px 16px",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              onClick={() => skip()}
              sx={{
                fontSize: { xs: "0.8rem", md: "0.8rem", lg: "0.8rem" },
                color: "#1D202",
                mb: "2rem",
                fontWeight: 500,
              }}
            >
              Skip for now
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Questions;
