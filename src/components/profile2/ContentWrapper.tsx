import { SEO_DESCRIPTION } from "@/common/constants";
import type { SxProps } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { type ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  sx?: SxProps;
}

const ContentWrapper = ({ title, description, children, actions, sx }: Props) => {
  return (
    <Stack
      gap={5}
      sx={{
        maxWidth: "1184px",
        width: "70%",
        m: "auto",
        p: "40px 20px",
        ...sx,
      }}
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
