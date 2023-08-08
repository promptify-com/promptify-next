import { LogoApp } from "@/assets/icons/LogoApp";
import {
  AutoAwesome,
  ClearRounded,
  HomeRounded,
  MenuBookRounded,
  MenuRounded,
  Search,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListSubheader,
  MenuItem,
  MenuList,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { CollectionsEmptyBox } from "./common/sidebar/CollectionsEmptyBox";
import { User } from "@/core/api/dto/user";
import { Menu, MenuType } from "@/common/constants";
import useLogout from "@/hooks/useLogout";
import useSetUser from "@/hooks/useSetUser";
import { useGetCollectionTemplatesQuery } from "@/core/api/collections";
import { Collections } from "./common/sidebar/Collections";

type SidebarType = "navigation" | "profile";

interface SideBarMobileProps {
  type: SidebarType;
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  user: User | undefined;
  token: string | null | undefined;
  setSidebarType: (value: React.SetStateAction<SidebarType>) => void;
}

export const SideBarMobile: React.FC<SideBarMobileProps> = ({
  type,
  open,
  onClose,
  onOpen,
  user,
  token,
  setSidebarType,
}) => {
  const router = useRouter();
  const logout = useLogout();
  const setUser = useSetUser();

  const pathname = router.pathname;
  const splittedPath = pathname.split("/");
  const isValidUser = Boolean(token && user?.id);

  const links = [
    {
      label: "Homepage",
      icon: <HomeRounded />,
      href: "/",
      active: pathname == "/",
      external: false,
    },
    {
      label: "Browse",
      icon: <Search />,
      href: "/explore",
      active: splittedPath[1] == "explore",
      external: false,
    },
    {
      label: "My Sparks",
      icon: <AutoAwesome />,
      href: isValidUser ? "/sparks" : "/signin",
      active: pathname == "/sparks",
      external: false,
    },
    {
      label: "Learn",
      icon: <MenuBookRounded />,
      href: "https://promptify.com",
      active: pathname == "/learn",
      external: true,
    },
  ];

  const navigateTo = (href: string, isExternal: boolean) => {
    if (isExternal) {
      window.open(href, "_blank"); // opens in a new tab
      return;
    }
    let next = href.split("/");
    if (splittedPath[1] == next[1]) {
      return null;
    }
    router.push(href);
  };

  const handleHeaderMenu = (el: MenuType) => {
    router.push(el.href);
  };
  const handleLogout = async () => {
    await logout();
    onClose();
    setUser(null);
  };

  const { data: collections, isLoading: isCollectionsLoading } =
    useGetCollectionTemplatesQuery(user?.favorite_collection_id as number, {
      skip: !user,
    });

  return (
    <SwipeableDrawer
      anchor={"top"}
      open={open}
      onClose={onClose}
      onOpen={onOpen}
    >
      <Box minHeight={"100vh"}>
        <Grid
          height={"56px"}
          width={"100%"}
          justifyContent={"space-between"}
          padding={"0px 4px"}
          bgcolor={"surface.3"}
          display={"flex"}
          alignItems={"center"}
        >
          <Grid
            display={{ xs: "flex", md: "none" }}
            width={75}
            p={"0px 10px"}
            alignItems={"center"}
            height={48}
            mt={1}
          >
            <LogoApp width={23} color="#56575c" />
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
            mr={1}
            gap={2}
          >
            {type == "navigation" ? (
              <Box>
                {isValidUser && (
                  <Avatar
                    onClick={() => setSidebarType("profile")}
                    src={user?.avatar || user?.first_name}
                    alt={user?.first_name}
                    sx={{
                      ml: "auto",
                      cursor: "pointer",
                      bgcolor: "black",
                      borderRadius: { xs: "24px", sm: "36px" },
                      width: "23px",
                      height: "23px",
                      padding: "1px",
                      fontStyle: "normal",
                      textAlign: "center",
                      fontWeight: 400,
                      fontSize: 10,
                      textTransform: "capitalize",
                      lineHeight: "20px",
                      letterSpacing: "0.14px",
                    }}
                  />
                )}
              </Box>
            ) : (
              <Box
                onClick={onClose}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <ClearRounded sx={{ fontSize: "26px", color: "#56575c" }} />
              </Box>
            )}

            {type !== "profile" ? (
              <Box
                onClick={onClose}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <ClearRounded sx={{ fontSize: "26px", color: "#56575c" }} />
              </Box>
            ) : (
              <Box
                onClick={onClose}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <MenuRounded sx={{ fontSize: "26px", color: "#56575c" }} />
              </Box>
            )}
          </Grid>
        </Grid>
        {type == "navigation" ? (
          <Box
            display={"flex"}
            flexDirection={"column"}
            padding={"22px 0px"}
            gap={"16px"}
          >
            <Box
              position={"relative"}
              bgcolor={"surface.3"}
              p={"5px 15px"}
              m={"0px 22px"}
              gap={1}
              borderRadius={"48px"}
              display={"flex"}
              alignItems={"center"}
            >
              <Search />
              <InputBase
                sx={{ flex: 1 }}
                placeholder="Search for templates..."
              />
              <Box display={"flex"} alignItems={"center"}>
                <LogoApp width={20} />
              </Box>
            </Box>
            <Box>
              <List
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  padding: "0px 22px",
                }}
              >
                {links.map((link) => (
                  <ListItem
                    key={link.label}
                    disablePadding
                    onClick={() => navigateTo(link.href, link.external)}
                  >
                    <ListItemButton selected={link.active}>
                      <ListItemIcon sx={{ color: "onSurface" }}>
                        {link.icon}
                      </ListItemIcon>
                      <Typography sx={{ color: "onSurface" }} ml={-3}>
                        {link.label}
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ mt: 1 }} />
              {isValidUser ? (
                <Box ml={1}>
                  <Collections
                    favCollection={collections}
                    collectionLoading={isCollectionsLoading}
                    isValidUser={isValidUser}
                    sidebarOpen
                  />
                </Box>
              ) : (
                <List subheader={<ListSubheader>COLLECTION</ListSubheader>}>
                  <CollectionsEmptyBox onExpand />
                </List>
              )}
            </Box>
          </Box>
        ) : (
          <Box>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid
                borderBottom={"1px solid #f5f5f5"}
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
                    src={user?.avatar ?? user?.first_name}
                    alt={user?.first_name}
                    sizes="40px"
                    sx={{
                      width: "90px",
                      height: "90px",
                      ml: "auto",
                      cursor: "pointer",
                      bgcolor: "black",
                      padding: "1px",
                      fontStyle: "normal",
                      textAlign: "center",
                      fontWeight: 500,
                      fontSize: "60px",
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
                {Menu.map((el, idx) => (
                  <MenuItem
                    key={el.name}
                    onClick={() => handleHeaderMenu(el)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      minHeight: "48px",
                      gap: "15px",
                      ml: 1,
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
                  padding: "0 1.2em",
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
          </Box>
        )}
      </Box>
    </SwipeableDrawer>
  );
};
