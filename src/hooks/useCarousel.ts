import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import type { OptionsType } from "embla-carousel-autoplay/components/Options";
import useEmblaCarousel from "embla-carousel-react";
import { RefObject, useCallback, useEffect, useState } from "react";

export default function useCarousel(autoplay = false, options?: EmblaOptionsType) {
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(true);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [slideNodes, setSlideNodes] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      containScroll: "trimSnaps",
      dragFree: true,
      loop: true,
      align: "start",
      ...options,
    },
    autoplay ? [Autoplay()] : [],
  );

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setCanScrollNext(emblaApi.canScrollNext());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setSelectedSlide(emblaApi.selectedScrollSnap());
    setSlideNodes(emblaApi.slideNodes().length);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return {
    containerRef: emblaRef as unknown as RefObject<HTMLDivElement>,
    scrollNext,
    scrollPrev,
    canScrollNext,
    canScrollPrev,
    selectedSlide,
    slideNodes,
  };
}
