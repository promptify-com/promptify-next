import React, { ReactNode } from "react";
import {
  Avatar,
  Box,
  ClickAwayListener,
  Grid,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  SwipeableDrawer,
  Typography,
} from "@mui/material";

import { Descrip } from "../../../assets/icons/Descrip";
import { LogoApp } from "../../../assets/icons/LogoApp";
import { Collection } from "../../../assets/icons/collection";
import { Prompt } from "../../../assets/icons/prompts";
import { Setting } from "../../../assets/icons/setting";
import { useGetCurrentUser } from "../../../hooks/api/user";
import useLogout from "../../../hooks/useLogout";
import useSetUser from "../../../hooks/useSetUser";
import useToken from "../../../hooks/useToken";
import useUser from "../../../hooks/useUser";
import SearchBar from "@/pages/_components/SearchBar";
import SearchIcon from "@mui/icons-material/Search";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { LogoAppMobile } from "../../../assets/icons/LogoAppMobile";
import { SearchDialog } from "./SearchDialog";
import { useRouter } from "next/router";
import Link from "next/link";

interface Props {
  transparent?: boolean;
  fixed?: boolean;
  keyWord?: string;
  setKeyWord?: React.Dispatch<React.SetStateAction<string>>;
  handleKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
}
interface MenuType {
  id: number;
  icon: ReactNode;
  name: string;
}
const Menu: MenuType[] = [
  {
    id: 1,
    icon: <Prompt />,
    name: "My Prompts",
  },
  {
    id: 2,
    icon: <Collection />,
    name: "My Collections",
  },
  {
    id: 3,
    icon: <Setting />,
    name: "Settings",
  },
];

