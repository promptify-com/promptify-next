function useTimestampConverter() {
  const convertedTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const currentDate = new Date();

    if (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    ) {
      const hours = date.getHours();
      return `${hours} hours ago`;
    } else {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString(undefined, options);
    }
  };

  return { convertedTimestamp };
}

export default useTimestampConverter;
