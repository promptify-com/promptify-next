import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  ClickAwayListener,
  Grid,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from "@mui/material";

import { User } from "@/core/api/dto/user";
import useLogout from "@/hooks/useLogout";
import useSetUser from "@/hooks/useSetUser";
import { Menu, MenuType } from "@/common/constants";
import { useEffect, useState } from "react";

interface ProfileDropDownProps {
  open: boolean;
  onClose: () => void;
  onToggle: () => void;
  user: User | undefined;
  anchorElement: HTMLElement | null;
  onCloseSidebar?: () => void;
}

export const ProfileDropDown: React.FC<ProfileDropDownProps> = ({
  open,
  onClose,
  user,
  onToggle,
  anchorElement,
  onCloseSidebar,
}) => {
  const router = useRouter();
  const logout = useLogout();
  const setUser = useSetUser();

  const [MenuLinks, setMenuLinks] = useState<MenuType[]>(Menu);

  const handleHeaderMenu = (el: MenuType) => {
    onToggle();
    router.push(el.href);
  };
  const handleLogout = () => {
    onClose();
    if (onCloseSidebar) {
      onCloseSidebar();
    }
    logout();
    setUser(null);
  };

  useEffect(() => {
    if (!user?.is_admin) {
      setMenuLinks((prevMenuLinks) =>
        prevMenuLinks.filter((el) => el.id !== 3)
      );
    }
  }, [user]);

  return (
    <Popper
      open={open}
      anchorEl={anchorElement}
      // role={undefined}
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
              width: "282px",
              marginTop: "5px",
              overflow: "hidden",
            }}
            elevation={0}
          >
            <ClickAwayListener onClickAway={() => onClose()}>
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
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    py: "24px",
                    gap: "8px",
                  }}
                >
                  <Box display={"flex"} justifyContent={"center"}>
                    <Avatar
                      src={user?.avatar || user?.first_name}
                      alt={user?.first_name}
                      sizes="40px"
                      sx={{
                        width: "90px",
                        height: "90px",
                        ml: "auto",
                        cursor: "pointer",
                        bgcolor: user?.avatar ? "" : "black",
                        padding: "1px",
                        fontStyle: "normal",
                        textAlign: "center",
                        fontWeight: 500,
                        fontSize: { sm: "60px" },
                        textTransform: "capitalize",
                        lineHeight: "20px",
                        letterSpacing: "0.14px",
                      }}
                    />
                  </Box>
                  <Box textAlign={"center"}>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontStyle: "normal",
                        fontWeight: 500,
                        fontSize: "20px",
                        lineHeight: "160%",
                        letterSpacing: "0.15px",
                      }}
                    >
                      {user?.first_name} {user?.last_name}
                    </Typography>
                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontFamily: "Poppins",
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: "143%",
                        letterSpacing: "0.15px",
                      }}
                    >
                      {user?.username}
                    </Typography>
                  </Box>
                </Grid>
                <MenuList autoFocusItem={false} sx={{ width: "100%" }}>
                  {MenuLinks.map((el, idx) => (
                    <MenuItem
                      key={el.name}
                      onClick={() => handleHeaderMenu(el)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        minHeight: "48px",
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
                    padding: "0.5em 0.5em 0.5em 1.2em",
                    display: "flex",
                    width: "100%",
                    cursor: "pointer",
                    "&:hover": {
                      cursor: "pointer",
                      background: "#f5f5f5",
                    },
                  }}
                >
                  <Typography>Sign Out</Typography>
                </Grid>
              </Grid>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};
