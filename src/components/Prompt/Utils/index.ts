import { EngineOutput } from "@/core/api/dto/templates";

export const isImageOutput = (output: string, engineType: EngineOutput): boolean => {
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
