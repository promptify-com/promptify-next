import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import { useDispatch } from "react-redux";
import { setSelectedExecution } from "@/core/store/executionsSlice";

interface CardExecutionProps {
  execution: TemplatesExecutions;
}

export const CardExecution: React.FC<CardExecutionProps> = ({ execution }) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setSelectedExecution(execution));
  };

  return (
    <Card
      onClick={handleClick}
      title={execution.title}
      elevation={0}
      sx={{
        maxWidth: "200px",
        width: "200px",
        bgcolor: "transparent",
        borderRadius: "27px",
        overflow: "hidden",
        "&:hover": {
          bgcolor: "white",
        },
      }}
    >
      <CardActionArea
        sx={{
          position: "relative",
        }}
      >
        <Typography
          variant="h1"
          fontSize={16}
          fontWeight={500}
          lineHeight={"20.8px"}
          color={"white"}
          mx={2}
          position={"absolute"}
          top={8}
        >
          {execution.title}
        </Typography>
        <CardContent sx={{ padding: "8px", m: 0 }}>
          <Typography
            gutterBottom
            fontSize={12}
            lineHeight={"16.8px"}
            component="div"
          >
            {execution.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
