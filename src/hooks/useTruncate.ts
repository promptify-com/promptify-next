interface TruncateOptions {
  length: number;
  omission?: string;
}

const useTruncate = () => {
  const truncate = (text: string, options: TruncateOptions) => {
    if (!text) {
      return "";
    }

    const { length, omission = "..." } = options;

    if (text.length > length) {
      return text.substring(0, length - omission.length) + omission;
    } else {
      return text;
    }
  };

  return { truncate };
};

export default useTruncate;
