import IconButton from "@mui/material/IconButton";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";

interface Props {
  code: string;
}

const CopyButton = ({ code }: Props) => {
  const [copy, result] = useCopyToClipboard();

  return (
    <IconButton
      onClick={() => copy(code)}
      sx={{ border: "none" }}
    >
      <ContentPasteIcon />
    </IconButton>
  );
};

export default CopyButton;
