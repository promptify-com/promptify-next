import { authClient } from "@/common/axios";
import { GetServerSideProps } from "next";

interface Template {
  slug: string;
}

interface Category {
  slug: string;
}

function generateSiteMap(templates: Template[], categories: Category[]) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://app.promptify.com</loc>
  </url>
  <url>
    <loc>https://app.promptify.com/explore</loc>
  </url>`;
  xml += templates?.reduce((acc, { slug }) => {
    acc += `<url><loc>${`https://app.promptify.com/prompt/${slug}`}</loc></url>`;

    return acc;
  }, "");
  xml += categories
    ?.filter(({ slug }) => slug !== null)
    .reduce((acc, { slug }) => {
      acc += `<url><loc>${`https://app.promptify.com/explore/${slug}`}</loc></url>`;

      return acc;
    }, "");
  xml += `</urlset>`;

  return xml;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let templates: Template[] = [];
  let categories: Category[] = [];
  const [_templates, _categories] = await Promise.allSettled([
    authClient.get("/api/meta/templates/"),
    authClient.get("/api/meta/categories/"),
  ]);

  if (_templates.status === "fulfilled") {
    templates = _templates.value.data as Template[];
  }
  if (_categories.status === "fulfilled") {
    categories = _categories.value.data as Category[];
  }

  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=60");
  res.setHeader("Content-Type", "text/xml");
  res.write(generateSiteMap(templates, categories));
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
