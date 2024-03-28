import { SEO_DESCRIPTION } from "@/common/constants";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { type ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

const ContentWrapper = ({ title, description, children, actions }: Props) => {
  return (
    <Stack
      maxWidth={"1184px"}
      width={"70%"}
      m={"auto"}
      p={"40px 20px"}
      gap={5}
    >
      <Stack
        direction={"row"}
        gap={1}
        alignItems={"center"}
        p={"8px 16px"}
      >
        <Stack gap={2}>
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
        {actions}
      </Stack>
      {children}
    </Stack>
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
