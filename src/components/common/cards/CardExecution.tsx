import { Stack, Typography } from "@mui/material";
import { TemplatesExecutions } from "@/core/api/dto/templates";

import useTruncate from "@/hooks/useTruncate";
import AvatarWithInitials from "@/components/prompt/AvatarWithInitials";

interface CardExecutionProps {
  execution: TemplatesExecutions;
}

export const CardExecution: React.FC<CardExecutionProps> = ({ execution }) => {
  const { truncate } = useTruncate();

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={"8px"}
    >
      <AvatarWithInitials title={execution.title} />
      <Stack flex={1}>
        <Typography
          sx={{
            fontSize: 15,
          }}
        >
          {truncate(execution.title, { length: 50 })}
        </Typography>
      </Stack>
    </Stack>
  );
};
