import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="sv">
      <Head>
        {/* <link
          rel="preload"
          as="style"
          href="/public/.min.css"
        /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
