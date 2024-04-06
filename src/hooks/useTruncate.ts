interface TruncateOptions {
  length: number;
  omission?: string;
}

const useTruncate = () => {
  const truncate = (text: string, options: TruncateOptions) => {
    const { length, omission = "..." } = options;

    if (!text) {
      return "";
    }

    if (text.length > length) {
      return text.substring(0, length - omission.length) + omission;
    } else {
      return text;
    }
  };

  return { truncate };
};

export default useTruncate;
