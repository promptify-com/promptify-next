import Head from "next/head";
import { SEO_DESCRIPTION, SEO_TITLE } from "@/common/constants";

interface Props {
  title?: string;
  description?: string;
  image?: string;
  meta_keywords?: string;
  privateProfile?: boolean;
}

function Seo({ title, description, image, meta_keywords, privateProfile }: Props) {
  const _title = title ? `${title} | Promptify` : SEO_TITLE;
  const _description = description ?? SEO_DESCRIPTION;

  return (
    <Head>
      <title>{_title}</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1 maximum-scale=1"
      />
      <meta
        name="description"
        content={_description}
      />
      <meta
        property="og:title"
        content={_title}
      />
      <meta
        property="og:description"
        content={_description}
      />
      <meta
        property="og:image"
        content={image}
      />
      <meta
        property="keywords"
        content={meta_keywords}
      />
      {privateProfile && (
        <meta
          name="robots"
          content="noindex, nofollow"
        />
      )}
      <link
        rel="preconnect"
        href={process.env.NEXT_PUBLIC_API_URL}
      />
      <link
        rel="preconnect"
        href="https://promptify.s3.amazonaws.com"
      />
    </Head>
  );
}

export default Seo;
