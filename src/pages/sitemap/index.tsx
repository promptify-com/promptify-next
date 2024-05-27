import fs from "node:fs";
import path from "node:path";
import { client, authClient } from "@/common/axios";
import { getCategories } from "@/hooks/api/categories";

type IData = Record<string, string>;

function generateSiteMap({
  templates = [],
  categories = [],
  gpts = [],
  users = [],
}: {
  templates: IData[];
  categories: IData[];
  gpts: IData[];
  users: IData[];
}) {
  const today = new Intl.DateTimeFormat("en-ca", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://app.promptify.com</loc>
    <lastmod>${today}</lastmod>
  </url>
  <url>
    <loc>https://app.promptify.com/privacy-policy</loc>
    <lastmod>${today}</lastmod>
  </url>
  <url>
    <loc>https://app.promptify.com/terms-of-use</loc>
    <lastmod>${today}</lastmod>
  </url>
  <url>
    <loc>https://app.promptify.com/automation</loc>
    <lastmod>${today}</lastmod>
  </url>
  <url>
    <loc>https://app.promptify.com/prompt-builder/create</loc>
    <lastmod>${today}</lastmod>
  </url>
  <url>
    <loc>https://app.promptify.com/chat</loc>
    <lastmod>${today}</lastmod>
  </url>
  <url>
    <loc>https://app.promptify.com/explore</loc>
    <lastmod>${today}</lastmod>
  </url>`;

  if (!!templates?.length) {
    xml += templates?.reduce((acc, { slug }) => {
      acc += `
  <url>
    <loc>${`https://app.promptify.com/prompt/${slug}`}</loc>
    <lastmod>${today}</lastmod>
  </url>`;

      return acc;
    }, "");
  }

  if (!!categories?.length) {
    xml += categories
      ?.filter(({ slug }) => !slug)
      .reduce((acc, { slug }) => {
        acc += `
  <url>
    <loc>${`https://app.promptify.com/explore/${slug}`}</loc>
    <lastmod>${today}</lastmod>
  </url>`;

        return acc;
      }, "");
  }

  if (!!gpts?.length) {
    xml += gpts.reduce((acc, { slug }) => {
      acc += `
  <url><loc>${`https://app.promptify.com/automation/${slug}`}</loc>
  <lastmod>${today}</lastmod>
  </url>`;

      return acc;
    }, "");
  }

  if (!!users?.length) {
    xml += users.reduce((acc, { username }) => {
      acc += `
  <url><loc>${`https://app.promptify.com/users/${username}`}</loc>
  <lastmod>${today}</lastmod>
  </url>`;

      return acc;
    }, "");
  }

  xml += `
</urlset>`;

  return xml;
}

export async function getStaticProps() {
  let templates: IData[] = [];
  let categories: IData[] = [];
  let gpts: IData[] = [];
  let users: IData[] = [];
  const [_templates, _categories, _gpts, _users] = await Promise.allSettled([
    client.get<IData[]>("/api/meta/templates/"),
    getCategories(),
    client.get<IData[]>("/api/n8n/workflows"),
    authClient.get<IData[]>("/api/meta/users/public"),
  ]);

  if (_templates.status === "fulfilled") {
    templates = _templates.value.data;
  }
  if (_categories.status === "fulfilled") {
    categories = _categories.value as unknown as IData[];
  }
  if (_gpts.status === "fulfilled") {
    gpts = _gpts.value.data;
  }
  if (_users.status === "fulfilled") {
    users = _users.value.data;
  }

  const sitemap = generateSiteMap({ templates, categories, gpts, users });

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
