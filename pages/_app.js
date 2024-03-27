import "/styles/root.css";
import "/styles/contents.css";
import "/styles/feed-preview.css";
import "/styles/featured-preview.css";
import "/styles/reseberattelser.css";
import "/styles/fontawesome-fonts.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import dynamic from "next/dynamic";
const { Analytics } = dynamic(() => import("@vercel/analytics/react"));

const NotificationBell = dynamic(() => import("../components/NotificationBell"), { ssr: false });

const PersonalrummetLayout = dynamic(() => import("@/layouts/PersonalrummetLayout"));

// React
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { getCookie, setCookie } from "../utils/cookieUtils";

// Komponenter
import Navbar from "../components/nav/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";
import CustomHead from "../components/CustomHead";
import CookieBanner from "../components/CookieBanner";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [cookiesAllowed, setCookiesAllowed] = useState(false);

  // Aktivera messageListener
  useEffect(() => {
    // När sidan laddas in startas en notis hanterare som hanterar foreground(webbläsaren i fokus) notiser
    // Vissa webbläsare stödjer inte foreground notiser (de flesta mobiler)
    mountMessagingListener(router);
  }, [router]);

  // Sätter en event listener på när användaren byter sida för att logga
  useEffect(() => {
    // Skapar en event listener på när sidan uppdateras och loggar då sidvisningen
    if (cookiesAllowed) {
      const logScreenEvent = async (url) => {
        const { getAnalytics } = await import("../firebase/clientApp");
        const analytics = await getAnalytics();
        if (analytics) {
          const { logEvent } = await import("firebase/analytics");
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
    }
  }, [router, cookiesAllowed]);

  // Kollar om användaren har godkänt kakor
  useEffect(() => {
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
      for (const cookie of cookies) {
        const [name] = cookie.trim().split("=");
        if (!requiredCookies.includes(name)) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }
      }
    }
    setShowCookieBanner(false);
  };

  // Gör så att TV route:n inter får massa annat skit som inte behövs typ meta tags, footer osv
  if (router.pathname.includes("/TV")) {
    return <Component {...pageProps} />;
  }

  const description =
    "Sektionen för Civilingenjör & Lärare representerar och stödjer studenter på programmet för Civilingenjör och Lärare samt studenter som läser KPU vid KTH.";
  const cl_banner = "https://cl-sektionen.se/media/grafik/CL Banner.webp";
  return (
    <>
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
      {/* Personalrummetlayout med AuthContext behövs inte utanför personalrummet, 
      vilket annars förlänger inladdningen av övriga sidor */}
      {!router.pathname.startsWith("/personalrummet") && (
        <Component {...pageProps} cookiesAllowed={cookiesAllowed} setCookieState={setCookieState} />
      )}
      {router.pathname.startsWith("/personalrummet") && (
        <PersonalrummetLayout>
          <Component
            {...pageProps}
            cookiesAllowed={cookiesAllowed}
            setCookieState={setCookieState}
          />
        </PersonalrummetLayout>
      )}

      {/* Klockan som visas på startsidan och övriga sidor om notiser stödjs */}
      <NotificationBell hideIfNoSupport floating messageOptions={{ delay: 2000 }} />

      <Footer />
      <Navbar />

      {cookiesAllowed && Analytics && <Analytics />}
      {showCookieBanner && <CookieBanner setCookieState={setCookieState} />}
    </>
  );
}

async function mountMessagingListener(router) {
  const { isSupported } = await import("firebase/messaging");
  isSupported().then((yes) => {
    if (!yes) {
      console.log("Notiser stödjs inte på din enhet eller webbläsare.");
      return;
    }

    // Kollar om användaren prenumererar på notiser
    const fcmTokenData = JSON.parse(localStorage.getItem("notificationSettings"));
    if (fcmTokenData) {
      // Användaren har tidigare sparat inställningar

      if (Notification.permission === "granted") {
        // Detta ska bara göras om användaren har tillåtit notiser och har en tokenData lagrat
        updateTokenData(fcmTokenData);

        // Aktiverar en event listener som lyssnar notiser
        // Click event för när användaren klickar på notisen
        messageListener((link) => {
          router.push(link);
        });
      }
    } else if (Notification.permission === "default") {
      // Informerar användaren om att de kan prenumerera på notiser
      // Visa en liten pop up som frågar/informera om notiser
      // Svara de ja får de upp notis modal:en
    }
  });
}

async function messageListener(click_event) {
  const { onMessage } = await import("firebase/messaging");
  let { messaging } = await import("../firebase/clientApp");
  messaging = await messaging();

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
      icon: message.icon || "/media/icons/icon-512x512.png",
      badge: "/media/icons/badge-330x330.webp", // Lite icon som visas på "Android Chrome"
      image: message.image,
      link: message.link,
    };

    // Visar notisen och lägger till ett klick event
    const notification = new Notification(title, options);
    notification.addEventListener("click", () => {
      notification.close();
      if (message.link) {
        click_event(message.link);
      }
    });
  });
}

async function updateTokenData(fcmTokenData) {
  //Kollar om fcmToken är uppdaterad
  const lastUpdated = new Date(fcmTokenData.lastUpdated).getTime();
  const now = new Date().getTime();

  //   const maxDiff = 1000 * 20; // 20 sekunder
  const maxDiff = 1000 * 60 * 60 * 24 * 30; // 30 dagar
  const timeDiff = now - lastUpdated;
  const old = timeDiff > maxDiff;

  if (old) {
    // Kolla om den lagrade token är samma som om en ny hämtas
    const { getFCMToken } = await import("../firebase/messaging");
    const newToken = await getFCMToken();

    // Kollar token har ändrats sen den sparades
    if (newToken !== fcmTokenData.token) {
      // Invalid token - uppdatera med nya
      fcmTokenData.token = newToken;
    }

    // Stänger av mottagningsnotiser om användaren prenumererade
    // innan 1 oktober och det är efter 1 oktober
    const dateLimit = new Date("2023-10-01");
    const now = new Date();
    dateLimit.setFullYear(now.getFullYear());
    if (new Date(fcmTokenData.lastUpdated) < dateLimit && now > dateLimit) {
      fcmTokenData.types.mottagning = false;
    }

    // Uppdatera tokenData på firebase
    try {
      const { app } = await import("../firebase/clientApp");
      const { getFirestore, doc, updateDoc } = await import("firebase/firestore");
      const firestore = getFirestore(app);
      const token = fcmTokenData.token;
      const fcmTokensRef = doc(firestore, "fcmTokens/all");
      await updateDoc(fcmTokensRef, { [token]: fcmTokenData }, { merge: true });
    } catch (error) {
      console.error(error);
    }

    // Sparar det uppdaterade fcmTokenData lokalt
    fcmTokenData.lastUpdated = new Date();
    localStorage.setItem("notificationSettings", JSON.stringify(fcmTokenData));
  }
}
