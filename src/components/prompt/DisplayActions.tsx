import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ClickAwayListener,
  Collapse,
  Grow,
  IconButton,
  InputBase,
  Paper,
  Popper,
  Stack,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  FeedOutlined,
  ArrowDropUp,
  ArrowDropDown,
  Undo,
  Redo,
  Close,
  InfoOutlined,
} from "@mui/icons-material";
import { SubjectIcon } from "@/assets/icons/SubjectIcon";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import { ExecutionsTabs } from "./ExecutionsTabs";
import SavedSpark from "@/assets/icons/SavedSpark";
import DraftSpark from "@/assets/icons/DraftSpark";
import ShareIcon from "@/assets/icons/ShareIcon";

interface Props {
  executions: TemplatesExecutions[];
  selectedExecution: TemplatesExecutions | null;
  setSelectedExecution: (exec: TemplatesExecutions) => void;
  showSearchBar?: boolean;
  onSearch?: (text: string) => void;
  onOpenExport: () => void;
}

export const DisplayActions: React.FC<Props> = ({
  executions,
  selectedExecution,
  setSelectedExecution,
  showSearchBar,
  onSearch = () => {},
  onOpenExport,
}) => {
  const { palette } = useTheme();

  const [execsDropAnchor, setExecsDropAnchor] = useState<HTMLElement | null>(null);
  const [searchShown, setSearchShown] = useState(false);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    onSearch(searchText);
  }, [searchText]);

  useEffect(() => {
    if (!searchText) return;

    if (searchShown) {
      onSearch(searchText);
    } else {
      onSearch("");
    }
  }, [searchShown]);

  const SearchInput = (direction: "right" | "left") => (
    <Stack
      direction={"row"}
      alignItems={"center"}
    >
      <Collapse
        orientation="horizontal"
        in={searchShown}
        sx={{ order: direction === "right" ? 1 : 0 }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={1}
          sx={{
            position: "sticky",
            top: 0,
            right: 0,
            bgcolor: "surface.2",
            p: "5px 10px",
            borderRadius: "99px",
            color: "onSurface",
          }}
        >
          <SubjectIcon />
          <InputBase
            id="exec"
            placeholder={"Search..."}
            fullWidth
            sx={{
              flex: 1,
              fontSize: 13,
              fontWeight: 400,
            }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </Stack>
      </Collapse>
      <IconButton
        sx={{ ...iconButtonStyle }}
        onClick={() => setSearchShown(!searchShown)}
      >
        {searchShown ? <Close /> : <SearchIcon />}
      </IconButton>
    </Stack>
  );

  const ExecutionsSelect = (
    <Button
      sx={{
        width: "100%",
        maxWidth: "336px",
        color: "onSurface",
        fontSize: 13,
        fontWeight: 500,
        justifyContent: "space-between",
        ":hover": { bgcolor: "action.hover" },
        ".MuiButton-startIcon": { m: 0 },
      }}
      startIcon={selectedExecution?.is_favorite ? <SavedSpark /> : <DraftSpark />}
      endIcon={Boolean(execsDropAnchor) ? <ArrowDropUp /> : <ArrowDropDown />}
      variant={"text"}
      onClick={e => setExecsDropAnchor(e.currentTarget)}
    >
      <Box sx={{ width: "80%", overflow: "hidden", textAlign: "left" }}>
        {selectedExecution?.title || "Choose Spark..."}
      </Box>
    </Button>
  );

  return (
    <Box
      sx={{
        position: { xs: "fixed", md: "sticky" },
        top: { xs: "auto", md: 0 },
        bottom: { xs: "74px", md: "auto" },
        left: 0,
        right: 0,
        zIndex: 999,
        bgcolor: "surface.1",
        p: { md: "16px 16px 16px 24px" },
        borderRadius: "24px 24px 0 0",
        borderBottom: { xs: `1px solid ${palette.surface[5]}`, md: "none" },
        boxShadow: {
          xs: "0px -8px 40px 0px rgba(93, 123, 186, 0.09), 0px -8px 10px 0px rgba(98, 98, 107, 0.03)",
          md: "0px -1px 0px 0px #ECECF4 inset",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        {/* Big screen header */}
        <Stack
          display={{ xs: "none", md: "flex" }}
          direction={"row"}
          alignItems={"center"}
          gap={1}
        >
          <Stack
            flex={1}
            direction={"row"}
            alignItems={"center"}
            gap={1}
          >
            {ExecutionsSelect}
            {!!selectedExecution && !selectedExecution?.is_favorite && (
              <Typography
                sx={{
                  p: "4px 8px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: `${alpha(palette.onSurface, 0.5)}`,
                  fontSize: 12,
                  fontWeight: 400,
                  svg: {
                    fontSize: 16,
                  },
                }}
              >
                <InfoOutlined /> This spark not saved yet...
              </Typography>
            )}
          </Stack>

          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
            ml={"auto"}
          >
            {/* 
              TODO: https://github.com/ysfbsf/promptify-next/issues/275
              {SearchInput("left")} 
            */}
            {selectedExecution?.id && (
              <Tooltip title="Export">
                <IconButton
                  onClick={onOpenExport}
                  sx={{
                    border: "none",
                    "&:hover": {
                      bgcolor: "surface.2",
                    },
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>

        {/* Small screen header */}
        <Box
          display={"flex"}
          alignItems={"center"}
        >
          <Stack
            flex={1}
            display={{ md: "none" }}
            direction={"row"}
            alignItems={"center"}
            gap={1}
            p={"8px 16px"}
          >
            {ExecutionsSelect}
          </Stack>
          <Stack
            display={{ md: "none" }}
            direction={"row"}
            alignItems={"center"}
            gap={1}
            p={"8px 16px"}
          >
            {/* 
              TODO: https://github.com/ysfbsf/promptify-next/issues/275
              {showSearchBar && SearchInput("right")}
            */}

            <Tooltip title="Export">
              <IconButton
                onClick={onOpenExport}
                sx={{
                  border: "none",
                  "&:hover": {
                    bgcolor: "surface.2",
                  },
                }}
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <Popper
          open={Boolean(execsDropAnchor)}
          anchorEl={execsDropAnchor}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: "center top" }}
            >
              <Paper
                sx={{
                  bgcolor: "surface.1",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow:
                    "0px 10px 13px -6px rgba(0, 0, 0, 0.20), 0px 20px 31px 3px rgba(0, 0, 0, 0.14), 0px 8px 38px 7px rgba(0, 0, 0, 0.12)",
                }}
                elevation={0}
              >
                <ClickAwayListener onClickAway={() => setExecsDropAnchor(null)}>
                  <Box>
                    <ExecutionsTabs
                      executions={executions}
                      selectedExecution={selectedExecution}
                      chooseExecution={exec => {
                        setSelectedExecution(exec);
                        setExecsDropAnchor(null);
                      }}
                    />
                  </Box>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    </Box>
  );
};

const iconButtonStyle = {
  border: "none",
  p: "8px",
  color: "onBackground",
  opacity: 0.8,
  ":hover": { opacity: 1, color: "onBackground" },
};
