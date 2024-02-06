import { useRef } from "react";
import useToken from "@/hooks/useToken";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useGetTemplatesByFilterQuery } from "@/core/api/templates";
import { Category } from "@/core/api/dto/templates";
import Landing from "./Landing";
import CategoryCarousel from "./CategoriesCarousel";

const ioLatestsOptions = {
  threshold: 0,
  rootMargin: "150px",
  disconnectNodeOnceVisible: true,
};
const ioPopularOptions = {
  threshold: 0.5,
  rootMargin: "100px",
  disconnectNodeOnceVisible: true,
};

function GuestUserLayout({ categories }: { categories: Category[] }) {
  const token = useToken();
  const latestTemplatesRef = useRef<HTMLDivElement | null>(null);
  const popularTemplatesRef = useRef<HTMLDivElement | null>(null);
  const latestTemplatesEntry = useIntersectionObserver(latestTemplatesRef, ioLatestsOptions);
  const popularTemplatesEntry = useIntersectionObserver(popularTemplatesRef, ioPopularOptions);
  const { data: popularTemplates } = useGetTemplatesByFilterQuery(
    {
      ordering: "-runs",
      limit: 7,
    },
    {
      skip: token || !popularTemplatesEntry?.isIntersecting,
    },
  );
  const { data: latestTemplates } = useGetTemplatesByFilterQuery(
    {
      ordering: "-created_at",
      limit: 7,
    },
    {
      skip: token || !latestTemplatesEntry?.isIntersecting,
    },
  );

  return (
    <>
      <Landing />
      <CategoryCarousel categories={categories} />
    </>
  );
}

export default GuestUserLayout;
