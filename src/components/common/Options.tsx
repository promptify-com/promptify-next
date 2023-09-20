import React, { useState } from "react";
import { Chip, Grid, Popover, Stack } from "@mui/material";

interface IOption {
  id: number | undefined;
  label: string;
}
interface Props {
  variant: "horizontal" | "vertical";
  type: "node" | "input";
  options: IOption[];
  onChoose: (option: IOption) => void;
}

export const Options: React.FC<Props> = ({ options, onChoose, variant, type }) => {
  const [showMore, setShowMore] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
    setShowMore(false);
  };

  const ChipStyles = {
    bgcolor: type === "input" ? "#E0F2F1" : "#F3E5F5",
    color: type === "input" ? "#00897B" : "#9C27B0",
    fontSize: 12,
    cursor: "pointer",
  };

  if (!options.length) return;

  return (
    <>
      {variant === "horizontal" &&
        options.slice(0, 3).map((option, i) => (
          <Chip
            key={i}
            label={option.label}
            sx={ChipStyles}
            onMouseDown={() => {
              onChoose(option);
              handleClose();
            }}
            size="small"
          />
        ))}
      {variant === "horizontal" && options.length > 3 && (
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
                <Chip
                  key={i}
                  label={option.label}
                  sx={ChipStyles}
                  onMouseDown={() => {
                    onChoose(option);
                    handleClose();
                  }}
                  size="small"
                />
              ))}
            </Stack>
          </Popover>
        </>
      )}
      {variant === "vertical" && (
        <Grid
          display={"flex"}
          flexDirection={"column"}
          gap={"8px"}
          alignItems={"start"}
        >
          {options.map((option, idx) => (
            <Chip
              key={idx}
              label={option.label}
              sx={ChipStyles}
              onMouseDown={() => {
                onChoose(option);
                handleClose();
              }}
              size="small"
            />
          ))}
        </Grid>
      )}
    </>
  );
};
