import "/styles/styles.css";
import "/styles/footer.css";
import "/styles/kalender.css";
import "/styles/verksamhet.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Sektionen för Civilingenjör och Lärare</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="description" content="Sektionen för Civilingenjör och Lärare"/>
        <meta name="keywords" content="Clsektionen, CL-sektionen, cl-sektionen, Lärare, KTH, Student, CL"/>
        <meta name="author" content="Armin Baymani"/>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"/>
      </Head>
      <Navbar/>
      <Component {...pageProps} />
      <Footer/>
    </div>
  );
}
