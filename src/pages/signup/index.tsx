import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { PageLoading } from "../../components/PageLoading";
import { useQuestions } from "../../hooks/api/questions";
import Questions from "@/components/signUp/Questions";
import Finish from "@/components/signUp/Finish";

import SigninPlaceholder from "@/components/placeholders/SigninPlaceholder";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const isLoading = false;
  const [questions] = useQuestions();

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      event.preventDefault();
      event.returnValue = "Etes-vous sur de vouloir quitter la page ?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <SigninPlaceholder signup={true} />
      ) : (
        <Box>
          {/* {step === 1 && <Prompts setStep={setStep} />} */}
          {step === 1 && (
            <Questions
              questions={questions}
              skip={() => setStep(2)}
            />
          )}
          {step === 2 && <Finish />}
        </Box>
      )}
    </>
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
