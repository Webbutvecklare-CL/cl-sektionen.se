import "/styles/root.css";
import "/styles/contents.css";
import "/styles/nav.css";
import "/styles/footer.css";
import "/styles/dokument.css";
import "/styles/fortroendevalda.css";
import "/styles/publicera.css";
import "/styles/aktuellt.css";
import "/styles/feed-preview.css";
import "/styles/featured-preview.css";
import "/styles/reseberattelser.css";
import "/styles/TV.css";
import "/styles/sangbok.css";
import "/styles/ordbok.css";
import "/styles/components.css";
import "/styles/fontawesome-all.min.css";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "../components/nav/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";
import { useRouter } from "next/router";
import { AuthContextProvider } from "../context/AuthContext";

import { analytics } from "../firebase/clientApp";
import { logEvent } from "firebase/analytics";
import { onMessage, getMessaging, isSupported } from "firebase/messaging";
import { useEffect } from "react";
import CustomHead from "../components/CustomHead";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Körs första gången sidan laddas in
  useEffect(() => {
    // När sidan laddas in startas en notis hanterare som hanterar foreground(webbläsaren i fokus) notiser
    // Vissa webbläsare stödjer inte foreground notiser (de flesta mobiler)
    isSupported().then((yes) => {
      if (!yes) {
        console.log("Notiser stödjs inte på din enhet eller webbläsare.");
        return;
      }

      const click_event = (link) => {
        router.push(link);
      };

      messageListener(click_event);
    });

    // Skapar en event listener på när sidan uppdateras och loggar då sidvisningen
    const logScreenEvent = (url) => {
      logEvent(analytics, "screen_view", { screen_path: url });
    };

    router.events.on("routeChangeComplete", logScreenEvent);
    // Loggar förstasidan
    logScreenEvent("/");

    //Remove Event Listener after un-mount
    return () => {
      router.events.off("routeChangeComplete", logScreenEvent);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gör så att TV routen inter får massa annat skit som inte behövs typ meta tags, footer osv
  if (router.pathname.includes("/TV")) {
    return <Component {...pageProps} />;
  }

  const description =
    "Sektionen för Civilingenjör & Lärare representerar och stödjer studenter på programmet för Civilingenjör och Lärare samt studenter som läser KPU.";
  const cl_banner = "https://cl-sektionen.se/media/grafik/CL Banner.webp";
  return (
    <div>
      <Head>
        <title>Sektionen för Civilingenjör och Lärare</title>
      </Head>
      {/* För att få en snygg banner när man dela länken i sociala medier */}
      <CustomHead
        metaTitle={"Sektionen för Civilingenjör och Lärare"}
        description={description}
        image={cl_banner}
        url={"https://www.cl-sektionen.se/"}
      />
      {/* AuthContext behövs inte utanför personalrummet */}
      {!router.pathname.startsWith("/personalrummet") && <Component {...pageProps} />}
      {router.pathname.startsWith("/personalrummet") && (
        <AuthContextProvider>
          <Component {...pageProps} />
        </AuthContextProvider>
      )}
      <Analytics />
      <Footer />
      <Navbar />
    </div>
  );
}

function messageListener(click_event) {
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
        click_event(message.link);
      }
    });
  });
}
