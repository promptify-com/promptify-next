import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { IOption, IQuestion } from "@/common/types";
import { useUpdateAnswers } from "@/hooks/api/user";
import Image from "@/components/design-system/Image";
import defaultAvatar from "@/assets/images/default-avatar.jpg";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material/SelectChangeEvent";
import Stack from "@mui/material/Stack";

const AVAILABLE_OPTION_IMGS = [
  "Countryside",
  "Movies",
  "Batman",
  "Summer",
  "Dolphin",
  "Elephant",
  "Lion",
  "City",
  "Yellow",
  "Books",
  "Blue",
  "Winter",
  "Owl",
  "Spider-Man",
  "Live+Performances",
  "Spring",
  "Video Games",
  "Beach",
  "Video+Games",
  "Green",
  "Mountains",
  "Wonder Woman",
  "Superman",
  "Wonder+Woman",
  "Autumn",
  "Live Performances",
  "Red",
];

interface IProps {
  question: IQuestion;
  defaultAnswer: IOption | undefined;
}

export const IdentityItem: React.FC<IProps> = ({ question, defaultAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(defaultAnswer?.text || "");
  const [isLoading, setIsLoading] = useState(false);
  const [setUserAnswer] = useUpdateAnswers();

  const options = question.options;

  const handleOptionSelection = async (e: SelectChangeEvent) => {
    const option = options.find(opt => opt.text === e.target.value);

    if (!option || option.text === selectedOption) return;

    setSelectedOption(option.text);

    setIsLoading(true);
    await setUserAnswer(question, option.id).finally(() => setIsLoading(false));
  };

  useEffect(() => setSelectedOption(defaultAnswer?.text || ""), [defaultAnswer]);

  return (
    <FormControl
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        ":not(:last-of-type)": {
          borderBottom: "1px solid",
          borderColor: "surfaceContainerHighest",
        },
        ":hover": { bgcolor: "surfaceContainerLow" },
      }}
    >
      <InputLabel
        sx={{
          flex: 2,
          position: "relative",
          transform: "none",
          p: "16px 8px 16px 24px",
          fontSize: 14,
          fontWeight: 500,
          color: "secondary.light",
          whiteSpace: "pre-wrap",
          "&.Mui-focused": {
            color: "secondary.light",
          },
        }}
      >
        {question.text}
      </InputLabel>
      <Stack
        flex={4}
        direction={"row"}
        alignItems={"center"}
        gap={3}
        sx={{
          p: "16px",
          height: "100%",
        }}
      >
        <Select
          value={selectedOption}
          disabled={isLoading}
          onChange={handleOptionSelection}
          MenuProps={{
            disableScrollLock: true,
            sx: {
              ".MuiList-root": {
                p: 0,
                fontSize: 16,
                fontWeight: 400,
                color: "onSurface",
              },
            },
          }}
          sx={{
            flex: 1,
            ".MuiSelect-select": {
              p: 0,
              img: { display: "none" },
            },
            fieldset: {
              border: "none",
            },
          }}
        >
          {options.map(option => {
            const optionSrc =
              option?.text && AVAILABLE_OPTION_IMGS.includes(option.text)
                ? `/assets/images/animals/${option.text}.jpg`
                : defaultAvatar;

            return (
              <MenuItem
                key={option.id}
                value={option.text}
                sx={{
                  borderTop: "1px solid #E3E3E3",
                  gap: 2,
                }}
              >
                <Image
                  src={optionSrc}
                  alt={option.text}
                  priority={false}
                  width={40}
                  height={40}
                  style={{ borderRadius: "50%" }}
                />
                <Typography
                  fontSize={16}
                  fontWeight={400}
                  color={"onSurface"}
                >
                  {option.text}
                </Typography>
              </MenuItem>
            );
          })}
        </Select>
      </Stack>
    </FormControl>
  );
};
