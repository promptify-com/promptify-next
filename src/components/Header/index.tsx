import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useRouter } from "next/router";

import { LogoApp } from "@/assets/icons/LogoApp";
import useToken from "@/hooks/useToken";
import SearchBar from "@/components/explorer/SearchBar";
import { LogoAppMobile } from "@/assets/icons/LogoAppMobile";
import { SearchDialog } from "./SearchDialog";
import { useGetCurrentUserQuery } from "@/core/api/user";
import { FetchLoading } from "@/components/FetchLoading";
import { ProfileDropDown } from "@/components/ProfileMenu";
import { Menu } from "@mui/icons-material";
import { SideBarMobile } from "../SideBarMobile";

interface HeaderProps {
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

export const Header: React.FC<HeaderProps> = ({
  transparent = false,
  fixed = false,
  keyWord = "",
  setKeyWord,
}) => {
  const token = useToken();
  const router = useRouter();

  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery(token);

  const [isMenuShown, setIsMenuShown] = useState(false);
  const [open, setOpen] = useState(false);
  const menuAnchorRef = useRef<HTMLDivElement | null>(null);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [drawerState, setDrawerState] = useState(false);

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
    <Box
      sx={{
        width: "100%",
        background: transparent ? "transparent" : "#F6F5FF",
        position: fixed ? "fixed" : "relative",
        zIndex: 1000,
        top: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: { xs: "surface.1", md: "surface.3" },
        height: { xs: "56px", md: "90px" },
      }}
    >
      <Grid
        sx={{
          justifyContent: "space-between",
          display: "flex",
          width: "100%",
          gap: "30px",
          padding: { xs: "0 4px ", md: "1.5em 2em" },
          alignItems: "center",
        }}
      >
        <Grid
          display={{ xs: "flex", md: "none" }}
          width={75}
          p={"0px 10px"}
          alignItems={"center"}
          height={48}
          mt={1}
        >
          <LogoApp width={23} />
        </Grid>
        <Grid
          display={{ xs: "flex", md: "none" }}
          alignItems={"center"}
          gap={2}
          mr={1}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            onClick={() => setOpenSidebar(true)}
          >
            <SearchIcon sx={{ fontSize: "26px", color: "onSurface" }} />
          </Box>
          <Avatar
            sx={{
              width: "23px",
              height: "23px",
              bgcolor: "black",
            }}
            src="John Doe"
            alt="John Doe"
          />
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            onClick={() => setOpenSidebar(true)}
          >
            <MenuRoundedIcon sx={{ fontSize: "26px", color: "onSurface" }} />
          </Box>
        </Grid>
        <Box
          display={{ xs: "none", md: "flex" }}
          sx={{
            flex: 1,
            alignItems: "center",
            position: "relative",
          }}
          onClick={handleInputFocus}
        >
          <SearchBar keyWord={keyWord} setKeyWord={setKeyWord} />
          <SearchDialog open={open} close={() => setOpen(false)} />
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: "10px",
          }}
        >
          {/* <Box
            display={{ xs: "flex", sm: "none" }}
            alignItems={"center"}
            bgcolor={"blue"}
          >
            <IconButton
              onClick={() => {
                setOpen(true);
              }}
              sx={{
                border: "none",
              }}
            >
              <SearchIcon />
            </IconButton>
          </Box> */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {userLoading ? (
              <FetchLoading />
            ) : (
              <Box>
                {user && token ? (
                  <Avatar
                    ref={menuAnchorRef}
                    onClick={() => setIsMenuShown(!isMenuShown)}
                    src={user.avatar || user.first_name}
                    alt={user.first_name}
                    sx={{
                      ml: "auto",
                      cursor: "pointer",
                      bgcolor: "black",
                      borderRadius: { xs: "24px", sm: "36px" },
                      width: { xs: "24px", sm: "40px" },
                      padding: "1px",
                      height: { xs: "24px", sm: "40px" },
                      fontStyle: "normal",
                      textAlign: "center",
                      fontWeight: 400,
                      fontSize: { sm: "30px" },
                      textTransform: "capitalize",
                      lineHeight: "20px",
                      letterSpacing: "0.14px",
                    }}
                  />
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
          </Box>

          {/* <Box display={{ xs: "flex", sm: "none" }}>
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
          </Box> */}
        </Box>
        <ProfileDropDown
          anchorElement={menuAnchorRef.current}
          user={user}
          open={isMenuShown}
          onToggle={() => setIsMenuShown(!isMenuShown)}
          onClose={() => setIsMenuShown(false)}
        />
        <SideBarMobile
          open={openSidebar}
          onClose={() => setOpenSidebar(false)}
          onOpen={() => setOpenSidebar(true)}
        />
        {/* <SwipeableDrawer
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
        </SwipeableDrawer> */}
      </Grid>
    </Box>
  );
};
