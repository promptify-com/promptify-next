import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { IOption, IQuestion } from "@/common/types";
import { useUpdateAnswers } from "@/hooks/api/user";
import Image from "../design-system/Image";
import { Edit } from "@mui/icons-material";
import defaultAvatar from "@/assets/images/default-avatar.jpg";

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
  defaultOption: IOption | null;
}

export const IdentityItem: React.FC<IProps> = ({ question, defaultOption }) => {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<IOption>();
  const [isLoading, setIsLoading] = useState(false);
  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };
  const prevOpen = React.useRef(open);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [setUserAnswer] = useUpdateAnswers();
  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };
  const handleOptionSelection = async (e: React.SyntheticEvent, option: IOption) => {
    setSelectedOption(option);
    handleClose(e);

    if (option.id === selectedOption?.id) return;

    setIsLoading(true);
    await setUserAnswer(question, option.id)
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (prevOpen.current && !open) {
      anchorRef.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const _selectedOption = selectedOption ?? defaultOption;

  const options = question.options.filter(option => option.id !== _selectedOption?.id);

  const selectedOptionSrc =
    _selectedOption?.text && AVAILABLE_OPTION_IMGS.includes(_selectedOption.text)
      ? `/assets/images/animals/${_selectedOption.text}.jpg`
      : defaultAvatar;

  return (
    <Box
      key={question.id}
      display="flex"
      bgcolor={"surface.1"}
      sx={{
        border: { xs: "1px solid var(--surface-3, #ECECF4)", md: "none" },
      }}
      width={"100%"}
      justifyContent="space-between"
      alignItems="center"
      padding=" 16px"
      borderRadius={"16px"}
    >
      <Grid
        display={"flex"}
        sx={{
          alignItem: "center",
          width: "100%",
          gap: "1em",
        }}
      >
        <Grid
          container
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width={"100%"}
        >
          <Grid
            item
            xs={9}
            md={10}
            display={"flex"}
            flexDirection={{ xs: "column", md: "row" }}
            alignItems={{ xs: "start", md: "center" }}
            gap={2}
          >
            <Grid
              item
              xs={12}
              md={6}
            >
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: 500,
                  fontSize: { xs: 14, md: 16 },
                  lineHeight: "150%",
                  display: "flex",
                  alignItems: "center",
                  letterSpacing: "0.15px",
                  color: "onSurface",
                }}
              >
                {question?.text}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              md={5}
              display={"flex"}
              alignItems={"center"}
              gap={1}
            >
              {_selectedOption && (
                <Image
                  src={`${selectedOptionSrc}`}
                  alt={"Unicorn"}
                  priority={false}
                  width={45}
                  height={45}
                  style={{ borderRadius: "45px" }}
                />
              )}
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
                  color: "onSurface",
                }}
              >
                {_selectedOption?.text}
              </Typography>
            </Grid>
          </Grid>
          <IconButton
            sx={{
              border: "0px solid",
              cursor: "pointer",
              color: "black",
            }}
            onClick={handleToggle}
            ref={anchorRef}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress
                sx={{ color: "black" }}
                size={24}
              />
            ) : (
              <Edit sx={{ fontSize: "44px" }} />
            )}
          </IconButton>
        </Grid>
      </Grid>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
        sx={{ zIndex: 2 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === "left-end" ? "left top" : "left top",
            }}
          >
            <Paper
              sx={{
                width: "300px",
                border: "1px solid #E3E3E3",
                borderRadius: "10px",
              }}
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
                      fontSize={16}
                      lineHeight={"24px"}
                      color={"onSurface"}
                      whiteSpace={"pre-wrap"}
                    >
                      {question.text}
                    </Typography>
                  </MenuItem>
                  {options.map(option => {
                    const optionSrc =
                      option?.text && AVAILABLE_OPTION_IMGS.includes(option.text)
                        ? `/assets/images/animals/${option.text}.jpg`
                        : defaultAvatar;

                    return (
                      <MenuItem
                        onClick={e => handleOptionSelection(e, option)}
                        sx={{
                          borderTop: "1px solid #E3E3E3",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          alignContent: "center",
                        }}
                        key={option.id}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                        >
                          <Image
                            src={optionSrc}
                            alt={"Unicorn"}
                            priority={false}
                            width={45}
                            height={45}
                            style={{ borderRadius: "45px" }}
                          />
                          <Typography
                            fontWeight={500}
                            fontSize="0.9rem"
                            ml="1rem"
                            color={"#000"}
                          >
                            {option.text}
                          </Typography>
                        </Box>
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
