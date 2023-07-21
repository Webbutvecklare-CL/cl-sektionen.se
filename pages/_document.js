import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="sv">
      <Head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" type="image/x-icon" href="/media/icons/favicon.ico" />
        <meta name="format-detection" content="telephone=no" />
        <meta
          name="keywords"
          content="Clsektionen, CL-sektionen, cl-sektionen, Lärare, KTH, Student, CL"
        />

        {/* Fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap"
        />

        {/* För PWA */}
        <link rel="manifest" href="/manifest.json" />
        <link
          href="media/icons/maskable-icon-192x192.png"
          rel="icon"
          type="image/png"
          sizes="192x192"
        />
        <link
          href="media/icons/maskable-icon-512x512.png"
          rel="icon"
          type="image/png"
          sizes="512x512"
        />
        <link rel="apple-touch-icon" href="media/icons/maskable-icon-192x192.png" />
        <meta name="theme-color" content="#d23022" />
        <meta name="background-color" content="#fafafa" />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" key="og-type" />

        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" key="tw-card" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
