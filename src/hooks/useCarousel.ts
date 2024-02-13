import { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

export default function useCarousel() {
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: "auto",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setCanScrollNext(emblaApi.canScrollNext());
    setCanScrollPrev(emblaApi.canScrollPrev());
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
    containerRef: emblaRef,
    scrollNext,
    scrollPrev,
    canScrollNext,
    canScrollPrev,
  };
}
