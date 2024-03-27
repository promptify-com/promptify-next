import { ReactNode } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface SectionWrapperProps {
  title?: string;
  description?: string;
  children: ReactNode;
  noBorder?: boolean;
}

const SectionWrapper = ({ title, description, children, noBorder }: SectionWrapperProps) => (
  <Stack
    gap={2}
    p={"8px 16px"}
  >
    <Stack
      gap={1}
      py={"8px"}
    >
      {title && (
        <Typography
          fontSize={20}
          fontWeight={400}
          color={"onSurface"}
        >
          {title}
        </Typography>
      )}
      {description && (
        <Typography
          fontSize={16}
          fontWeight={400}
          color={"secondary.light"}
        >
          {description}
        </Typography>
      )}
    </Stack>
    <Box
      sx={{
        ...(!noBorder && {
          border: "1px solid",
          borderRadius: "16px",
          borderColor: "surfaceContainerHighest",
          overflow: "hidden",
        }),
      }}
    >
      {children}
    </Box>
  </Stack>
);

export default SectionWrapper;
