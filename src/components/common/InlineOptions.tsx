import React, { useState } from "react";
import { Box, Chip, Popover, Stack } from "@mui/material";

interface IOption {
  id: number | string | undefined;
  label: string;
}
interface Props {
  options?: IOption[];
  color?: string;
  bgcolor?: string;
  onChoose?: (option: IOption) => void;
}

export const InlineOptions: React.FC<Props> = ({
  options,
  color = "#9C27B0",
  bgcolor = "#F3E5F5",
  onChoose = () => {},
}) => {
  const [showMore, setShowMore] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
    setShowMore(false);
  };

  const ChipStyles = {
    bgcolor: bgcolor,
    color: color,
    fontSize: 12,
    cursor: "pointer",
  };

  const OptionChip = (option: IOption) => (
    <Chip
      label={option.label}
      sx={ChipStyles}
      onClick={() => {
        onChoose(option);
        handleClose();
      }}
      size="small"
    />
  );

  if (!!!options) return;

  return (
    <>
      {options.slice(0, 3).map((option, i) => (
        <OptionChip
          key={i}
          id={option.id}
          label={option.label}
        />
      ))}
      {options.length > 3 && (
        <>
          <Chip
            label="4"
            onClick={e => {
              setAnchorEl(e.currentTarget);
              setShowMore(true);
            }}
            sx={ChipStyles}
            size="small"
          />
          <Popover
            open={showMore}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Stack
              alignItems={"flex-start"}
              p={1}
              gap={0.5}
            >
              {options.slice(3).map((option, i) => (
                <OptionChip
                  key={i}
                  id={option.id}
                  label={option.label}
                />
              ))}
            </Stack>
          </Popover>
        </>
      )}
    </>
  );
};
