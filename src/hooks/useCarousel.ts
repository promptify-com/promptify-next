import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";

export default function useCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: "auto",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return {
    containerRef: emblaRef,
    scrollNext,
    scrollPrev,
  };
}
