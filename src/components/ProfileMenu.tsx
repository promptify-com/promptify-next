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
import useLogout from "@/hooks/useLogout";
import { Menu, MenuType } from "@/common/constants";
import { useSelector } from 'react-redux';
import { RootState } from "@/core/store";

interface ProfileDropDownProps {
  open: boolean;
  onClose: () => void;
  onToggle: () => void;
  anchorElement: HTMLElement | null;
  onCloseSidebar?: () => void;
}

export const ProfileDropDown: React.FC<ProfileDropDownProps> = ({
  open,
  onClose,
  onToggle,
  anchorElement,
  onCloseSidebar,
}) => {
  const router = useRouter();
  const logout = useLogout();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const handleHeaderMenu = (el: MenuType) => {
    onToggle();
    router.push(el.href);
  };
  const handleLogout = async () => {
    onClose();
    if (onCloseSidebar) {
      onCloseSidebar();
    }
    await logout();
  };

  return (
    <Popper
      open={open}
      anchorEl={anchorElement}
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
                      src={currentUser?.avatar}
                      alt={currentUser?.first_name}
                      sizes="40px"
                      sx={{
                        width: "90px",
                        height: "90px",
                        ml: "auto",
                        cursor: "pointer",
                        bgcolor: currentUser?.avatar ? "" : "black",
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
                      {currentUser?.first_name} {currentUser?.last_name}
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
                      {currentUser?.username}
                    </Typography>
                  </Box>
                </Grid>
                <MenuList autoFocusItem={false} sx={{ width: "100%" }}>
                  {Menu.map((el) => (
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
