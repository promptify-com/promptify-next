import {
  Box,
  CircularProgress,
  ClickAwayListener,
  Grid,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Check } from "@/assets/icons";
import { EditPen } from "@/assets/icons/EditPen";
import UnicornLeft from "@/assets/images/UnicornLeft.png";
import { IOption, IQuestion } from "@/common/types";
import { useUpdateAnswers } from "@/hooks/api/user";
import Image from "next/image";

interface IProps {
  question: IQuestion;
  defaultOption: IOption | null;
  index: number;
  length: number;
}

export const IdentityItem: React.FC<IProps> = ({
  length,
  question,
  index,
  defaultOption,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<IOption | null>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (defaultOption) {
      setSelectedOption(defaultOption);
    }
  }, [defaultOption]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = React.useRef(open);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    if (prevOpen.current && !open) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [setUserAnswer, _, isAnswering] = useUpdateAnswers();

  const handleOptionSelection = async (
    e: React.SyntheticEvent,
    option: IOption
  ) => {
    setSelectedOption(option);
    handleClose(e);
    setIsLoading(true);
    await setUserAnswer(question, option.id)
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  };
  return (
    <Box
      key={question.id}
      display="flex"
      borderBottom={length - 1 !== index ? "1px solid #c0c3cf54" : ""}
      width={{ xs: "100%", sm: "95%" }}
      justifyContent="space-between"
      // mt="2rem"
      alignItems="center"
      padding="1em 0rem"
    >
      <Grid
        display={{ xs: "flex", sm: "none" }}
        sx={{
          dispaly: "flex",
          flexDirection: "row",
          alignItem: "center",
          width: "90%",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "150%",
            display: "flex",
            alignItems: "center",
            letterSpacing: "0.15px",
            color: "##1B1B1E",
            width: "70%",
          }}
        >
          {question?.text?.length > 16
            ? question?.text?.slice(0, 16) + "..."
            : question?.text}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "150%",
            display: "flex",
            alignItems: "center",
            letterSpacing: "0.15px",
            color: "#1B1B1E",
            width: "30%",
          }}
        >
          {!!selectedOption?.text && selectedOption?.text?.length > 13
            ? selectedOption?.text?.slice(0, 13) + "..."
            : selectedOption?.text}
        </Typography>
      </Grid>
      <Grid
        display={{ xs: "none", sm: "flex" }}
        sx={{
          dispaly: "flex",
          flexDirection: "row",
          alignItem: "center",
          width: "90%",
          gap: "1em",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "150%",
            display: "flex",
            alignItems: "center",
            letterSpacing: "0.15px",
            color: "##1B1B1E",
            width: "55%",
          }}
        >
          {question?.text}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "150%",
            display: "flex",
            alignItems: "center",
            letterSpacing: "0.15px",
            color: "#1B1B1E",
            width: "30%",
          }}
        >
          {selectedOption?.text}
        </Typography>
      </Grid>

      <IconButton
        sx={{
          border: "0px solid",
          cursor: "pointer",
          color: "rgba(55, 92, 169, 1)",
          width: "10%",
        }}
        onClick={handleToggle}
        ref={anchorRef}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : <EditPen />}
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="left-start"
        transition
        disablePortal
        sx={{ zIndex: 2 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "left-end" ? "left top" : "left top",
            }}
          >
            <Paper
              sx={{ border: "1px solid #E3E3E3", borderRadius: "10px" }}
              elevation={0}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  sx={{ paddingRight: "3rem", width: "100%" }}
                >
                  <MenuItem>
                    <Typography
                      fontWeight={500}
                      fontSize="1rem"
                      ml="1rem"
                      paddingY="5px"
                    >
                      {question.text}
                    </Typography>
                  </MenuItem>
                  {question.options.map((option) => {
                    return (
                      <MenuItem
                        onClick={(e) => handleOptionSelection(e, option)}
                        sx={{
                          borderTop: "1px solid #E3E3E3",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          alignContent: "center",
                        }}
                        key={option.id}
                      >
                        <Box display="flex" alignItems="center">
                          <Image
                            src={UnicornLeft}
                            alt={"Unicorn"}
                            loading="lazy"
                            width={45}
                          />
                          <Typography
                            fontWeight={500}
                            fontSize="0.9rem"
                            ml="1rem"
                            color={
                              option.id === selectedOption?.id
                                ? "#0F6FFF"
                                : "#000"
                            }
                          >
                            {option.text}
                          </Typography>
                        </Box>

                        {option.id === selectedOption?.id && <Check />}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};
