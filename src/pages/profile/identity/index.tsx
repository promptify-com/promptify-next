import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import ContentWrapper from "@/components/profile2/ContentWrapper";
import SectionWrapper from "@/components/profile2/SectionWrapper";
import { useQuestions } from "@/hooks/api/questions";
import { useUserAnswers } from "@/hooks/api/user";
import type { IQuestion } from "@/common/types";
import { IdentityItem } from "@/components/profile2/IdentityItem";
import StackedInput from "@/components/common/forms/StackedInput";
import { useFormik } from "formik";
import { useAppSelector } from "@/hooks/useStore";
import { StackedSelect } from "@/components/common/forms/StackedSelect";
import MenuItem from "@mui/material/MenuItem";
import { RELATION_TYPES } from "@/components/profile2/Constants";

function ProfileIdentity() {
  const currentUser = useAppSelector(state => state.user.currentUser);
  const [questions] = useQuestions();
  const [answers] = useUserAnswers();

  const getUserAnswer = (question: IQuestion) => {
    return answers.find(answer => answer.question.id === question.id)?.option;
  };

  const formik = useFormik<any>({
    initialValues: {
      dob: "",
      gender: currentUser?.gender || "",
      relationship: "",
      city: "",
    },
    onSubmit: () => console.log("Submit"),
  });

  return (
    <Protected>
      <Layout>
        <ContentWrapper
          title="Identity"
          description="Welcome to your Identity page. This is where we store information about your preferences, personality traits, and other data to personalize your experience on our platform."
        >
          <SectionWrapper
            title="Onboarding questionnaire"
            description="You completed this questionnaire when you created your account, this data will greatly help us improve your experience. You can change the answers at any time"
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
          <SectionWrapper
            title="General Information"
            description="We may have gathered this information from publicly available sources or your connected accounts. This data is utilized to craft a genuinely tailored experience for you."
          >
            <StackedInput
              name="dob"
              label="Birthday"
              value={formik.values.dob}
              onChange={formik.handleChange}
              onClear={() => formik.setFieldValue("dob", "")}
            />
            <StackedSelect
              name="gender"
              label={"Gender"}
              value={formik.values.gender}
              onChange={formik.handleChange}
            >
              {["Male", "Female"].map(option => (
                <MenuItem
                  key={option}
                  value={option}
                >
                  {option}
                </MenuItem>
              ))}
            </StackedSelect>
            <StackedSelect
              name="relationship"
              label={"Relationship Status"}
              value={formik.values.relationship}
              onChange={formik.handleChange}
            >
              {RELATION_TYPES.map(option => (
                <MenuItem
                  key={option}
                  value={option}
                >
                  {option}
                </MenuItem>
              ))}
            </StackedSelect>
            <StackedInput
              name="city"
              label="City of living"
              value={formik.values.city}
              onChange={formik.handleChange}
              onClear={() => formik.setFieldValue("city", "")}
            />
          </SectionWrapper>
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
