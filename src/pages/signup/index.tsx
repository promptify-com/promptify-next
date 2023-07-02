import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useGetCurrentUser } from "../../hooks/api/user";
import { PageLoading } from "../../components/PageLoading";
import { useQuestions } from "../../hooks/api/questions";
import Prompts from "@/components/signUp/Prompts";
import Questions from "@/components/signUp/Questions";
import Finish from "@/components/signUp/Finish";
import Head from "next/head";

const SignUp = () => {
  const [step, setStep] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tokenUser, error, isLoading] = useGetCurrentUser();
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
      <Head>
        <title>Promptify | Boost Your Creativity</title>
        <meta
          name="description"
          content="Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoading ? (
        <PageLoading />
      ) : (
        <Box>
          {step === 1 && <Prompts setStep={setStep} />}
          {step === 2 && (
            <Questions questions={questions} skip={() => setStep(3)} />
          )}
          {step === 3 && <Finish />}
        </Box>
      )}
    </>
  );
};
export default SignUp;
