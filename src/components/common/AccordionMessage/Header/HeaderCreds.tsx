import UnfoldLess from "@mui/icons-material/UnfoldLess";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Add from "@mui/icons-material/Add";

interface Props {
  title: string;
  isExpanded: boolean;
}

function HeaderCreds({ title, isExpanded }: Props) {
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
        </Stack>
      </Stack>

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

export default HeaderCreds;
