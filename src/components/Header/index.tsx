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
const navLinks = [
  { id: 0, label: "Explore", href: "/explore" },
  { id: 0, label: "Learn", href: "/" },
];

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

  const isHomepage = router.pathname == "/";
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
        {isHomepage && (
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
            {navLinks.map((link) => (
              <Link
                href={link.href}
                style={{
                  textDecoration: "none",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "16px",
                    lineHeight: "24px",
                    textAlign: "center",
                  }}
                  color={"onSurface"}
                >
                  {link.label}
                </Typography>
              </Link>
            ))}
          </Box>
        )}
        <Box
          sx={{
            width: isHomepage ? "70%" : "95%",
          }}
        >
          {!open ? (
            <Box
              onClick={handleInputFocus}
              sx={{
                width: "100%",
                mr: "auto",
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
        </Box>

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
          {userLoading ? (
            <FetchLoading />
          ) : (
            <Box ml={"auto"}>
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
        <ProfileDropDown
          anchorElement={menuAnchorRef.current}
          user={user}
          open={isMenuShown}
          onToggle={() => setIsMenuShown(!isMenuShown)}
          onClose={() => setIsMenuShown(false)}
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
  );
};
