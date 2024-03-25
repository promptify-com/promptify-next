import { SEO_DESCRIPTION } from "@/common/constants";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

const ContentWrapper = ({ title, description, children }: Props) => {
  return (
    <Box
      maxWidth={"1184px"}
      width={"70%"}
      m={"auto"}
      p={"40px 20px"}
    >
      <Box>
        <Stack gap={2}>
          <Typography
            fontSize={32}
            fontWeight={400}
            color={"onSurface"}
          >
            {title}
          </Typography>
          <Typography
            fontSize={16}
            fontWeight={400}
            color={"onSurface"}
          >
            {description}
          </Typography>
        </Stack>
      </Box>
      {children}
    </Box>
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
