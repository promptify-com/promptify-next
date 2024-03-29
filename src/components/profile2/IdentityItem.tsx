import MenuItem from "@mui/material/MenuItem";
import React, { useEffect, useState } from "react";
import type { IOption, IQuestion } from "@/common/types";
import { useUpdateAnswers } from "@/hooks/api/user";
import Image from "@/components/design-system/Image";
import defaultAvatar from "@/assets/images/default-avatar.jpg";
import type { SelectChangeEvent } from "@mui/material";
import { StackedSelect } from "@/components/common/forms/StackedSelect";
import { useAppDispatch } from "@/hooks/useStore";
import { setToast } from "@/core/store/toastSlice";

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
  const dispatch = useAppDispatch();
  const [selectedOption, setSelectedOption] = useState(defaultAnswer?.text || "");
  const [setUserAnswer] = useUpdateAnswers();

  const options = question.options;

  const handleOptionSelection = async (e: SelectChangeEvent) => {
    const _option = selectedOption;
    const option = options.find(opt => opt.text === e.target.value);

    if (!option || option.text === selectedOption) return;

    setSelectedOption(option.text);

    try {
      await setUserAnswer(question, option.id);
      dispatch(setToast({ message: "Identity was successfully updated", severity: "info" }));
    } catch (err) {
      setSelectedOption(_option);
      dispatch(setToast({ message: "Something went wrong please try again", severity: "error" }));
    }
  };

  useEffect(() => setSelectedOption(defaultAnswer?.text || ""), [defaultAnswer]);

  return (
    <StackedSelect
      label={question.text}
      value={selectedOption}
      onChange={handleOptionSelection}
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
          >
            <Image
              src={optionSrc}
              alt={option.text}
              priority={false}
              width={40}
              height={40}
              style={{ borderRadius: "50%" }}
            />
            {option.text}
          </MenuItem>
        );
      })}
    </StackedSelect>
  );
};
