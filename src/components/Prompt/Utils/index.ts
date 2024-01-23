export const isImageOutput = (output: string, engineType: "TEXT" | "IMAGE"): boolean => {
  try {
    const imgURL = new URL(output);
    const IsImage = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"].some(extension =>
      imgURL.pathname.endsWith(extension),
    );

    return IsImage || engineType === "IMAGE";
  } catch {
    return false;
  }
};
