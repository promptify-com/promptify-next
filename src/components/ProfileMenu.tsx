import { ReactNode } from "react";
import { useRouter } from "next/router";
import {
  ClickAwayListener,
  Grid,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from "@mui/material";

import { Collection } from "@/assets/icons/collection";
import { Prompt } from "@/assets/icons/prompts";
import { Setting } from "@/assets/icons/setting";
import { User } from "@/core/api/dto/user";
import useLogout from "@/hooks/useLogout";
import useSetUser from "@/hooks/useSetUser";

interface ProfileDropDownProps {
  open: boolean;
  onClose: () => void;
  onToggle: () => void;
  user: User | undefined;
  anchorElement: HTMLElement | null;
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
export const ProfileDropDown: React.FC<ProfileDropDownProps> = ({
  open,
  onClose,
  user,
  onToggle,
  anchorElement,
}) => {
  const router = useRouter();
  const logout = useLogout();
  const setUser = useSetUser();

  const handleHeaderMenu = (el: MenuType) => {
    onToggle();
    // setIsMenuShown(!isMenuShown);
    if (el.id === Menu[0].id) {
      router.push("/");
    } else if (el.id === Menu[2].id) {
      router.push("/dashboard");
    }
  };
  const handleLogout = () => {
    onToggle();
    // setIsMenuShown(!isMenuShown);
    logout();
    setUser(null);
  };
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
              width: "13em",
              marginTop: "5px",
            }}
            elevation={0}
          >
            <ClickAwayListener onClickAway={() => onClose}>
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
                    {user?.first_name && user?.last_name
                      ? `${user?.first_name[0]?.toUpperCase()}${user?.last_name[0]?.toUpperCase()}`
                      : user?.username[0]?.toUpperCase()}
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
                    {!!user?.first_name && !!user?.last_name
                      ? `${user?.first_name} ${user?.last_name}`
                      : user?.username}
                  </Typography>
                </Grid>
                <MenuList autoFocusItem={false} sx={{ width: "100%" }}>
                  {Menu.map((el, idx) => (
                    <MenuItem
                      key={el.name}
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
  );
};
