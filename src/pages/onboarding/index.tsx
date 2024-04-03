import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useQuestions } from "../../hooks/api/questions";
import Finish from "@/components/onboarding/Finish";
import Questions from "@/components/onboarding/Questions";
import { LogoApp } from "@/assets/icons/LogoApp";

const thisYear = new Date().getFullYear();

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [questions] = useQuestions();

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave the page?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        color: "var(--onSurface, #1B1B1F)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          padding: "var(--3, 24px) var(--none, 0px)",
          justifyContent: "center",
          alignItems: "center",
          gap: "var(--borderRadius, 4px)",
          alignSelf: "stretch",
          mt: "var(--3, 24px)",
        }}
      >
        <LogoApp />
        <Typography
          sx={{
            color: "#1B1B1F",
            fontSize: "32px",
            fontStyle: "normal",
            fontWeight: "500",
            m: "-10px 0px 0 4px",
          }}
        >
          Promptify
        </Typography>
      </Box>

      {step === 1 && (
        <Questions
          questions={questions}
          skip={() => {
            setStep(2);
          }}
        />
      )}
      {step === 2 && <Finish />}

      <Box
        sx={{
          display: "flex",
          padding: "var(--2, 16px) var(--3, 24px)",
          justifyContent: "center",
          alignItems: "center",
          gap: "var(--3, 24px)",
          alignSelf: "stretch",
        }}
      >
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
      </Box>
    </Box>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      title: "Promptify | Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
    },
  };
}
export default SignUp;
