import fs from "node:fs";
import path from "node:path";
import { authClient } from "@/common/axios";
import { getCategories } from "@/hooks/api/categories";
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

  if (!!templates?.length) {
    xml += templates?.reduce((acc, { slug }) => {
      acc += `<url><loc>${`https://app.promptify.com/prompt/${slug}`}</loc></url>`;

      return acc;
    }, "");
  }

  if (!!categories?.length) {
    xml += categories
      ?.filter(({ slug }) => slug !== null)
      .reduce((acc, { slug }) => {
        acc += `<url><loc>${`https://app.promptify.com/explore/${slug}`}</loc></url>`;

        return acc;
      }, "");
  }

  xml += `</urlset>`;

  return xml;
}

export async function getStaticProps() {
  let templates: Template[] = [];
  let categories: Category[] = [];
  const [_templates, _categories] = await Promise.allSettled([authClient.get("/api/meta/templates/"), getCategories()]);

  if (_templates.status === "fulfilled") {
    templates = _templates.value.data as Template[];
  }
  if (_categories.status === "fulfilled") {
    categories = _categories.value;
  }

  const sitemap = generateSiteMap(templates, categories);

  fs.writeFileSync(path.join(process.cwd(), "public", "sitemap.xml"), sitemap);

  return {
    props: {},
    revalidate: 86400,
  };
}

function SiteMap() {
  return null;
}

export default SiteMap;
