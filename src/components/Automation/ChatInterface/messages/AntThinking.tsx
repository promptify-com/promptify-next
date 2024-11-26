import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface Props {
  content: string;
}

const AntThinkingComponent = ({ content }: Props) => {
  return (
    <Stack sx={{ p: 1, justifyContent: "center", backgroundColor: "#fff3cd", borderRadius: 4 }}>
      <Typography
        variant="subtitle2"
        fontWeight={600}
      >
        Thinking Content:
      </Typography>
      <Typography variant="subtitle2">{content}</Typography>
    </Stack>
  );
};

export default AntThinkingComponent;
