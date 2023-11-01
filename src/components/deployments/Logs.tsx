import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

function Logs({ items }: { items: string[] }) {
  if (!items.length) return;
  return (
    <>
      <Typography>Logs:</Typography>

      <Stack
        minHeight={"130px"}
        height={"130px"}
        bgcolor="surface.2"
        border={"1px solid gray"}
        maxWidth={"520px"}
        borderRadius="8px"
        px="8px"
        direction="column"
        sx={{ whiteSpace: "pre-wrap", overflowY: "auto" }}
      >
        <pre style={{ wordBreak: "break-word", whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
          {items.join("\n")}
        </pre>{" "}
      </Stack>
    </>
  );
}

export default Logs;
