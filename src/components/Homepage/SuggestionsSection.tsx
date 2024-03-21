import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowForward from "@mui/icons-material/ArrowForward";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";

import { useAppSelector } from "@/hooks/useStore";
import { useGetChatsQuery } from "@/core/api/chats";
import useCarousel from "@/hooks/useCarousel";
import SuggestionCard, { Avatar } from "@/components/Homepage/SuggestionCard";
import SuggestionCardPlaceholder from "@/components/Homepage/SuggestionCardPlaceholder";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";
import { useRef } from "react";

function SuggestionsSection() {
  const { data: chats, isLoading } = useGetChatsQuery();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const carouselContainerRef = useRef<HTMLDivElement | null>(null);

  const { containerRef: carouselRef, scrollNext, scrollPrev } = useCarousel(false);

  return (
    <Stack
      direction={"column"}
      gap={3}
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
          <Stack
            ref={carouselContainerRef}
            direction={"row"}
            gap={1}
            alignItems={"center"}
          >
            <SuggestionCard
              title="Chats"
              description="Start a new chat"
              avatar={
                <Avatar variant="chat">
                  <ArrowForward sx={{ color: "onPrimary", fontSize: 32 }} />
                </Avatar>
              }
              actionLabel="New chat"
              href="/chat"
            />

            {chats?.slice(0, 2).map(chat => {
              return (
                <SuggestionCard
                  key={chat.id}
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
              );
            })}

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
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}

export default SuggestionsSection;
