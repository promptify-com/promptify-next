import { SEO_DESCRIPTION } from "@/common/constants";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { type ReactNode } from "react";
import UserLayout from "./UserLayout";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

const ContentWrapper = ({ title, description, children }: Props) => {
  return (
    <UserLayout title={title}>
      <Stack
        gap={5}
        sx={{
          maxWidth: "1184px",
          width: { xs: "100%", md: "70%" },
          m: "auto",
          p: { xs: "50px 0px", md: "40px 10px" },
        }}
      >
        <Stack
          gap={2}
          p={"8px 16px"}
        >
          <Typography
            fontSize={32}
            fontWeight={400}
            color={"onSurface"}
          >
            {title}
          </Typography>
          {description && (
            <Typography
              fontSize={16}
              fontWeight={400}
              color={"onSurface"}
            >
              {description}
            </Typography>
          )}
        </Stack>
        {children}
      </Stack>
    </UserLayout>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      title: "My Prompts",
      description: SEO_DESCRIPTION,
    },
  };
}

export default ContentWrapper;
