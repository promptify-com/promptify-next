import { useEffect, useState } from "react";

function useCopyToClipboard() {
  const [result, setResult] = useState<null | { state: "success" } | { state: "error"; message: string }>(null);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setResult({ state: "success" });
    } catch (e: any) {
      setResult({ state: "error", message: e.message });
    } finally {
      setTimeout(() => {
        setResult(null);
      }, 1000);
    }
  };

  return [copy, result] as const;
}

export default useCopyToClipboard;
