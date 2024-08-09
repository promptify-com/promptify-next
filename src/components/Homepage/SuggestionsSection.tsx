import { useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "@/hooks/useStore";
import useCarousel from "@/hooks/useCarousel";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";
import ChatsSuggestions from "@/components/common/ChatsSuggestions";
import useBrowser from "@/hooks/useBrowser";

function SuggestionsSection() {
  const { isMobile } = useBrowser();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const carouselContainerRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setIsHovered] = useState(false);

  const { containerRef: carouselRef, scrollNext, scrollPrev } = useCarousel({ autoplay: !hovered });

  return (
    <Stack
      direction={"column"}
      gap={"32px"}
      onMouseEnter={e => setIsHovered(true)}
      onMouseLeave={e => setIsHovered(false)}
    >
      <Stack
        ref={carouselContainerRef}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack gap={1}>
          <Typography
            fontSize={{ xs: 24, md: 32 }}
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
        {!isMobile && (
          <CarouselButtons
            scrollPrev={scrollPrev}
            scrollNext={scrollNext}
            canScrollNext={true}
            canScrollPrev={true}
          />
        )}
      </Stack>
      <ChatsSuggestions carouselRef={carouselRef} />
    </Stack>
  );
}

export default SuggestionsSection;
