import { useState } from "react";
import HelpOutline from "@mui/icons-material/HelpOutline";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

import { getFileTypeExtensionsAsString } from "@/common/helpers/uploadFileHelper";
import BaseButton from "@/components/base/BaseButton";
import CodeFieldModal from "@/components/modals/CodeFieldModal";
import { useAppSelector } from "@/hooks/useStore";
import type { FileType, IPromptInput } from "@/common/types/prompt";

interface Props {
  input: IPromptInput;
  value: string | number | File;
  onChangeInput: (value: string | File, input: IPromptInput) => void;
}

function FormInput({ input, value, onChangeInput }: Props) {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const [codeFieldOpen, setCodeFieldOpen] = useState(false);
  const isFile = value instanceof File;

  return (
    <Stack
      key={input.name}
      direction={"row"}
      p={"6px"}
      alignItems={"center"}
      gap={1}
      borderBottom={"1px solid #ECECF4"}
    >
      <Radio
        size="small"
        checked={!!value}
        value="a"
        name="radio-buttons"
        inputProps={{ "aria-label": "A" }}
      />
      <InputLabel
        sx={{
          fontSize: { xs: 12, md: 15 },
          fontWeight: 500,
          color: "primary.main",
        }}
      >
        {input.fullName} {input.required && <span>*</span>} :
      </InputLabel>
      <Stack
        flex={1}
        display={"flex"}
        alignItems={"start"}
      >
        {input.type === "code" ? (
          <>
            <BaseButton
              disabled={isGenerating}
              size="small"
              onClick={() => {
                setCodeFieldOpen(true);
              }}
              color="custom"
              variant="text"
              sx={{
                border: "1px solid",
                borderRadius: "8px",
                borderColor: "secondary.main",
                color: "secondary.main",
                p: "3px 12px",
                fontSize: { xs: 12, md: 14 },
                ":hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              {!isFile && value ? value : "Insert Code"}
            </BaseButton>
            {codeFieldOpen && (
              <CodeFieldModal
                open
                setOpen={setCodeFieldOpen}
                value={value as string}
                onSubmit={val => onChangeInput(val, input)}
              />
            )}
          </>
        ) : input.type === "choices" ? (
          <Select
            disabled={isGenerating}
            sx={{
              ".MuiSelect-select": {
                p: "3px 12px",
                fontSize: 14,
                fontWeight: 400,
                opacity: value ? 1 : 0.7,
              },
              ".MuiOutlinedInput-notchedOutline, .Mui-focused": {
                borderRadius: "8px",
                borderWidth: "1px !important",
                borderColor: "secondary.main",
              },
            }}
            MenuProps={{
              sx: { ".MuiMenuItem-root": { fontSize: 14, fontWeight: 400 } },
            }}
            value={value}
            onChange={e => onChangeInput(e.target.value as string, input)}
            displayEmpty
          >
            <MenuItem
              value=""
              sx={{ opacity: 0.7 }}
            >
              Select an option
            </MenuItem>
            {input.choices?.map(choice => (
              <MenuItem
                key={choice}
                value={choice}
                selected={value === choice}
              >
                {choice}
              </MenuItem>
            ))}
          </Select>
        ) : input.type === "file" ? (
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
          >
            <Button
              component="label"
              variant="contained"
              sx={{ border: "1px solid", p: "3px 12px", fontSize: { xs: 12, md: 14 }, fontWeight: 500 }}
            >
              {isFile ? value.name : "Upload file"}
              <input
                hidden
                accept={getFileTypeExtensionsAsString(input.fileExtensions as FileType[])}
                type="file"
                style={{
                  clip: "rect(0 0 0 0)",
                  clipPath: "inset(50%)",
                  height: "auto",
                  overflow: "hidden",
                  position: "absolute",
                  whiteSpace: "nowrap",
                  width: 1,
                }}
                onChange={e => {
                  if (e.target.files && e.target.files.length > 0) {
                    onChangeInput(e.target.files[0], input);
                  }
                }}
              />
            </Button>
          </Stack>
        ) : (
          <TextField
            fullWidth
            disabled={isGenerating}
            sx={{
              ".MuiInputBase-input": {
                p: 0,
                color: "onSurface",
                fontSize: { xs: 12, md: 14 },
                fontWeight: 400,
                "&::placeholder": {
                  color: "text.secondary",
                  opacity: 0.65,
                },
                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "&[type=number]": {
                  MozAppearance: "textfield",
                },
              },
              ".MuiOutlinedInput-notchedOutline": {
                border: 0,
              },
              ".MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: 0,
              },
            }}
            placeholder={"Type here"}
            type={input.type}
            value={value}
            onChange={e => onChangeInput(e.target.value, input)}
          />
        )}
      </Stack>
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={"8px"}
      >
        {input.required && (
          <Typography
            sx={{
              fontSize: { xs: 12, md: 15 },
              fontWeight: 400,
              lineHeight: "100%",
              opacity: 0.3,
            }}
          >
            Required
          </Typography>
        )}
        <Tooltip
          arrow
          title={
            <Typography
              color={"white"}
              textTransform={"capitalize"}
              fontSize={11}
            >
              {input.type}
            </Typography>
          }
        >
          <IconButton
            sx={{
              opacity: 0.3,
              border: "none",
            }}
          >
            <HelpOutline />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}

export default FormInput;
