import Head from "next/head";

export default function CustomHead({ title, metaTitle, description, image, url }) {
  return (
    <Head>
      {title && <title key="title">{title}</title>}
      {description && <meta name="description" content={description} key="desc" />}

      {/* <!-- Open Graph / Facebook --> */}
      {url && <meta property="og:url" content={url} key="og-url" />}
      {metaTitle && <meta property="og:title" content={metaTitle} key="og-title" />}
      {description && <meta property="og:description" content={description} key="og-desc" />}
      {image && <meta property="og:image" content={image} key="og-image" />}

      {/* <!-- Twitter --> */}
      {url && <meta property="twitter:url" content={url} key="tw-url" />}
      {metaTitle && <meta property="twitter:title" content={metaTitle} key="tw-title" />}
      {description && <meta property="twitter:description" content={description} key="tw-desc" />}
      {image && <meta property="twitter:image" content={image} key="tw-image" />}
    </Head>
  );
}
