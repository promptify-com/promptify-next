import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import AutoHeight from "embla-carousel-auto-height";
import useEmblaCarousel from "embla-carousel-react";
import { RefObject, useCallback, useEffect, useState } from "react";

interface Props {
  autoplay?: boolean;
  autoHeight?: boolean;
  options?: EmblaOptionsType;
  skipSnaps?: boolean;
  slidesToScroll?: number;
}

export default function useCarousel({
  autoplay = false,
  autoHeight = false,
  skipSnaps = false,
  slidesToScroll = 1,
  options,
}: Props = {}) {
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(true);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  const plugins = [];
  if (autoplay) plugins.push(Autoplay());
  if (autoHeight) plugins.push(AutoHeight());

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      containScroll: "trimSnaps",
      dragFree: true,
      loop: true,
      align: "start",
      skipSnaps,
      slidesToScroll,
      ...options,
    },
    plugins,
  );

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setCanScrollNext(emblaApi.canScrollNext());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setSelectedSlide(emblaApi.selectedScrollSnap());
    setTotalSlides(emblaApi.slideNodes().length);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((slide: number) => emblaApi && emblaApi.scrollTo(slide), [emblaApi]);

  return {
    containerRef: emblaRef as unknown as RefObject<HTMLDivElement>,
    scrollNext,
    scrollPrev,
    canScrollNext,
    canScrollPrev,
    scrollTo,
    selectedSlide,
    totalSlides,
  };
}
