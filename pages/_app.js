import "/styles/root.css";
import "/styles/index.css";
import "/styles/contents.css";
import "/styles/nav.css";
import "/styles/footer.css";
import "/styles/kalender.css";
import "/styles/verksamhet.css";
import "/styles/fortroendevalda.css";
import "/styles/hedersmedlemmar.css";
import "/styles/publicera.css";
import "/styles/aktuellt.css";
import "/styles/feed-preview.css";
import "/styles/reseberattelser.css";
import "/styles/personalrummet.css";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";
import Script from "next/script";
import { AuthContextProvider } from "../context/AuthContext";

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Sektionen för Civilingenjör och Lärare</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1" />
        <meta name="description" content="Sektionen för Civilingenjör och Lärare" />
        <meta
          name="keywords"
          content="Clsektionen, CL-sektionen, cl-sektionen, Lärare, KTH, Student, CL"
        />
        <meta name="author" content="Armin Baymani" />
        <link rel="shortcut icon" type="image/x-icon" href="/media/grafik/favicon/favicon.ico" />
        <>
          <Script src="https://apis.google.com/js/api.js" type="text/javascript" async />
        </>
      </Head>

      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
      <Analytics />
      <Footer />
      <Navbar />
    </div>
  );
}
