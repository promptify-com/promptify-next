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
import ChatsSuggestions from "../common/ChatsSuggestions";

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
      <ChatsSuggestions carouselRef={carouselRef} />
    </Stack>
  );
}

export default SuggestionsSection;
