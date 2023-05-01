import "/styles/root.css";
import "/styles/index.css";
import "/styles/contents.css";
import "/styles/nav.css";
import "/styles/footer.css";
import "/styles/kalender.css";
import "/styles/dokument.css";
import "/styles/fortroendevalda.css";
import "/styles/hedersmedlemmar.css";
import "/styles/publicera.css";
import "/styles/aktuellt.css";
import "/styles/feed-preview.css";
import "/styles/featured-preview.css";
import "/styles/reseberattelser.css";
import "/styles/personalrummet.css";
import "/styles/hedersorden.css";
import "/styles/TV.css";
import "/styles/sangbok.css";
import "/styles/kontakt.css";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "../components/nav/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";
import { useRouter } from "next/router";
import { AuthContextProvider } from "../context/AuthContext";

import { onMessage, getMessaging, isSupported } from "firebase/messaging";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // När sidan laddas in startas en notis hanterare som hanterar foreground(webbläsaren i fokus) notiser
  useEffect(() => {
    // Vissa webbläsare stödjer inte foreground notiser (de flesta mobiler)
    isSupported().then((yes) => {
      if (!yes) {
        console.log("Notiser stödjs inte på din enhet eller webbläsare.");
        return;
      }

      messageListener();
    });
  }, [router]);

  if (router.pathname.includes("/TV")) {
    return <Component {...pageProps} />;
  }

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

function messageListener() {
  const messaging = getMessaging();

  // This will fire when a message is received while the app is in the foreground.
  // When the app is in the background, firebase-messaging-sw.js will receive the message instead.
  onMessage(messaging, (payload) => {
    console.log("New foreground notification!", payload);

    // Det finns olika typer data och notification. Se och läs noga "Message types"
    // https://firebase.google.com/docs/cloud-messaging/concept-options#notifications_and_data_messages
    const message = payload.notification || payload.data;

    // Skapa notisen
    const title = message.title;
    const options = {
      body: message.body,
      icon: message.icon || "/media/grafik/favicon/android-chrome-512x512.png",
      image: message.image,
      link: message.link,
    };

    // Visar notisen och lägger till ett klick event
    let notification = new Notification(title, options);
    notification.addEventListener("click", () => {
      notification.close();
      if (message.link) {
        router.push(message.link);
      }
    });
  });
}
