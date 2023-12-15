import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useRouter } from "next/router";
import { LogoApp } from "@/assets/icons/LogoApp";
import SearchBar from "@/components/explorer/SearchBar";
import { SearchDialog } from "./SearchDialog";
import { ProfileMenu } from "@/components/ProfileMenu";
import { SideBarMobile } from "../SideBarMobile";
import { isValidUserFn } from "@/core/store/userSlice";
import { theme } from "@/theme";
import { redirectToPath } from "@/common/helpers";
import Image from "next/image";
import useBrowser from "@/hooks/useBrowser";
import { useAppSelector } from "@/hooks/useStore";

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

const Mobile = () => {
  const isValidUser = useAppSelector(isValidUserFn);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [sidebarType, setSidebarType] = useState<SidebarType>("navigation");

  return (
    <>
      <Grid
        display={"flex"}
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
        {isValidUser && (
          <Box
            onClick={() => {
              setOpenSidebar(true);
              setSidebarType("profile");
            }}
          >
            <Image
              src={currentUser?.avatar ?? require("@/assets/images/default-avatar.jpg")}
              alt={currentUser?.first_name?.slice(0, 1) ?? "P"}
              width={23}
              height={23}
              style={{
                backgroundColor: "black",
                color: "white",
                fontSize: 12,
                textTransform: "capitalize",
                display: "block",
                borderRadius: "50%",
                textAlign: "center",
                lineHeight: "22px",
              }}
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
      <SideBarMobile
        type={sidebarType}
        openDrawer={openSidebar}
        onCloseDrawer={() => setOpenSidebar(false)}
        onOpenDrawer={() => setOpenSidebar(true)}
        setSidebarType={setSidebarType}
      />
    </>
  );
};

const Desktop = ({ keyWord = "", setKeyWord }: Pick<HeaderProps, "keyWord" | "setKeyWord">) => {
  const router = useRouter();
  const isValidUser = useAppSelector(isValidUserFn);
  const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);
  const handleInputFocus = () => {
    setOpenSearchDialog(true);
  };

  return (
    <>
      <Box
        display={"flex"}
        sx={{
          flex: 1,
          alignItems: "center",
          position: "relative",
        }}
        onClick={handleInputFocus}
      >
        <SearchBar
          keyWord={keyWord}
          setKeyWord={setKeyWord}
        />
        <SearchDialog
          open={openSearchDialog}
          close={() => setOpenSearchDialog(false)}
        />
      </Box>
      <Box
        display={"flex"}
        alignItems={"center"}
        gap={"10px"}
      >
        <Box display={"flex"}>
          <Box>
            {isValidUser ? (
              <ProfileMenu />
            ) : (
              <Box
                display={"flex"}
                alignItems={"center"}
                gap={"16px"}
              >
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
        </Box>
      </Box>
    </>
  );
};

export const Header: React.FC<HeaderProps> = ({ transparent = false, fixed = false, keyWord = "", setKeyWord }) => {
  const { isMobile } = useBrowser();

  return (
    <Box
      sx={{
        height: {
          xs: theme.custom.headerHeight.xs,
          md: theme.custom.headerHeight.md,
        },
        width: "100%",
        background: transparent ? "transparent" : "surface.1",
        position: { xs: "fixed", md: fixed ? "fixed" : "relative" },
        zIndex: 1000,
        top: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: { xs: "surface.1", md: "surface.1" },
        borderBottomRightRadius: { md: "16px" },
        borderBottomLeftRadius: { md: "16px" },
      }}
    >
      <Grid
        sx={{
          justifyContent: "space-between",
          display: "flex",
          width: "100%",
          gap: "30px",
          padding: { xs: "0 4px ", md: "0 24px" },
          alignItems: "center",
          borderBottom: { xs: "2px solid #E1E2EC", md: "none" },
        }}
      >
        <Grid
          onClick={() => {
            redirectToPath("/");
          }}
          display="flex"
          p={"0px 10px"}
          alignItems={"center"}
          height={48}
          sx={{ cursor: "pointer" }}
        >
          <LogoApp width={23} />
          <Typography
            sx={{ fontSize: 19, ml: 1 }}
            fontWeight={500}
          >
            Promptify
          </Typography>
        </Grid>
        {isMobile ? (
          <Mobile />
        ) : (
          <Desktop
            setKeyWord={setKeyWord}
            keyWord={keyWord}
          />
        )}
      </Grid>
    </Box>
  );
};
