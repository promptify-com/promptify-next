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
import { IOption, IQuestion } from "@/common/types";
import { useUpdateAnswers } from "@/hooks/api/user";
import Image from "next/image";
import { Edit } from "@mui/icons-material";

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
  const [selectedOption, setSelectedOption] = useState<IOption | null>(defaultOption ?? null);
  const [isLoading, setIsLoading] = useState(false);

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

  const [setUserAnswer] = useUpdateAnswers();

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
      bgcolor={"surface.1"}
      sx={{
        border: { xs: "1px solid var(--surface-3, #ECECF4)", md: "none" },
      }}
      width={"100%"}
      justifyContent="space-between"
      // mt="2rem"
      alignItems="center"
      padding=" 16px"
      borderRadius={"16px"}
    >
      <Grid
        display={"flex"}
        sx={{
          dispaly: "flex",
          flexDirection: "row",
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
            <Grid item xs={12} md={6}>
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
              {selectedOption && (
                <Image
                  src={require(`../../assets/images/animals/${selectedOption?.text}.jpg`)}
                  alt={"Unicorn"}
                  loading="lazy"
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
                {selectedOption?.text}
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
              <CircularProgress sx={{ color: "black" }} size={24} />
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
              transformOrigin:
                placement === "left-end" ? "left top" : "left top",
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
                            src={require(`../../assets/images/animals/${option.text}.jpg`)}
                            alt={"Unicorn"}
                            loading="lazy"
                            width={45}
                            height={45}
                            style={{ borderRadius: "45px" }}
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
