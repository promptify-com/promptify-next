import React from "react";
import {
  Box,
  Grid,
  IconButton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import SearchIcon from "@mui/icons-material/Search";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import useToken from "@/hooks/useToken";
import SearchBar from "@/components/explorer/SearchBar";
import { SearchDialog } from "./SearchDialog";
import { useGetCurrentUserQuery } from "@/core/api/user";
import { FetchLoading } from "@/components/FetchLoading";
import { ProfileDropDown } from "@/components/ProfileMenu";

interface Props {
  transparent?: boolean;
  fixed?: boolean;
  keyWord?: string;
  setKeyWord?: React.Dispatch<React.SetStateAction<string>>;
  handleKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
}

const Login = () => {
  const router = useRouter();
  return (
    <Grid onClick={() => router.push("/signin")}>
      <Typography
        sx={{
          width: "54px",
          height: "26px",
          fontFamily: "Poppins",
          fontStyle: "normal",
          fontWeight: 500,
          fontSize: "15px",
          lineHeight: "26px",
          letterSpacing: "0.46px",
          color: "onBackground",
          flex: "none",
          order: 1,
          flexGrow: 0,
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      >
        Sign In
      </Typography>
    </Grid>
  );
};

export const Header: React.FC<Props> = ({
  transparent = false,
  fixed = false,
  keyWord = "",
  setKeyWord,
}) => {
  const token = useToken();
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery(token);

  const router = useRouter();
  const [isMenuShown, setIsMenuShown] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const menuAnchorRef = React.useRef<HTMLDivElement | null>(null);
  const [drawerState, setDrawerState] = React.useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setDrawerState(open);
    };

  const handleInputFocus = () => {
    setOpen(true);
  };

  return (
    <Grid width={"100%"}>
      <Box
        width="100%"
        sx={{
          bgcolor: transparent ? "transparent" : "surface.3",
          position: fixed ? "fixed" : "relative",
          zIndex: 1000,
          top: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "90px",
        }}
      >
        <Grid
          sx={{
            justifyContent: "space-between",
            display: "flex",
            width: "100%",
            padding: { xs: "1em 0 0 1em", md: "24px 33px 16px 32px" },
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Box
            display={{ xs: "none", sm: "flex" }}
            sx={{
              flex: 1,
              alignItems: "center",
              position: "relative",
            }}
            onClick={handleInputFocus}
          >
            <SearchBar keyWord={keyWord} setKeyWord={setKeyWord} />
            <SearchDialog
              open={open}
              setOpen={setOpen}
              keyWord={keyWord}
              setKeyWord={setKeyWord}
            />
          </Box>

          <Box
            sx={{
              display: "-webkit-box",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Box display={{ xs: "flex", sm: "none" }}>
              <IconButton
                onClick={() => {
                  setOpen(true);
                }}
                size="large"
                sx={{
                  border: "none",
                }}
              >
                <SearchIcon />
              </IconButton>
            </Box>
            <Box display={"flex"} alignContent={"start"}>
              {userLoading ? (
                <FetchLoading />
              ) : (
                <Box>
                  {user && token ? (
                    <Typography
                      ref={menuAnchorRef}
                      onClick={() => setIsMenuShown(!isMenuShown)}
                      sx={{
                        bgcolor: "black",
                        mt: { xs: 1, sm: 0 },
                        borderRadius: { xs: "24px", sm: "36px" },
                        width: { xs: "24px", sm: "40px" },
                        padding: "1px",
                        height: { xs: "24px", sm: "40px" },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        fontFamily: "Poppins",
                        fontStyle: "normal",
                        textAlign: "center",
                        fontWeight: 400,
                        fontSize: { xs: "12px", sm: "20px" },
                        lineHeight: "20px",
                        letterSpacing: "0.14px",
                        color: "#FFFFFF",
                        zIndex: 1,
                      }}
                    >
                      {user?.first_name && user?.last_name
                        ? `${user?.first_name[0]?.toUpperCase()}${user?.last_name[0]?.toUpperCase()}`
                        : user?.username[0]?.toUpperCase()}
                    </Typography>
                  ) : (
                    <Box display={"flex"} alignItems={"center"} gap={"16px"}>
                      <Login />
                      <Grid
                        onClick={() =>
                          router.push({
                            pathname: "/signin",
                            query: { from: "signup" },
                          })
                        }
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "8px 22px",
                          width: "105px",
                          height: "42px",
                          background: "#3B4050",
                          boxShadow:
                            "0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
                          borderRadius: "100px",
                          flex: "none",
                          order: 1,
                          flexGrow: 0,
                          cursor: "pointer",

                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            width: "61px",
                            height: "26px",
                            fontFamily: "Poppins",
                            fontStyle: "normal",
                            fontWeight: 500,
                            fontSize: "15px",
                            lineHeight: "26px",
                            letterSpacing: "0.46px",
                            color: "#FFFFFF",
                            flex: "none",
                            order: 1,
                            flexGrow: 0,
                          }}
                        >
                          Sign Up
                        </Typography>
                      </Grid>
                    </Box>
                  )}
                </Box>
              )}
              <Box display={{ xs: "flex", sm: "none" }}>
                <IconButton
                  // onClick={fetchTemplates}
                  onClick={() => setDrawerState((prev) => !prev)}
                  size="large"
                  sx={{
                    border: "none",
                  }}
                >
                  <MenuRoundedIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <ProfileDropDown
            user={user}
            open={isMenuShown}
            onToggle={() => setIsMenuShown(!isMenuShown)}
            onClose={() => setIsMenuShown(false)}
            anchorElement={menuAnchorRef.current}
          />
          <SwipeableDrawer
            anchor={"top"}
            open={drawerState}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                width: "auto",
                mt: "65px",
                ml: "2rem",
                mb: "65px",
              }}
              role="presentation"
            >
              <Typography fontSize={14} pt={"1rem"} color="grey">
                Explore
              </Typography>

              <Box
                pt={"1rem"}
                onClick={() => {
                  router.push({
                    pathname: `/explorer/details`,
                    query: {
                      category: "All directions",
                    },
                  });
                  setDrawerState(false);
                }}
              >
                <Typography fontSize={24}>Templates</Typography>
              </Box>
              <Box
                pt={"1rem"}
                onClick={() => {
                  router.push({
                    pathname: `/explorer/details`,
                    query: {
                      category: "All directions",
                    },
                  });
                  setDrawerState(false);
                }}
              >
                <Typography fontSize={24}>Collections</Typography>
              </Box>

              <Typography fontSize={14} pt={"1rem"} color="grey">
                Learn
              </Typography>

              <Box
                pt={"1rem"}
                onClick={() => {
                  router.push("/");
                  setDrawerState(false);
                }}
              >
                <Typography fontSize={24}>Blog</Typography>
              </Box>
              <Box
                pt={"1rem"}
                onClick={() => {
                  router.push("/");
                  setDrawerState(false);
                }}
              >
                <Typography fontSize={24}>Collections</Typography>
              </Box>
            </Box>
          </SwipeableDrawer>
        </Grid>
      </Box>
    </Grid>
  );
};
