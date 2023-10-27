import { formatDate, timeAgo } from "@/common/helpers/timeManipulation";

function useTimestampConverter() {
  const convertedTimestamp = (input: string | Date): string => {
    const _timeAgo = timeAgo(input);
    const duration = _timeAgo.replace(/(\w*)/g, chars => (chars.length >= 3 && chars !== "ago" ? chars : ""))?.trim();

    if (["minutes", "seconds", "hours", "day"].includes(duration)) {
      return _timeAgo;
    } else {
      return formatDate(input);
    }
  };

  return { convertedTimestamp };
}

export default useTimestampConverter;
