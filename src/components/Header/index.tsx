import React, { useRef, useState } from "react";
import { Avatar, Box, Grid, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useRouter } from "next/router";

import { LogoApp } from "@/assets/icons/LogoApp";
import useToken from "@/hooks/useToken";
import SearchBar from "@/components/explorer/SearchBar";
import { SearchDialog } from "./SearchDialog";
import { useGetCurrentUserQuery } from "@/core/api/user";
import { FetchLoading } from "@/components/FetchLoading";
import { ProfileDropDown } from "@/components/ProfileMenu";
import { SideBarMobile } from "../SideBarMobile";

interface HeaderProps {
  transparent?: boolean;
  fixed?: boolean;
  keyWord?: string;
  setKeyWord?: React.Dispatch<React.SetStateAction<string>>;
  handleKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
}

type SidebarType = "navigation" | "profile";

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
  const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);
  const menuAnchorRef = useRef<HTMLDivElement | null>(null);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [sidebarType, setSidebarType] = useState<SidebarType>("navigation");

  const handleInputFocus = () => {
    setOpenSearchDialog(true);
  };

  return (
    <Box
      sx={{
        width: "100%",
        background: transparent ? "transparent" : "#F6F5FF",
        position: { xs: "fixed", md: fixed ? "fixed" : "relative" },
        zIndex: 1000,
        top: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: { xs: "surface.1", md: "surface.3" },
        height: { xs: "58px", md: "90px" },
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
          borderBottom: { xs: "2px solid #E1E2EC", md: "none" },
        }}
      >
        <Grid
          onClick={() => router.push("/")}
          display={{ xs: "flex", md: "none" }}
          width={75}
          p={"0px 10px"}
          alignItems={"center"}
          height={48}
          mt={1}
          sx={{}}
        >
          <LogoApp width={23} />
          <Typography
            sx={{fontSize: 10, mt: 0.2, ml: 0.5}}
            fontWeight={'bold'}
          >
            beta
          </Typography>
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
            onClick={() => {
              setOpenSidebar(true);
              setSidebarType("navigation");
            }}
          >
            <SearchIcon sx={{ fontSize: "26px", color: "onSurface" }} />
          </Box>
          {user && token && (
            <Box
              onClick={() => {
                setOpenSidebar(true);
                setSidebarType("profile");
              }}
            >
              <Avatar
                sx={{
                  width: "23px",
                  height: "23px",
                  bgcolor: "black",
                  fontSize: 10,
                  textTransform: "capitalize",
                }}
                src={user.avatar}
                alt={user.first_name}
              />
            </Box>
          )}
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            onClick={() => {
              setOpenSidebar(true);
              setSidebarType("navigation");
            }}
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
          <SearchDialog
            open={openSearchDialog}
            close={() => setOpenSearchDialog(false)}
          />
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {userLoading ? (
              <FetchLoading />
            ) : (
              <Box>
                {user && token ? (
                  <Avatar
                    ref={menuAnchorRef}
                    onClick={() => setIsMenuShown(!isMenuShown)}
                    src={user.avatar}
                    alt={user.first_name}
                    sx={{
                      ml: "auto",
                      cursor: "pointer",
                      bgcolor: "black",
                      borderRadius: { xs: "24px", sm: "36px" },
                      width: { xs: "24px", sm: "40px" },
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
        </Box>
        <ProfileDropDown
          anchorElement={menuAnchorRef.current}
          user={user}
          open={isMenuShown}
          onToggle={() => setIsMenuShown(!isMenuShown)}
          onClose={() => setIsMenuShown(false)}
        />
        <SideBarMobile
          type={sidebarType}
          openDrawer={openSidebar}
          onCloseDrawer={() => setOpenSidebar(false)}
          onOpenDrawer={() => setOpenSidebar(true)}
          user={user}
          token={token}
          setSidebarType={setSidebarType}
        />
      </Grid>
    </Box>
  );
};
