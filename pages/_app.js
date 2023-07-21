import "/styles/root.css";
import "/styles/contents.css";
import "/styles/fortroendevalda.css";
import "/styles/publicera.css";
import "/styles/aktuellt.css";
import "/styles/feed-preview.css";
import "/styles/featured-preview.css";
import "/styles/reseberattelser.css";
import "/styles/sangbok.css";
import "/styles/ordbok.css";
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
import { useEffect, useState } from "react";
import CustomHead from "../components/CustomHead";
import CookieBanner from "../components/CookieBanner";

import { getCookie, setCookie } from "../utils/cookieUtils";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [cookiesAllowed, setCookiesAllowed] = useState(false);

  // Aktivera messageListener
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
  }, [router]);

  // Sätter en event listener på när användaren byter sida för att logga
  useEffect(() => {
    // Skapar en event listener på när sidan uppdateras och loggar då sidvisningen
    const logScreenEvent = (url) => {
      if (analytics) {
        logEvent(analytics, "screen_view", { screen_path: url });
      }
    };

    router.events.on("routeChangeComplete", logScreenEvent);
    // Loggar förstasidan
    logScreenEvent("/");

    //Remove Event Listener after un-mount
    return () => {
      router.events.off("routeChangeComplete", logScreenEvent);
    };
  }, [router]);

  useEffect(() => {
    // Kollar om användaren har godkänt kakor
    const allowCookies = getCookie("allowCookies");
    if (allowCookies === "true") {
      setCookiesAllowed(true);
    } else if (allowCookies === "false") {
      setCookiesAllowed(false);
    } else {
      // Om användaren inte har godkänt kakor visas cookie banner
      setShowCookieBanner(true);
    }
  }, []);

  const setCookieState = (value) => {
    if (value) {
      console.log("cookies allowed");
      setCookie("allowCookies", "true", 365);
      setCookiesAllowed(true);
    }
    if (!value) {
      console.log("cookies not allowed");
      setCookie("allowCookies", "false", 21);
      setCookiesAllowed(false);

      // Rensar existerande cookies
      const cookies = document.cookie.split(";");
      const requiredCookies = ["mottagning_key", "allowCookies"];
      for (let cookie of cookies) {
        const [name] = cookie.trim().split("=");
        if (!requiredCookies.includes(name)) {
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      }
    }
    setShowCookieBanner(false);
  };

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1" />
      </Head>
      {/* För att få en snygg banner när man dela länken i sociala medier */}
      <CustomHead
        metaTitle={"Sektionen för Civilingenjör och Lärare"}
        description={description}
        image={cl_banner}
        url={"https://www.cl-sektionen.se/"}
      />
      {/* AuthContext behövs inte utanför personalrummet */}
      {!router.pathname.startsWith("/personalrummet") && (
        <Component {...pageProps} cookiesAllowed={cookiesAllowed} setCookieState={setCookieState} />
      )}
      {router.pathname.startsWith("/personalrummet") && (
        <AuthContextProvider>
          <Component
            {...pageProps}
            cookiesAllowed={cookiesAllowed}
            setCookieState={setCookieState}
          />
        </AuthContextProvider>
      )}
      <Footer />
      <Navbar />
      {cookiesAllowed && <Analytics />}
      {showCookieBanner && <CookieBanner setCookieState={setCookieState} />}
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
