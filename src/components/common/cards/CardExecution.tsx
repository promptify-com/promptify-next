import { Stack, Typography } from "@mui/material";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import { useDispatch } from "react-redux";
import { setSelectedExecution } from "@/core/store/executionsSlice";

import useTruncate from "@/hooks/useTruncate";
import AvatarWithInitials from "@/components/prompt/AvatarWithInitials";
import { setChatFullScreenStatus } from "@/core/store/templatesSlice";

interface CardExecutionProps {
  execution: TemplatesExecutions;
}

export const CardExecution: React.FC<CardExecutionProps> = ({ execution }) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setChatFullScreenStatus(false));
    dispatch(setSelectedExecution(execution));
  };

  const { truncate } = useTruncate();

  return (
    <Stack
      onClick={handleClick}
      direction={"row"}
      gap={"8px"}
    >
      <AvatarWithInitials title={execution.title} />
      <Stack>
        <Typography
          sx={{
            fontSize: 15,
          }}
        >
          {truncate(execution.title, { length: 30 })}
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
            opacity: 0.7,
          }}
        >
          Text with markup. 12k words, 3 images
        </Typography>
      </Stack>
    </Stack>
  );
};