export const Header: React.FC<Props> = ({
  transparent = false,
  fixed = false,
  keyWord = "",
  setKeyWord,
}) => {
  const logout = useLogout();
  const setUser = useSetUser();
  const [user] = useGetCurrentUser();

  const userName = useUser();
  const token = useToken();
  const router = useRouter();
  const [isMenuShown, setIsMenuShown] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const menuAnchorRef = React.useRef<HTMLDivElement | null>(null);
  const [drawerState, setDrawerState] = React.useState(false);

  const handleLogout = () => {
    setIsMenuShown(!isMenuShown);
    logout();
    setUser(null);
  };

  const Login = () => {
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

  const handleHeaderMenu = (el: MenuType) => {
    setIsMenuShown(!isMenuShown);
    if (el.id === Menu[0].id) {
      router.push("/");
    } else if (el.id === Menu[2].id) {
      router.push("/dashboard");
    }
  };

  const handleInputFocus = () => {
    setOpen(true);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        background: transparent ? "transparent" : "#F6F5FF",
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
          padding: { xs: "1em 0em 0em 1em", sm: "1.5em 2em" },
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Box
            display={{ xs: "none", sm: "flex" }}
            mr={{ xs: "0rem", sm: "1rem" }}
          >
            <Link href="/">
              <LogoApp />
            </Link>
          </Box>
          <Box
            display={{ xs: "flex", sm: "none" }}
            mr={{ xs: "0rem", sm: "1rem" }}
          >
            <Link href="/">
              <LogoAppMobile />
            </Link>
          </Box>
          <Typography
            onClick={() => router.push("/")}
            display={{ xs: "none", sm: "flex" }}
            sx={{
              width: "58px",
              height: "24px",
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: "24px",
              alignItems: "center",
              textAlign: "center",
              color: "onBackground",
              flex: "none",
              order: 0,
              flexGrow: 0,
              cursor: "pointer",
            }}
            textAlign={{ xs: "center", sm: "start" }}
          >
            Explore
          </Typography>
          <Typography
            display={{ xs: "none", sm: "flex" }}
            fontWeight={500}
            fontSize={{ xs: "16px", sm: "16px" }}
            lineHeight={{ xs: "24px", sm: "24px" }}
            fontFamily="Poppins"
            fontStyle="normal"
            alignItems="center"
            textAlign="center"
            color="onBackground"
            width="45px"
            height="24px"
            flex="none"
            order={0}
            flexGrow={0}
            sx={{
              cursor: "pointer",
            }}
          >
            Learn
          </Typography>
        </Box>

        {!open ? (
          <Box
            onClick={handleInputFocus}
            sx={{
              width: "70%",
              maxWidth: "960px",
              alignItems: "center",
            }}
            display={{ xs: "none", sm: "flex" }}
          >
            <SearchBar from="" keyWord={keyWord} setKeyWord={setKeyWord} />
          </Box>
        ) : (
          <SearchDialog
            open={open}
            setOpen={setOpen}
            keyWord={keyWord}
            setKeyWord={setKeyWord}
          />
        )}

        <Box
          sx={{
            display: "-webkit-box",
            alignItems: "center",
            gap: "10px",
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
          {!userName && !token ? <Login /> : null}
          {!userName && !token ? (
            <Grid
              onClick={() =>
                router.push({ pathname: "/signin", query: { from: "signup" } })
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
          ) : null}

          {!!userName && !!token && (
            <Grid display={{ xs: "none", sm: "flex" }}>
              <Descrip />
            </Grid>
          )}
          {!!userName && !!token ? (
            <Typography
              ref={menuAnchorRef}
              onClick={() => setIsMenuShown(!isMenuShown)}
              sx={{
                bgcolor: "black",
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
                flex: "none",
                order: 1,
                flexGrow: 0,
                zIndex: 1,
              }}
            >
              {!!userName?.first_name && !!userName?.last_name
                ? `${userName?.first_name[0]?.toUpperCase()}${userName?.last_name[0]?.toUpperCase()}`
                : userName?.username[0]?.toUpperCase()}
            </Typography>
          ) : (
            !!token && (
              <Avatar
                alt={"name"}
                src={user?.avatar || "https://placehold.it/50x50"}
                ref={menuAnchorRef}
                onClick={() => setIsMenuShown(true)}
                sx={{ cursor: "pointer" }}
              />
            )
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
        <Popper
          open={isMenuShown}
          anchorEl={menuAnchorRef.current}
          // role={undefined}
          placement="bottom-end"
          transition
          disablePortal
          sx={{ zIndex: 2, position: "absolute" }}
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
                  border: "1px solid #E3E3E3",
                  borderRadius: "10px",
                  width: "13em",
                  marginTop: "5px",
                }}
                elevation={0}
              >
                <ClickAwayListener onClickAway={() => setIsMenuShown(false)}>
                  <Grid
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Grid
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "0.5em 0em",
                        gap: "5px",
                      }}
                    >
                      <Typography
                        sx={{
                          bgcolor: "black",
                          borderRadius: "36px",
                          width: "40px",
                          padding: "1px",
                          height: "40px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                          fontFamily: "Poppins",
                          fontStyle: "normal",
                          textAlign: "center",
                          fontWeight: 400,
                          fontSize: "20px",
                          lineHeight: "20px",
                          letterSpacing: "0.14px",
                          color: "#FFFFFF",
                        }}
                      >
                        {!!userName?.first_name && !!userName?.last_name
                          ? `${userName?.first_name[0]?.toUpperCase()}${userName?.last_name[0]?.toUpperCase()}`
                          : userName?.username[0]?.toUpperCase()}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontStyle: "normal",
                          fontWeight: 500,
                          fontSize: "20px",
                          lineHeight: "160%",
                          display: "flex",
                          alignItems: "center",
                          textAlign: "center",
                          letterSpacing: "0.15px",
                        }}
                      >
                        {!!userName?.first_name && !!userName?.last_name
                          ? `${userName?.first_name} ${userName?.last_name}`
                          : userName?.username}
                      </Typography>
                    </Grid>
                    <MenuList autoFocusItem={false} sx={{ width: "100%" }}>
                      {Menu.map((el, idx) => (
                        <MenuItem
                          key={idx}
                          onClick={() => handleHeaderMenu(el)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                          }}
                        >
                          {el.icon}
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontStyle: "normal",
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "150%",
                              letterSpacing: "0.15px",
                              color: "onBackground",
                            }}
                          >
                            {el.name}
                          </Typography>
                        </MenuItem>
                      ))}
                    </MenuList>
                    <Grid
                      onClick={() => handleLogout()}
                      sx={{
                        borderTop: "1px solid #00000024",
                        padding: "0.5em 0.5em 0.5em 0em",
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        justifyContent: "space-around",
                        cursor: "pointer",
                        "&:hover": {
                          cursor: "pointer",
                          background: "#f5f5f5",
                        },
                      }}
                    >
                      <Typography>Logout</Typography>
                    </Grid>
                  </Grid>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
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

        {/* </Box> */}
        {/* <MoreVert /> */}
        {/* </Grid> */}
      </Grid>
    </Box>
  );
};
