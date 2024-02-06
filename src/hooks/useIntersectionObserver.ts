import { type RefObject, useEffect, useState, useRef } from "react";

interface Props extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
  disconnectNodeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  { threshold = 0, root = null, rootMargin = "0%", freezeOnceVisible = false, disconnectNodeOnceVisible = true }: Props,
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const frozen = entry?.isIntersecting && freezeOnceVisible;
  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
    if (disconnectNodeOnceVisible && entry?.isIntersecting) {
      observerRef.current?.disconnect();
      observerRef.current = null;
    }
  };

  useEffect(() => {
    const node = elementRef?.current; // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) {
      return;
    }

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);
    observerRef.current = observer;

    observer.observe(node);

    return () => observer?.disconnect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef?.current, JSON.stringify(threshold), root, rootMargin, frozen]);

  return entry;
}
