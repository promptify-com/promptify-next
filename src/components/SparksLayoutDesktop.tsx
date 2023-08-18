import { FC, useState, useEffect } from "react";
import { red } from "@mui/material/colors";
import { Execution, TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import { ArrowDropDown, Check, CloudQueueRounded, DeleteRounded, Edit } from "@mui/icons-material";
import {
  CardMedia,
  ClickAwayListener,
  Grid,
  Grow,
  IconButton,
  Paper,
  Popper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import useTimestampConverter from "@/hooks/useTimestampConverter";
import useTruncate from "@/hooks/useTruncate";
import BaseButton from "./base/BaseButton";
import DraftSpark from "@/assets/icons/DraftSpark";
import SavedSpark from "@/assets/icons/SavedSpark";
import {
  useDeleteExecutionMutation,
  useExecutionFavoriteMutation,
  usePutExecutionTitleMutation,
} from "@/core/api/executions";

interface SparksLayoutDesktopProps {
  execution: Execution;
  template: TemplateExecutionsDisplay;
}

type PopperType = "rename" | "delete";

export const SparksLayoutDesktop: FC<SparksLayoutDesktopProps> = ({ execution, template }) => {
  const [updateExecution, { isError }] = usePutExecutionTitleMutation();
  const [deleteExecution, { isError: isDeleteExecutionError }] = useDeleteExecutionMutation();
  const [favoriteExecution, { isError: isFavoriteExecutionError }] = useExecutionFavoriteMutation();

  const { truncate } = useTruncate();
  const { convertedTimestamp } = useTimestampConverter();
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [popperType, setPopperType] = useState<PopperType>("rename");
  const [executionTitle, setExecutionTitle] = useState("");

  useEffect(() => {
    if (execution && execution.title !== "") {
      setExecutionTitle(execution.title);
    } else setExecutionTitle("");
  }, []);

  const handleOpenEditDropdown = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(true);
    setPopperType("rename");
    setAnchorElement(event.currentTarget);
  };

  const handleOpenDeleteDropdown = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(true);
    setPopperType("delete");
    setAnchorElement(event.currentTarget);
  };

  function onCloseDropdown() {
    setOpen(false);
    setAnchorElement(null);
  }

  const handleUpdateExecution = () => {
    let data = {
      title: executionTitle,
    };
    updateExecution({ id: execution.id, data }).unwrap();
    if (!isDeleteExecutionError) {
      onCloseDropdown();
    }
  };

  const handleDeleteExecution = () => {
    deleteExecution(execution.id).unwrap();
    if (!isError) {
      onCloseDropdown();
    }
  };

  const handleSaveExecution = () => {
    favoriteExecution(execution.id);
  };

  return (
    <Grid
      container
      display={{ xs: "none", md: "flex" }}
      bgcolor={"surface.1"}
      alignItems={"center"}
      position={"relative"}
      className="sparkContainer"
    >
      <Grid
        item
        sx={{ width: "49px" }}
        padding={"16px 8px"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {execution.is_favorite ? <SavedSpark /> : <DraftSpark />}
      </Grid>
      <Grid
        item
        md={2}
        lg={3}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography
          fontSize={13}
          fontWeight={500}
          color={"onSurface"}
          lineHeight={"18.59px"}
          letterSpacing={"0.17px"}
        >
          {truncate(execution.title, { length: 40 })}
        </Typography>
        <Tooltip title="Rename">
          <IconButton
            onClick={handleOpenEditDropdown}
            sx={{
              border: "none",
              "&:hover": {
                bgcolor: "surface.2",
              },
            }}
          >
            <Edit
              className="cellHovered"
              sx={{ opacity: 0.25, fontSize: "16px" }}
            />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid
        item
        md={4}
        padding={"16px"}
        display={"flex"}
        gap={1}
        alignItems={"center"}
      >
        <CardMedia
          sx={{
            zIndex: 1,
            borderRadius: "8px",
            width: { xs: "41px", sm: "41px" },
            height: { xs: "73px", sm: "31px" },
            objectFit: "cover",
          }}
          component="img"
          image={template.thumbnail}
          alt={template.title}
        />
        <Typography
          fontSize={13}
          fontWeight={500}
          color={"onSurface"}
          lineHeight={"18.59px"}
          letterSpacing={"0.17px"}
        >
          {truncate(template.title, { length: 40 })}
        </Typography>
      </Grid>

      <Grid
        item
        xs={2}
        padding={{ lg: "16px" }}
        display={"flex"}
        gap={1}
        alignItems={"center"}
      >
        <Typography
          fontSize={12}
          fontWeight={400}
          color={"onSurface"}
          lineHeight={"17.16px"}
          letterSpacing={"0.17px"}
          sx={{ opacity: 0.5 }}
        >
          {convertedTimestamp(execution.created_at)}
        </Typography>
      </Grid>
      <Grid
        item
        xs={2}
        padding={{ lg: "16px" }}
        display={"flex"}
        gap={1}
        alignItems={"center"}
      >
        <BaseButton
          variant="text"
          color="primary"
          className="cellHovered"
          sx={{ opacity: 0.25 }}
        >
          Export <ArrowDropDown sx={{ ml: 1 }} />
        </BaseButton>
      </Grid>

      <Grid
        item
        xs={2}
        padding={"16px"}
        position={"absolute"}
        right={0}
        display={"flex"}
        justifyContent={"end"}
        alignItems={"center"}
      >
        {!execution.is_favorite && (
          <Tooltip title="Save">
            <IconButton
              onClick={() => handleSaveExecution()}
              sx={{
                border: "none",
                "&:hover": {
                  bgcolor: "surface.2",
                },
              }}
            >
              <CloudQueueRounded
                className="cellHovered"
                sx={{ opacity: 0.25, fontSize: "18px" }}
              />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Delete">
          <IconButton
            onClick={handleOpenDeleteDropdown}
            sx={{
              border: "none",
              "&:hover": {
                bgcolor: "surface.2",
              },
            }}
          >
            <DeleteRounded
              className="cellHovered"
              sx={{ opacity: 0.25, fontSize: "16px" }}
            />
          </IconButton>
        </Tooltip>
      </Grid>

      {/*THIS NEEDS TO BE REFACTORED  */}

      <Popper
        open={open}
        anchorEl={anchorElement}
        placement="bottom-end"
        transition
        disablePortal
        sx={{
          zIndex: 10000,
          position: "absolute",
        }}
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: "left top",
            }}
          >
            <Paper
              sx={{
                border: "1px solid #E3E3E3",
                borderRadius: "10px",
                width: "330px",
                marginTop: "5px",
                bgcolor: "surface.1",
                overflow: "hidden",
              }}
              elevation={0}
            >
              <ClickAwayListener onClickAway={onCloseDropdown}>
                {popperType === "rename" ? (
                  <Grid
                    padding={"16px"}
                    display={"flex"}
                    flexDirection={"column"}
                    gap={"8px"}
                  >
                    <TextField
                      defaultValue={execution?.title}
                      id="standard-basic"
                      label="Rename Spark"
                      variant="standard"
                      fullWidth
                      onChange={e => setExecutionTitle(e.target.value)}
                      color="secondary"
                    />
                    <Grid
                      display={"flex"}
                      gap={"8px"}
                      paddingY={"8px"}
                      alignItems={"center"}
                    >
                      <BaseButton
                        onClick={() => handleUpdateExecution()}
                        color="custom"
                        variant="contained"
                        size="small"
                        sx={{
                          height: "30px",
                          px: 0,
                          bgcolor: "#375CA9",
                          border: "none",
                          "&:hover": {
                            bgcolor: "surface.2",
                          },
                        }}
                      >
                        <Check sx={{ fontSize: "16px", mr: "2px" }} />
                        Ok
                      </BaseButton>
                      <BaseButton
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{
                          height: "30px",
                          px: 0,
                        }}
                      >
                        Cancel
                      </BaseButton>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid
                    padding={"16px"}
                    display={"flex"}
                    flexDirection={"column"}
                    gap={"8px"}
                  >
                    <Typography
                      fontSize={"18px"}
                      fontWeight={500}
                      lineHeight={"25.74px"}
                    >
                      You really want to delete this spark permanently?
                    </Typography>
                    <Grid
                      display={"flex"}
                      gap={"8px"}
                      paddingY={"8px"}
                      alignItems={"center"}
                    >
                      <BaseButton
                        onClick={() => handleDeleteExecution()}
                        color="custom"
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: red[400],
                          height: "30px",
                          border: "none",
                          "&:hover": {
                            bgcolor: "surface.2",
                          },
                        }}
                      >
                        <DeleteRounded sx={{ fontSize: "16px", mr: "2px" }} />
                        Yes, Delete
                      </BaseButton>
                      <BaseButton
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{
                          height: "30px",
                          px: 0,
                        }}
                      >
                        Cancel
                      </BaseButton>
                    </Grid>
                  </Grid>
                )}
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Grid>
  );
};
