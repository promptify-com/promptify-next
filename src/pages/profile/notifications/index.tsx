import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import ContentWrapper from "@/components/profile2/ContentWrapper";
import SectionWrapper from "@/components/profile2/SectionWrapper";
import Stack from "@mui/material/Stack";
import StackedSwitch from "@/components/common/forms/StackedSwitch";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useUpdateUserPreferencesMutation } from "@/core/api/user";
import { UpdateUserPreferences } from "@/core/api/dto/user";
import { updateUser } from "@/core/store/userSlice";
import { setToast } from "@/core/store/toastSlice";

function ProfileNotifications() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);

  const [updateUserPreferences, { isLoading: isLoadingPreferences }] = useUpdateUserPreferencesMutation();

  const handleChangePreferences = async (data: UpdateUserPreferences) => {
    if (!currentUser || isLoadingPreferences) return;

    try {
      const preferences = await updateUserPreferences({
        username: currentUser.username,
        data,
      }).unwrap();
      dispatch(updateUser({ ...currentUser, preferences }));
      dispatch(setToast({ message: "Notifications have been successfully updated.", severity: "success" }));
    } catch (err) {
      dispatch(setToast({ message: "Something went wrong please try again", severity: "error" }));
    }
  };

  const preferences = currentUser?.preferences;

  return (
    <Protected>
      <Layout>
        <ContentWrapper
          title="Notifications"
          description="Here, you can customize your notification preferences to stay updated on important events and activities."
        >
          <SectionWrapper
            title="Offline events"
            description="Notifications via email, while you are offline"
            noBorder
          >
            <Stack gap={2}>
              <StackedSwitch
                title="Generation finished"
                description="Notify me when prompt generation is finished"
                checked={Boolean(preferences?.generation_finished)}
                onChange={checked => handleChangePreferences({ generation_finished: checked })}
              />
              <StackedSwitch
                title="GPT notification"
                description="Allow GPT’s send me notifications"
                checked={Boolean(preferences?.gpt_notification)}
                onChange={checked => handleChangePreferences({ gpt_notification: checked })}
              />
            </Stack>
          </SectionWrapper>
          <SectionWrapper
            title="Events & Updates"
            description="Informational mailings"
            noBorder
          >
            <Stack gap={2}>
              <StackedSwitch
                title="Monthly report"
                description="Regular update with statistic of your prompts and platform highlights"
                checked={Boolean(preferences?.monthly_report)}
                onChange={checked => handleChangePreferences({ monthly_report: checked })}
              />
              <StackedSwitch
                title="Newsletter"
                description="Regular update with blog posts"
                checked={Boolean(preferences?.newsletter)}
                onChange={checked => handleChangePreferences({ newsletter: checked })}
              />
            </Stack>
          </SectionWrapper>
        </ContentWrapper>
      </Layout>
    </Protected>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: "Notifications",
      description: SEO_DESCRIPTION,
    },
  };
}

export default ProfileNotifications;
