import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import ContentWrapper from "@/components/profile2/ContentWrapper";
import SectionWrapper from "@/components/profile2/SectionWrapper";
import { useQuestions } from "@/hooks/api/questions";
import { useUserAnswers } from "@/hooks/api/user";
import type { IQuestion } from "@/common/types";
import { IdentityItem } from "@/components/profile2/IdentityItem";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { StackedSelect } from "@/components/common/forms/StackedSelect";
import MenuItem from "@mui/material/MenuItem";
import type { UpdateUserData } from "@/core/api/dto/user";
import { useUpdateUserProfileMutation } from "@/core/api/user";
import useToken from "@/hooks/useToken";
import { updateUser } from "@/core/store/userSlice";
import { setToast } from "@/core/store/toastSlice";

const GENDERS = ["MALE", "FEMALE"];

function ProfileIdentity() {
  const token = useToken();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const [questions] = useQuestions();
  const [answers] = useUserAnswers();

  const [updateUserProfile] = useUpdateUserProfileMutation();

  const getUserAnswer = (question: IQuestion) => {
    return answers.find(answer => answer.question.id === question.id)?.option;
  };

  const handleUpdateUser = async (userData: UpdateUserData) => {
    if (!userData || !token) {
      return;
    }

    try {
      const user = await updateUserProfile({
        token,
        data: userData,
      }).unwrap();
      dispatch(updateUser(user));
      dispatch(
        setToast({ message: "General information has been successfully updated", severity: "success", duration: 6000 }),
      );
    } catch (_) {
      dispatch(setToast({ message: "Something went wrong please try again", severity: "error", duration: 6000 }));
    }
  };

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
            {/* <StackedInput
              name="dob"
              label="Birthday"
              value={currentUser?.dob}
              onChange={(e) => handleUpdateUser({ dob: e.target.value})}
              onClear={() => handleUpdateUser({ dob: ""}}
            /> */}
            <StackedSelect
              name="gender"
              label={"Gender"}
              value={currentUser?.gender ?? GENDERS[0]}
              onChange={e => handleUpdateUser({ gender: e.target.value.toUpperCase() })}
              sx={{
                ".MuiSelect-select": {
                  textTransform: "lowercase",
                  ":first-letter": {
                    textTransform: "uppercase",
                  },
                },
              }}
            >
              {GENDERS.map(option => (
                <MenuItem
                  key={option}
                  value={option}
                  sx={{
                    display: "block",
                    textTransform: "lowercase",
                    ":first-letter": {
                      textTransform: "uppercase",
                    },
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </StackedSelect>
            {/* <StackedSelect
              name="relationship"
              label={"Relationship Status"}
              value={currentUser?.relationship}
              onChange={e => handleUpdateUser({ relationship: e.target.value })}
            >
              {RELATION_TYPES.map(option => (
                <MenuItem
                  key={option}
                  value={option}
                >
                  {option}
                </MenuItem>
              ))}
            </StackedSelect> */}
            {/* <StackedInput
              name="city"
              label="City of living"
              value={currentUser?.city}
              onChange={(e) => handleUpdateUser({ city: e.target.value})}
              onClear={() => handleUpdateUser({ city: ""}}
            /> */}
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
