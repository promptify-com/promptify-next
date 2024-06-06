import { type ReactNode } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import useCarousel from "@/hooks/useCarousel";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";

interface Props {
  header: string;
  subheader?: string;
  children: ReactNode;
}

function CarouselSection({ header, subheader, children }: Props) {
  const { containerRef: carouselRef, scrollNext, scrollPrev } = useCarousel({ autoplay: false });

  return (
    <Stack gap={"24px"}>
      <Stack
        direction={"row"}
        alignItems={{ xs: "end", md: "center" }}
        px={{ xs: "26px", md: "80px" }}
        justifyContent={{ md: "space-between" }}
        gap={"40px"}
      >
        <Stack
          gap={"12px"}
          width={"50%"}
        >
          <Typography
            fontSize={"24px"}
            fontWeight={500}
            color={"#000"}
            lineHeight={"120%"}
          >
            {header}
          </Typography>
          <Typography
            fontSize={"14px"}
            fontWeight={400}
            color={"#000"}
            lineHeight={"150%"}
            sx={{
              opacity: 0.75,
            }}
          >
            {subheader}
          </Typography>
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"baseline"}
          justifyContent={"space-between"}
          gap={1}
        >
          <CarouselButtons
            scrollPrev={scrollPrev}
            scrollNext={scrollNext}
            canScrollNext={true}
            canScrollPrev={true}
            buttonStyle={{ color: "#000", opacity: 1, fontSize: "14px", border: "1px solid rgba(0, 0, 0, 0.10)" }}
          />
        </Stack>
      </Stack>
      <Stack
        ref={carouselRef}
        overflow={"hidden"}
        ml={{ xs: "24px", md: "80px" }}
      >
        <Stack
          gap={{ xs: "16px", md: "24px" }}
          direction={"row"}
          sx={{
            display: "flex",
            flexWrap: "nowrap",
          }}
        >
          {children}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default CarouselSection;
