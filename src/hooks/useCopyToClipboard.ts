import { useEffect, useState } from "react";

function useCopyToClipboard() {
  const [result, setResult] = useState<null | { state: "success" } | { state: "error"; message: string }>(null);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setResult({ state: "success" });
    } catch (e: any) {
      setResult({ state: "error", message: e.message });
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (result !== null) {
      timeoutId = setTimeout(() => {
        setResult(null);
      }, 2000);
    }

    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [result]);

  return [copy, result] as const;
}

export default useCopyToClipboard;
