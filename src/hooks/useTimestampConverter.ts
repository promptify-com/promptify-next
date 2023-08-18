import moment from "moment";

function useTimestampConverter() {
  const convertedTimestamp = (timestamp: string): string => {
    if (!moment(timestamp).isValid()) {
      return "Some time ago";
    }

    const date = moment(timestamp);
    const currentDate = moment();

    if (date.isSame(currentDate, "day")) {
      return date.fromNow(); // E.g., "2 hours ago"
    } else {
      return date.format("LL"); // E.g., "August 18, 2023"
    }
  };

  return { convertedTimestamp };
}

export default useTimestampConverter;
