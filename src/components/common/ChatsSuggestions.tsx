import Stack from "@mui/material/Stack";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import AddCircleOutlineRounded from "@mui/icons-material/AddCircleOutlineRounded";
import Grid from "@mui/material/Grid";
import { useGetChatsQuery } from "@/core/api/chats";
import SuggestionCard, { Avatar } from "@/components/Homepage/SuggestionCard";
import SuggestionCardPlaceholder from "@/components/Homepage/SuggestionCardPlaceholder";
import { RefObject } from "react";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";

interface Props {
  carouselRef?: RefObject<HTMLDivElement>;
  slice?: number;
}

function ChatsSuggestions({ carouselRef, slice = 2 }: Props) {
  const { data: chats, isLoading } = useGetChatsQuery();
  const router = useRouter();
  const theme = useTheme();
  const profilePage = router.pathname === "/profile";
  return (
    <>
      {isLoading ? (
        <Stack
          direction={"row"}
          gap={1}
          alignItems={"center"}
          flexWrap={"nowrap"}
          justifyContent={"space-between"}
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
            width={profilePage ? "100%" : "23%"}
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
            {chats?.slice(0, slice).map(chat => {
              return (
                <Grid
                  key={chat.id}
                  item
                  xs={12}
                >
                  <SuggestionCard
                    title="Chats"
                    description={chat.last_message!}
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
              mr={1}
              xs={12}
              sx={{
                ...(profilePage && {
                  [theme.breakpoints.down("md")]: {
                    mr: 0,
                  },
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
