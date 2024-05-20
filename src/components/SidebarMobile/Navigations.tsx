import { useDeferredValue, useState } from "react";
import { useRouter } from "next/router";
import InputBase from "@mui/material/InputBase";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import HomeRounded from "@mui/icons-material/HomeRounded";
import StickyNote2 from "@mui/icons-material/StickyNote2";
import TryRounded from "@mui/icons-material/TryRounded";
import FolderSpecial from "@mui/icons-material/FolderSpecial";
import Search from "@mui/icons-material/Search";
import ExtensionRounded from "@mui/icons-material/ExtensionRounded";
import Grid from "@mui/material/Grid";
import { setSelectedKeyword } from "@/core/store/filtersSlice";
import { useGetTemplatesBySearchQuery } from "@/core/api/templates";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import useDebounce from "@/hooks/useDebounce";
import { NotFoundIcon } from "@/assets/icons/NotFoundIcon";
import { BLOG_URL } from "@/common/constants";
import { isValidUserFn } from "@/core/store/userSlice";
import CardTemplatePlaceholder from "@/components/placeholders/CardTemplatePlaceHolder";
import EditorIcon from "@/components/builder/Assets/EditorIcon";
import CardTemplateResult from "@/components/common/cards/CardTemplateResult";
import type { Link } from "@/components/SidebarMobile/Types";
import Book3 from "@/assets/icons/Book3";

interface Props {
  onCloseDrawer: () => void;
}

function Navigations({ onCloseDrawer }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const pathname = router.pathname;

  const title = useAppSelector(state => state.filters?.title ?? "");
  const isValidUser = useAppSelector(isValidUserFn);

  const [textInput, setTextInput] = useState("");
  const deferredSearchName = useDeferredValue(textInput);
  const debouncedSearchName = useDebounce<string>(deferredSearchName, 300);
  const isLearnPage = ["learn", "terms-of-use", "privacy-policy"].includes(pathname.split("/")[1]);

  const { data: templates, isFetching } = useGetTemplatesBySearchQuery(debouncedSearchName, {
    skip: !textInput.length,
  });

  const links: Link[] = [
    {
      label: "Home",
      icon: <HomeRounded />,
      href: "/",
      active: pathname == "/",
      external: false,
    },
    {
      label: "Prompts",
      icon: <StickyNote2 />,
      href: "/explore",
      active: pathname == "/explore",
      external: false,
    },
    {
      label: "Chats",
      icon: <TryRounded />,
      href: "/chat",
      active: pathname === "/chat",
      external: false,
    },
    {
      label: "Documents",
      icon: <FolderSpecial />,
      href: isValidUser ? "/sparks" : "/signin",
      active: pathname == "/sparks",
      external: false,
    },

    {
      label: "Editor",
      href: isValidUser ? `/prompt-builder/create` : "/signin",
      icon: <EditorIcon />,
      active: pathname.includes("/prompt-builder"),
      external: isValidUser,
    },
    // {
    //   label: "GPTs",
    //   icon: <ElectricBolt />,
    //   href: "/automation",
    //   active: pathname === "/automation",
    //   external: false,
    // },

    {
      label: "Chrome Extension",
      href: "#",
      icon: <ExtensionRounded />,
      active: false,
      external: false,
    },
    {
      label: "Learn",
      icon: <Book3 />,
      href: "/learn",
      active: isLearnPage,
      external: false,
    },
  ];

  const onSearchClicked = () => {
    dispatch(setSelectedKeyword(textInput));
    router.push({ pathname: "/explore" });
    onCloseDrawer();
  };

  const navigateTo = async (href: string, isExternal: boolean) => {
    if (isExternal) {
      window.open(href, "_blank");
      return;
    }

    await router.push(href);
  };

  const isInternalIcons = (item: Link) => {
    return item.label === "Editor" || item.label === "Learn";
  };

  const showTemplatesResult = textInput.length > 3;
  return (
    <Stack
      direction={"column"}
      gap={"16px"}
    >
      <Stack
        bgcolor={"surfaceContainerLow"}
        direction={"row"}
        alignItems={"center"}
        position={"relative"}
        gap={1}
        mt={"16px"}
        mx={"16px"}
        p={"8px"}
        borderRadius={"48px"}
      >
        <Search
          sx={{ fontSize: 24 }}
          onClick={onSearchClicked}
        />
        <InputBase
          sx={{ flex: 1, fontSize: 14 }}
          placeholder="Look for prompts or ask a question here..."
          onChange={e => {
            setTextInput(e.target.value);
          }}
          value={textInput ?? title}
        />
      </Stack>
      {!showTemplatesResult ? (
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            px: "8px",
            gap: "12px",
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
              sx={{ m: 0, p: 0 }}
            >
              <ListItemButton>
                <ListItemIcon sx={{ color: "secondary.light", ml: isInternalIcons(link) ? -0.5 : 0 }}>
                  {link.icon}
                </ListItemIcon>
                <Typography
                  sx={{ color: "secondary.light" }}
                  ml={isInternalIcons(link) ? -2.5 : -3}
                >
                  {link.label}
                </Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Stack
          p={"16px"}
          minHeight={templates?.length === 0 ? "70vh" : "auto"}
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {isFetching ? (
            <Stack width={"100%"}>
              <CardTemplatePlaceholder count={5} />
            </Stack>
          ) : templates?.length !== 0 && !isFetching ? (
            <Grid
              container
              gap={1}
            >
              {templates?.map(template => (
                <Grid
                  key={template.id}
                  gap={1}
                  width={"100%"}
                >
                  <CardTemplateResult
                    key={template.id}
                    title={template.title}
                    description={template.description}
                    slug={template.slug}
                    thumbnail={template.thumbnail}
                    query={debouncedSearchName}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <NotFoundIcon />
          )}
        </Stack>
      )}
    </Stack>
  );
}

export default Navigations;
