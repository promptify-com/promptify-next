import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import Typography from "@mui/material/Typography";
import useDebounce from "@/hooks/useDebounce";

interface Props {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const SystemPromptForm: React.FC<Props> = ({
  label,
  placeholder,
  value = "",
  onChange = () => {},
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [fold, setFold] = useState(false);
  const debouncedInputValue = useDebounce(inputValue, 300);

  useEffect(() => {
    onChange(debouncedInputValue);
  }, [debouncedInputValue, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const toggleFold = () => setFold(prevFold => !prevFold);

  return (
    <Stack
      sx={{
        flex: 1,
        width: "100%",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: 2,
        position: "relative",
        p: 0.5,
      }}
      direction={fold ? "column" : "row"}
      alignItems={fold ? "flex-start" : "center"}
    >
      <IconButton
        onClick={toggleFold}
        sx={{
          opacity: 0.7,
          border: "none",
          position: "absolute",
          top: 0,
          right: 4,
          zIndex: 2,
        }}
      >
        {fold ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
      </IconButton>
      {label && (
        <Typography
          sx={{
            flexShrink: 0,
            fontSize: 11,
            textTransform: "uppercase",
            color: "text.secondary",
          }}
        >
          {label}
        </Typography>
      )}
      <Input
        fullWidth
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        disabled={disabled}
        disableUnderline
        multiline={fold}
        rows={fold ? 3 : 1}
        sx={{ ml: fold ? 0 : 1 }}
        inputProps={{ style: { fontSize: 12 } }}
      />
    </Stack>
  );
};

export default SystemPromptForm;
