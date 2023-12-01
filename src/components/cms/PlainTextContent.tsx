import { useGetContentBySectioNameQuery } from "@/core/api/cms";

interface Props {
  fallback?: string;
  sectionName: string;
}

export function PlainTextContent({ fallback, sectionName }: Props) {
  const { data: variationContent } = useGetContentBySectioNameQuery(sectionName);
  let content = variationContent?.content;

  if (!variationContent) {
    if (!fallback) {
      return null;
    }

    content = fallback;
  }

  return content;
}
