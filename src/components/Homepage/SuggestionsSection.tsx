import { useRef } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import AddCircleOutlineRounded from "@mui/icons-material/AddCircleOutlineRounded";
import Grid from "@mui/material/Grid";

import { useAppSelector } from "@/hooks/useStore";
import { useGetChatsQuery } from "@/core/api/chats";
import useCarousel from "@/hooks/useCarousel";
import SuggestionCard, { Avatar } from "@/components/Homepage/SuggestionCard";
import SuggestionCardPlaceholder from "@/components/Homepage/SuggestionCardPlaceholder";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";

function SuggestionsSection() {
  const { data: chats, isLoading } = useGetChatsQuery();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const carouselContainerRef = useRef<HTMLDivElement | null>(null);

  const { containerRef: carouselRef, scrollNext, scrollPrev } = useCarousel(true);

  return (
    <Stack
      direction={"column"}
      gap={"32px"}
    >
      <Stack
        ref={carouselContainerRef}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack gap={1}>
          <Typography
            fontSize={32}
            fontWeight={400}
            lineHeight={"38.4px"}
            letterSpacing={"0.17px"}
          >
            Welcome, {currentUser?.username}
          </Typography>
          <Typography
            fontSize={16}
            fontWeight={400}
            lineHeight={"25.5px"}
            letterSpacing={"0.17px"}
          >
            Suggestions for you:
          </Typography>
        </Stack>
        <CarouselButtons
          scrollPrev={scrollPrev}
          scrollNext={scrollNext}
          canScrollNext={true}
          canScrollPrev={true}
        />
      </Stack>
      {isLoading ? (
        <Stack
          direction={"row"}
          gap={1}
          alignItems={"center"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
        >
          <SuggestionCardPlaceholder />
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
            {chats?.slice(0, 2).map(chat => {
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
                href="/profile"
              />
            </Grid>
          </Grid>
        </Stack>
      )}
    </Stack>
  );
}

export default SuggestionsSection;
