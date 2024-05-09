import { type RefObject } from "react";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import AddCircleOutlineRounded from "@mui/icons-material/AddCircleOutlineRounded";
import Grid from "@mui/material/Grid";
import { useGetChatsQuery } from "@/core/api/chats";
import SuggestionCard, { Avatar } from "@/components/Homepage/SuggestionCard";
import SuggestionCardPlaceholder from "@/components/Homepage/SuggestionCardPlaceholder";

interface Props {
  carouselRef?: RefObject<HTMLDivElement>;
  slice?: number;
}

function ChatsSuggestions({ carouselRef, slice = 2 }: Props) {
  const { data: chats, isLoading } = useGetChatsQuery({ limit: slice });
  const router = useRouter();
  const theme = useTheme();
  const profilePage = router.pathname === "/profile";
  const isHomePage = router.pathname === "/";

  return (
    <>
      {isLoading ? (
        <Stack
          direction={"row"}
          gap={1}
          alignItems={"center"}
          flexWrap={"nowrap"}
          justifyContent={isHomePage ? "flex-start" : "space-between"}
          sx={{
            ...(profilePage && {
              [theme.breakpoints.down("md")]: {
                flexWrap: "wrap",
                flexDirection: "column",
              },
            }),
          }}
        >
          <SuggestionCardPlaceholder
            count={2 + slice}
            width={profilePage || isHomePage ? "100%" : "23%"}
          />
        </Stack>
      ) : (
        <Stack
          ref={carouselRef}
          overflow={"hidden"}
        >
          <Grid
            container
            gap={4}
            flexWrap={"nowrap"}
            justifyContent={isHomePage ? "flex-start" : "center"}
            sx={{
              ...(profilePage && {
                [theme.breakpoints.down("md")]: {
                  flexWrap: "wrap",
                },
              }),
            }}
          >
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                maxWidth: { xs: "290px", md: "330px", xl: "100%" },
              }}
            >
              <SuggestionCard
                title="Chats"
                description="Start a new chat"
                avatar={
                  <Avatar variant="chat">
                    <AddCircleOutlineRounded sx={{ color: "onPrimary", fontSize: 32 }} />
                  </Avatar>
                }
                actionLabel="New chat"
                href="/chat"
              />
            </Grid>
            {chats?.results.map(chat => {
              return (
                <Grid
                  key={chat.id}
                  item
                  xs={12}
                  md={4}
                  sx={{
                    maxWidth: { xs: "290px", md: "330px", xl: "100%" },
                  }}
                >
                  <SuggestionCard
                    title="Chats"
                    description={chat.last_message ?? ""}
                    actionLabel="Review"
                    href={`/chat/?ci=${chat.id}`}
                    avatar={
                      <Avatar
                        variant="last_chat_entry"
                        src={chat.thumbnail}
                      />
                    }
                  />
                </Grid>
              );
            })}
            <Grid
              item
              mr={2}
              xs={12}
              md={4}
              sx={{
                maxWidth: { xs: "290px", md: "330px", xl: "100%" },
                ...(profilePage && {
                  [theme.breakpoints.down("md")]: {
                    mr: 0,
                  },
                  maxWidth: { xs: "290px", md: "330px", xl: "100%" },
                }),
              }}
            >
              <SuggestionCard
                title="Profile"
                description="Set up your public profile"
                avatar={
                  <Avatar variant="profile">
                    <AccountCircleOutlined sx={{ color: "onSurface", fontSize: 32 }} />
                  </Avatar>
                }
                actionLabel="User profile"
                href="/profile/user"
              />
            </Grid>
          </Grid>
        </Stack>
      )}
    </>
  );
}

export default ChatsSuggestions;
