import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import ContentWrapper from "@/components/profile2/ContentWrapper";
import SectionWrapper from "@/components/profile2/SectionWrapper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { useState } from "react";

interface StackedSwitchProps {
  title: string;
  description: string;
  checked: boolean;
  onChange(checked: boolean): void;
}
const StackedSwitch = ({ title, description, checked, onChange }: StackedSwitchProps) => {
  const [isChecked, setIsChecked] = useState(checked);
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      gap={5}
      sx={{
        width: "calc(100% - 48px)",
        p: "16px 24px",
        border: "1px solid",
        borderRadius: "16px",
        borderColor: "surfaceContainerHighest",
        overflow: "hidden",
      }}
    >
      <Stack gap={1}>
        <Typography
          fontSize={16}
          fontWeight={400}
          color={"onSurface"}
        >
          {title}
        </Typography>
        <Typography
          fontSize={14}
          fontWeight={400}
          color={"secondary.light"}
        >
          {description}
        </Typography>
      </Stack>
      <FormControlLabel
        control={
          <Switch
            checked={isChecked}
            onChange={(_, checked) => setIsChecked(checked)}
          />
        }
        label={isChecked ? "On" : "Off"}
        sx={{
          flexDirection: "row-reverse",
          gap: 2,
          m: 0,
          ".MuiFormControlLabel-label": {
            fontSize: 16,
            fontWeight: 400,
            color: "onSurface",
          },
        }}
      />
    </Stack>
  );
};

function ProfileNotifications() {
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
                checked={false}
                onChange={() => console.log("check Generation finished")}
              />
              <StackedSwitch
                title="GPT notification"
                description="Allow GPT’s send me notifications"
                checked={false}
                onChange={() => console.log("GPT notification finished")}
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
                checked={false}
                onChange={() => console.log("Monthly report finished")}
              />
              <StackedSwitch
                title="Newsletter"
                description="Regular update with blog posts"
                checked={false}
                onChange={() => console.log("Newsletter finished")}
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
