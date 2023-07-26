import { LogoApp } from "@/assets/icons/LogoApp";
import {
  AutoAwesome,
  Clear,
  ClearRounded,
  HomeRounded,
  MenuBookRounded,
  Search,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListSubheader,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { CollectionsEmptyBox } from "./common/sidebar/CollectionsEmptyBox";

interface SideBarMobileProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}
const links = [
  {
    label: "Homepage",
    icon: <HomeRounded />,
    href: "/",
    external: false,
  },
  {
    label: "Browse",
    icon: <Search />,
    href: "/explore",
    external: false,
  },
  {
    label: "My Sparks",
    icon: <AutoAwesome />,
    href: "/sparks",
    external: false,
  },
  {
    label: "Learn",
    icon: <MenuBookRounded />,
    href: "https://promptify.com",
    external: true,
  },
];
export const SideBarMobile: React.FC<SideBarMobileProps> = ({
  open,
  onClose,
  onOpen,
}) => {
  const router = useRouter();
  const pathname = router.pathname;
  const splittedPath = pathname.split("/");

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
          </Grid>
          <Grid
            display={{ xs: "flex", md: "none" }}
            alignItems={"center"}
            mr={1}
            gap={2}
          >
            <Avatar
              sx={{
                width: "23px",
                height: "23px",
                bgcolor: "#56575c",
              }}
              src="John Doe"
              alt="John Doe"
            />
            <Box
              onClick={onClose}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <ClearRounded sx={{ fontSize: "26px", color: "#56575c" }} />
            </Box>
          </Grid>
        </Grid>
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
            <InputBase sx={{ flex: 1 }} placeholder="Search for templates..." />
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
                  <ListItemButton>
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
            <List subheader={<ListSubheader>COLLECTION</ListSubheader>}>
              <CollectionsEmptyBox onExpand />
            </List>
          </Box>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};
