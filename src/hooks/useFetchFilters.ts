import {
  useGetEnginesQuery,
  useGetTagsPopularQuery,
} from "@/core/api/explorer";
import { useRouter } from "next/router";

export function useFetchFilters() {
  const router = useRouter();
  const pathname = router.pathname;
  const splittedPath = pathname.split("/");
  const isExplorePage = splittedPath[1] == "explore";

  const tagsQuery = isExplorePage ? useGetTagsPopularQuery() : undefined;
  const enginesQuery = isExplorePage ? useGetEnginesQuery() : undefined;

  return {
    tags: tagsQuery?.data,
    engines: enginesQuery?.data,
  };
}
