import MenuItem from "@mui/material/MenuItem";
import React, { useEffect, useState } from "react";
import type { IOption, IQuestion } from "@/common/types";
import { useUpdateAnswers } from "@/hooks/api/user";
import Image from "@/components/design-system/Image";
import defaultAvatar from "@/assets/images/default-avatar.jpg";
import type { SelectChangeEvent } from "@mui/material";
import { StackedSelect } from "@/components/common/forms/StackedSelect";

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
  const [setUserAnswer] = useUpdateAnswers();

  const options = question.options;

  const handleOptionSelection = async (e: SelectChangeEvent) => {
    const option = options.find(opt => opt.text === e.target.value);

    if (!option || option.text === selectedOption) return;

    setSelectedOption(option.text);

    await setUserAnswer(question, option.id);
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
