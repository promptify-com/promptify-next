import React, { useDeferredValue, useState } from "react";
import { LogoApp } from "@/assets/icons/LogoApp";
import { AutoAwesome, ClearRounded, HomeRounded, MenuBookRounded, MenuRounded, Search } from "@mui/icons-material";
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
import { useDispatch, useSelector } from "react-redux";

import { setSelectedKeyword } from "@/core/store/filtersSlice";
import { CollectionsEmptyBox } from "./common/sidebar/CollectionsEmptyBox";
import { Menu, MenuType } from "@/common/constants";
import useLogout from "@/hooks/useLogout";
import { useGetCollectionTemplatesQuery } from "@/core/api/collections";
import { Collections } from "./common/sidebar/Collections";
import { isValidUserFn } from "@/core/store/userSlice";
import { RootState } from "@/core/store";
import useDebounce from "@/hooks/useDebounce";
import { useGetTemplatesBySearchQuery } from "@/core/api/templates";
import CardTemplate from "./common/cards/CardTemplate";
import CardTemplatePlaceholder from "./placeholders/CardTemplatePlaceHolder";
import { NotFoundIcon } from "@/assets/icons/NotFoundIcon";
import LoadingOverlay from "./design-system/LoadingOverlay";
import { useRouteChangeOverlay } from "@/hooks/useRouteChangeOverlay";

type SidebarType = "navigation" | "profile";

interface SideBarMobileProps {
  type: SidebarType;
  openDrawer: boolean;
  onCloseDrawer: () => void;
  onOpenDrawer: () => void;
  setSidebarType: (value: React.SetStateAction<SidebarType>) => void;
}

export const SideBarMobile: React.FC<SideBarMobileProps> = ({
  type,
  openDrawer,
  onCloseDrawer,
  onOpenDrawer,
  setSidebarType,
}) => {
  const router = useRouter();
  const pathname = router.pathname;
  const splittedPath = pathname.split("/");

  const dispatch = useDispatch();
  const logout = useLogout();

  const title = useSelector((state: RootState) => state.filters.title || "");
  const isValidUser = useSelector(isValidUserFn);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const [textInput, setTextInput] = useState("");
  const deferredSearchName = useDeferredValue(textInput);
  const debouncedSearchName = useDebounce<string>(deferredSearchName, 300);

  const { data: templates, isFetching } = useGetTemplatesBySearchQuery(debouncedSearchName, {
    skip: !textInput.length,
  });

  const { showOverlay } = useRouteChangeOverlay({ onCloseDrawerCallback: onCloseDrawer });

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
      href: "https://blog.promptify.com/",
      active: pathname == "/learn",
      external: true,
    },
  ];
  const navigateTo = async (href: string, isExternal: boolean) => {
    if (isExternal) {
      window.open(href, "_blank"); // opens in a new tab
      return;
    }

    await router.push(href);
  };
  const handleHeaderMenu = async (el: MenuType) => {
    await router.push(el.href);
    onCloseDrawer();
  };
  const handleLogout = async () => {
    await logout();
    onCloseDrawer();
  };
  const onSearchClicked = () => {
    dispatch(setSelectedKeyword(textInput));
    router.push({ pathname: "/explore" });
    onCloseDrawer();
  };
  const { data: collections, isLoading: isCollectionsLoading } = useGetCollectionTemplatesQuery(
    currentUser?.favorite_collection_id as number,
    {
      skip: !isValidUser,
    },
  );

  return (
    <SwipeableDrawer
      anchor={"top"}
      open={openDrawer}
      onClose={onCloseDrawer}
      onOpen={onOpenDrawer}
    >
      {showOverlay && <LoadingOverlay />}

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
            <LogoApp
              width={23}
              color="#56575c"
            />
            <Typography
              sx={{ fontSize: 10, mt: 0.2, ml: 0.5 }}
              fontWeight={"bold"}
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
            {type === "navigation" ? (
              <Box>
                {isValidUser && (
                  <Avatar
                    onClick={() => setSidebarType("profile")}
                    src={currentUser?.avatar}
                    alt={currentUser?.first_name}
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
                onClick={onCloseDrawer}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <ClearRounded sx={{ fontSize: "26px", color: "#56575c" }} />
              </Box>
            )}

            {type !== "profile" ? (
              <Box
                onClick={onCloseDrawer}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <ClearRounded sx={{ fontSize: "26px", color: "#56575c" }} />
              </Box>
            ) : (
              <Box
                onClick={onCloseDrawer}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <MenuRounded sx={{ fontSize: "26px", color: "#56575c" }} />
              </Box>
            )}
          </Grid>
        </Grid>
        {type === "navigation" ? (
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
              <Search onClick={onSearchClicked} />
              <InputBase
                sx={{ flex: 1 }}
                placeholder="Search for templates..."
                onChange={e => {
                  setTextInput(e.target.value);
                }}
                value={textInput ?? title}
              />
              <Box
                display={"flex"}
                alignItems={"center"}
              >
                <LogoApp
                  width={20}
                  onClick={onSearchClicked}
                />
              </Box>
            </Box>
            {textInput.length < 3 ? (
              <Box>
                <List
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    padding: "0px 22px",
                  }}
                >
                  {links.map(link => (
                    <ListItem
                      key={link.label}
                      disablePadding
                      onClick={async () => {
                        await navigateTo(link.href, link.external);
                        onCloseDrawer();
                      }}
                    >
                      <ListItemButton selected={link.active}>
                        <ListItemIcon sx={{ color: "onSurface" }}>{link.icon}</ListItemIcon>
                        <Typography
                          sx={{ color: "onSurface" }}
                          ml={-3}
                        >
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
            ) : (
              <Grid
                p={"16px"}
                minHeight={templates?.length === 0 ? "70vh" : "auto"}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                width={"100%"}
              >
                {isFetching ? (
                  // Render the loading spinner while fetching data
                  <Grid width={"100%"}>
                    <CardTemplatePlaceholder count={5} />
                  </Grid>
                ) : templates?.length !== 0 && !isFetching ? (
                  // Render search results
                  <Grid width={"100%"}>
                    <Grid
                      display={"flex"}
                      flexDirection={"column"}
                      gap={"8px"}
                    >
                      {templates?.map(template => (
                        <CardTemplate
                          key={template.id}
                          template={template}
                          query={debouncedSearchName}
                          asResult
                        />
                      ))}
                    </Grid>
                  </Grid>
                ) : (
                  // Render not found icon when there are no results
                  <NotFoundIcon />
                )}
              </Grid>
            )}
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
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                >
                  <Avatar
                    src={currentUser?.avatar}
                    alt={currentUser?.first_name}
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
              <MenuList
                autoFocusItem={false}
                sx={{ width: "100%" }}
              >
                {Menu.map(el => (
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
