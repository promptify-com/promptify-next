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
  Stack,
  Typography,
} from "@mui/material";
import useLogout from "@/hooks/useLogout";
import { MenuType, ProfileMenuItems } from "@/common/constants";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store";
import { useRef, useState } from "react";
import Image from "./design-system/Image";
import defaultAvatar from "@/assets/images/default-avatar.jpg";
import Link from "next/link";
import { Logout } from "@mui/icons-material";

export const ProfileMenu = () => {
  const router = useRouter();
  const logout = useLogout();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const menuAnchorRef = useRef<HTMLDivElement | null>(null);
  const [isMenuShown, setIsMenuShown] = useState(false);

  const handleHeaderMenu = (el: MenuType) => {
    setIsMenuShown(!isMenuShown);
    router.push(el.href);
  };

  const handleLogout = async () => {
    setIsMenuShown(false);
    await logout();
  };

  return (
    <Box>
      <Avatar
        ref={menuAnchorRef}
        onClick={() => setIsMenuShown(!isMenuShown)}
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
              transformOrigin: "left top",
            }}
          >
            <Paper
              sx={{
                width: 300,
                bgcolor: "#794D87",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0px 0px 24px 8px rgba(0, 0, 0, 0.05), 0px 2px 16px 0px rgba(0, 0, 0, 0.05);",
              }}
            >
              <ClickAwayListener onClickAway={() => setIsMenuShown(false)}>
                <Box sx={{}}>
                  <Box
                    sx={{
                      bgcolor: "surfaceContainerLowest",
                      pt: "24px",
                    }}
                  >
                    <Stack gap={2}>
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
                        }}
                      >
                        <Logout />
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
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};
