import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import ContentWrapper from "@/components/profile2/ContentWrapper";
import Stack from "@mui/material/Stack";
import SectionWrapper from "@/components/profile2/SectionWrapper";
import { useQuestions } from "@/hooks/api/questions";
import { useUserAnswers } from "@/hooks/api/user";
import type { IQuestion } from "@/common/types";
import { IdentityItem } from "@/components/profile2/IdentityItem";

function ProfileIdentity() {
  const [questions] = useQuestions();
  const [answers] = useUserAnswers();

  const getUserAnswer = (question: IQuestion) => {
    return answers.find(answer => answer.question.id === question.id)?.option;
  };

  return (
    <Protected>
      <Layout>
        <ContentWrapper
          title="Identity"
          description="Welcome to your Identity page. This is where we store information about your preferences, personality traits, and other data to personalize your experience on our platform."
        >
          <Stack gap={2}>
            <SectionWrapper
              title="Onboarding questionnaire"
              description="You completed this questionnaire when you created your account, this data will greatly help us improve
                your experience. You can change the answers at any time"
            >
              {questions.map(question => {
                const answer = getUserAnswer(question);
                return (
                  <IdentityItem
                    key={question.id}
                    question={question}
                    defaultAnswer={answer}
                  />
                );
              })}
            </SectionWrapper>
          </Stack>
        </ContentWrapper>
      </Layout>
    </Protected>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: "Identity",
      description: SEO_DESCRIPTION,
    },
  };
}

export default ProfileIdentity;
