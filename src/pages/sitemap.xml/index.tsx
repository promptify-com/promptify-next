import { GetServerSideProps } from "next";
import fetch from "node-fetch";

const EXTERNAL_DATA_URL_PROMPT_TEMPLATES = `${process.env.NEXT_PUBLIC_API_URL}/api/meta/templates/`;
const EXTERNAL_DATA_URL_PROMPT_CATEGORIES = `${process.env.NEXT_PUBLIC_API_URL}/api/meta/categories/`;

interface Template {
  slug: string;
}

interface Category {
  slug: string;
}

function generateSiteMap(
  templates: Template[],
  categories: Category[]
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
   	<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     	<!--We manually set the two URLs we know already-->
     	<url>
       <loc>https://app.promptify.com</loc>
     	</url>
     	<url>
       	<loc>https://app.promptify.com/explore</loc>
     	</url>
     	${templates
        .map(({ slug }) => {
          return `
						<url>
							<loc>${`https://app.promptify.com/prompt/${slug}`}</loc>
						</url>
						`;
        })
        .join("")}

			${categories
				.filter(({ slug }) => slug !== null)
				.map(({ slug }) => {
					return `
						<url>
							<loc>${`https://app.promptify.com/explore/${slug}`}</loc>
						</url>
						`;
				})
				.join("")}

			
   	</urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // We make an API call to gather the URLs for our site
  const responseTemplates = await fetch(EXTERNAL_DATA_URL_PROMPT_TEMPLATES);
  const templates: Template[] = await responseTemplates.json();

	const responseCategories = await fetch(EXTERNAL_DATA_URL_PROMPT_CATEGORIES);
	const categories: Category[] = await responseCategories.json();

  // We generate the XML sitemap with the templates data
  const sitemap = generateSiteMap(templates, categories);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
