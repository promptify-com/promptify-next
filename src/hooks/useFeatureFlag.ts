import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function useFeatureFlag(featureFlagKey: string) {
  const [isFeatureFlagEnabled, setFeatureFlag] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.has(featureFlagKey)) {
      setFeatureFlag(true);
    }
  }, []);

  return {
    isFeatureFlagEnabled,
  };
}
