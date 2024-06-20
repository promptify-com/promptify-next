import Close from "@mui/icons-material/Close";
import UnfoldLess from "@mui/icons-material/UnfoldLess";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Add from "@mui/icons-material/Add";

import { initialState, setAnswers } from "@/core/store/chatSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import type { MessageType } from "@/components/Prompt/Types/chat";

interface Props {
  title: string;
  type: MessageType;
  isExpanded: boolean;
}

function HeaderForm({ title, type, isExpanded }: Props) {
  const dispatch = useAppDispatch();

  const answers = useAppSelector(state => state.chat?.answers ?? initialState.answers);
  return (
    <Stack
      direction={"row"}
      gap={"8px"}
      width={"100%"}
      alignItems={"center"}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={"8px"}
        flex={1}
        width={"100%"}
      >
        <Box
          position={"relative"}
          mt={0.5}
          sx={{
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "8px",
            border: `1px dashed`,
            borderColor: "primary.main",
            bgcolor: "surface.5",
            color: "primary.main",
          }}
        >
          <Add
            sx={{
              fontSize: 32,
            }}
          />
          <Box
            position={"absolute"}
            width={"11px"}
            height={"11px"}
            borderRadius={"4px 0px 8px 0px"}
            bgcolor={"surface.1"}
            bottom={0}
            right={0}
          />
        </Box>

        <Stack
          flex={1}
          direction={"column"}
          gap={"2px"}
        >
          <Typography
            fontSize={{ xs: "14px", md: "15px" }}
            lineHeight={"120%"}
            display={"flex"}
            flex={1}
            alignItems={"center"}
            justifyContent={{ xs: "space-between", md: "start" }}
            letterSpacing={"0.2px"}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 10, md: 12 },
              fontWeight: 400,
              lineHeight: "143%",
              letterSpacing: "0.17px",
              opacity: 0.7,
            }}
          >
            About 360s generation time
          </Typography>
        </Stack>
      </Stack>

      {isExpanded && (
        <Stack
          direction={"row"}
          gap={1}
          alignItems={"center"}
        >
          {!!answers.length && (
            <Button
              onClick={e => {
                e.stopPropagation();
                dispatch(setAnswers([]));
              }}
              endIcon={<Close sx={{ fontSize: { xs: 3 }, ml: { xs: -1, md: 0 } }} />}
              sx={{
                mr: { xs: -2, md: 0 },
                height: "22px",
                p: { xs: "8px", md: "15px" },
                color: "onSurface",
                fontSize: { xs: 11, md: 15 },
                fontWeight: 500,
                ":hover": {
                  bgcolor: "action.hover",
                },
              }}
              variant="text"
            >
              Clear
            </Button>
          )}
        </Stack>
      )}
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={"8px"}
      >
        <Stack>
          {isExpanded ? (
            <Tooltip
              title="Collapse"
              arrow
              placement="top"
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -5],
                    },
                  },
                ],
              }}
            >
              <IconButton
                sx={{
                  border: "none",
                  ":hover": {
                    bgcolor: "surface.4",
                  },
                }}
              >
                <UnfoldLess fontSize="inherit" />
              </IconButton>
            </Tooltip>
          ) : (
            <Button
              variant="text"
              sx={{
                height: "34px",
                p: "15px",
                color: "onSurface",
                fontSize: 13,
                fontWeight: 500,
                ":hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              Expand
              <UnfoldLess
                sx={{
                  fontSize: 20,
                  ml: 1,
                }}
              />
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default HeaderForm;
