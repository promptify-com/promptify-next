import { useRouter } from "next/router";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useLogout from "@/hooks/useLogout";
import { MenuType, ProfileMenuItems } from "@/common/constants";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store";
import { useRef, useState } from "react";
import defaultAvatar from "@/assets/images/default-avatar.jpg";
import { theme } from "@/theme";
import LogoutIcon from "@/assets/icons/LogoutIcon";

export const ProfileMenu = () => {
  const router = useRouter();
  const logout = useLogout();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const menuAnchorRef = useRef<HTMLDivElement | null>(null);
  const [isMenuShown, setIsMenuShown] = useState(false);

  const handleHeaderMenu = (el: MenuType) => {
    router.push(`${el.href}`);
    setIsMenuShown(!isMenuShown);
  };

  const handleLogout = async () => {
    setIsMenuShown(false);
    await logout();
  };

  return (
    <Box>
      <Box
        ref={menuAnchorRef}
        onClick={() => setIsMenuShown(!isMenuShown)}
        sx={{
          borderRadius: { xs: "24px", sm: "36px" },
          p: "3px",
          bgcolor: isMenuShown ? "surfaceContainerHigh" : "transparent",
          ":hover": {
            bgcolor: "surfaceContainerHigh",
          },
        }}
      >
        <Avatar
          src={currentUser?.avatar ?? defaultAvatar.src}
          alt={currentUser?.first_name ?? "Promptify"}
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
      </Box>
      <Popper
        open={isMenuShown}
        anchorEl={menuAnchorRef.current}
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
              transformOrigin: "right top",
            }}
          >
            <Paper
              sx={{
                width: 300,
                bgcolor: "#794D87",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0px 0px 24px 8px rgba(0, 0, 0, 0.05), 0px 2px 16px 0px rgba(0, 0, 0, 0.05);",
                pt: "90px",
                mt: "15px",
              }}
            >
              <ClickAwayListener onClickAway={() => setIsMenuShown(false)}>
                <Box
                  sx={{
                    bgcolor: "surfaceContainerLowest",
                  }}
                >
                  <Stack gap={2}>
                    <Avatar
                      src={currentUser?.avatar ?? require("@/assets/images/default-avatar.jpg")}
                      alt={currentUser?.first_name?.slice(0, 1) ?? "P"}
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        border: `2px solid ${theme.palette.surfaceContainerLowest}`,
                        backgroundColor: "black",
                        color: "white",
                        fontSize: "40px",
                        margin: "-60px auto 0",
                      }}
                    />
                    <Box
                      px={"16px"}
                      textAlign={"center"}
                    >
                      <Typography
                        fontSize={18}
                        fontWeight={400}
                        color={"onSurface"}
                      >
                        {currentUser?.first_name} {currentUser?.last_name}
                      </Typography>
                      <Typography
                        fontSize={13}
                        fontWeight={500}
                        color={"secondary.light"}
                      >
                        @{currentUser?.username}
                      </Typography>
                    </Box>
                  </Stack>
                  <MenuList
                    autoFocusItem={false}
                    sx={{ p: "16px", gap: 1 }}
                  >
                    {ProfileMenuItems.map(item => (
                      <MenuItem
                        key={item.name}
                        onClick={() => handleHeaderMenu(item)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: "16px 8px 16px 16px",
                          borderRadius: "16px",
                          gap: 1,
                          ":hover": {
                            bgcolor: "surfaceContainerHighest",
                          },
                        }}
                      >
                        {item.icon}
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: 400,
                            color: "onSurface",
                          }}
                        >
                          {item.name}
                        </Typography>
                      </MenuItem>
                    ))}
                    <MenuItem
                      onClick={() => handleLogout()}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: "16px 8px 16px 16px",
                        borderRadius: "16px",
                        gap: 1,
                        ":hover": {
                          bgcolor: "surfaceContainerHighest",
                        },
                      }}
                    >
                      <LogoutIcon />
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 400,
                          color: "onSurface",
                        }}
                      >
                        Sign out
                      </Typography>
                    </MenuItem>
                  </MenuList>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};
