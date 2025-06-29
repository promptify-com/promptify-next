import { useState } from "react";
import BugReport from "@mui/icons-material/BugReport";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import QuestionCard from "./QuestionCard";
import Grid from "@mui/material/Grid";

import { useUpdateAnswers } from "@/hooks/api/user";
import type { IQuestion } from "@/common/types";
import { setToast } from "@/core/store/toastSlice";
import { useAppDispatch } from "@/hooks/useStore";
import { numberToWord } from "@/common/helpers";

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
    await setUserAnswer(currentQuestion, selectedOptionId)
      .then(() => {
        dispatch(
          setToast({
            message: "Your answer is registered successfully.",
            severity: "success",
            position: { vertical: "bottom", horizontal: "left" },
          }),
        );

        if (step === questions.length) {
          skip();
        } else {
          setSelectedOptionId(null);
          setStep(step + 1);
        }
      })
      .catch(() => {
        dispatch(
          setToast({
            message: "An error occurred while saving your answer.",
            severity: "error",
            position: { vertical: "bottom", horizontal: "left" },
          }),
        );
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "48px",
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
          gap: "72px",
        }}
      >
        {step === 1 && (
          <Typography
            sx={{
              color: "var(--onSurface, var(--onSurface, #1B1B1F))",
              textAlign: "center",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontSize: { xs: "12px", md: "24px" },
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "110%",
              letterSpacing: "0.17px",
            }}
          >
            Please, answer {numberToWord(questions.length)} simple questions to specify your context.
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <Typography
            sx={{
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
                fontSize: { xs: "26px", md: "32px" },
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
      </Box>

      {questions.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Grid
            container
            justifyContent="center"
            alignItems="flex-end"
            spacing={2}
          >
            {questions[step - 1].options.map(option => (
              <Grid
                item
                xs={12}
                sm={5}
                md={3}
                key={option.id}
              >
                <QuestionCard
                  name={option.text}
                  icon={<BugReport />}
                  id={option.id}
                  question={questions[step - 1]}
                  selectedOptionId={selectedOptionId}
                  setSelectedOptionId={setSelectedOptionId}
                />
              </Grid>
            ))}
          </Grid>
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
            width: { xs: "330px", md: "528px" },
            height: "48px",
            padding: "12px 16px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "99px",
            color: "var(--onPrimary, var(--onPrimary, #FFF))",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: "500",
            lineHeight: "150%",
            border: !selectedOptionId ? 0 : "1px solid",
            background: !selectedOptionId ? "var(--surfaceContainerHighest, #E3E2E6)" : "var(--onSurface, #1B1B1F)",
            transition: "background 0.3s ease-in-out",
            "&:hover": {
              background: "transparent",
              color: "#424242",
            },
          }}
        >
          {isAnswering ? <CircularProgress style={{ color: "#fff" }} /> : <>Continue</>}
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
  );
};

export default Questions;
