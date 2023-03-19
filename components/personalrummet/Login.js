import React, { useState } from "react";

import { googleLogin, validateAccountCheck, createUser } from "../../utils/authUtils";
import { useAuth } from "../../context/AuthContext";

import { GoogleAuthProvider } from "firebase/auth";

import ErrorPage from "../ErrorPage";

export default function Login() {
  const [screen, setScreen] = useState("login");
  const [error, setError] = useState("");

  const { user, setUserData, logOut, setUserAccessToken } = useAuth();

  const handleLogin = () => {
    googleLogin()
      .then((result) => {
        console.log("Manuellt inloggad!");
        // Användaren har loggat in med sin förtroendevalds-mail
        // Validera kontot om det finns i databasen och har permission samt nämndtillhörighet
        validateAccountCheck(result.user)
          .then((data) => {
            if (data) {
              data.uid = result.user.uid;
              // Kontot finns inlagt i systemet
              console.log("Inloggad");
              setUserData(data);

              // Sparar accessToken för Google API (typ kalender) lokalt
              const credential = GoogleAuthProvider.credentialFromResult(result);
              const token = credential.accessToken;
              setUserAccessToken(token);
            } else {
              // Kontot är inte inlagt i systemet
              console.log(
                "Din mailadress är inte inlagd i systemet eller så saknar du behörighet!"
              );
              setError("Din mailadress är inte inlagd i systemet eller så saknar du behörighet!");
              setScreen("signup");
            }
          })
          .catch((err) => {
            // Om något gått snett vid valideringen eller inladdningen av posts
            // ska användaren loggas ut
            console.error(err);
            setError("Något gick fel vid valideringen!");
            if (user) {
              logOut();
            }
          });
      })
      .catch((err) => {
        console.error(err);
        if (err.code == "auth/popup-closed-by-user") {
          setError("Inloggningsfönstret stängdes!");
        } else {
          setError("Fel vid inloggningen till google!");
        }
      });
  };

  const handleSignup = () => {
    // Om den förtroendevalda inte finns i user databasen kan den lägga in sin mail och sitt namn
    googleLogin()
      .then((result) => {
        // Användaren har loggat in
        try {
          // Försöker skapa ett doc i user databasen
          createUser(result.user);
          setScreen("login");
        } catch (err) {
          // Om något gått fel med skapandet av användar-doc så loggas användaren ut
          console.error("Fel vid inloggningen: ", err);
          if (user) {
            logOut();
          }
          setError("Det gick inte att lägga till kontot. Kolla i konsolen efter felmeddelande.");
          return;
        }
      })
      .catch((err) => {
        console.error(err);
        if (error.code == "auth/popup-closed-by-user") {
          setError("Inloggningsfönstret stängdes!");
        } else {
          setError("Fel vid inloggningen till google!");
        }
      });
  };

  if (error) {
    return (
      <ErrorPage
        error={{ header: "Ett fel inträffade vid inloggningen", body: error }}
        close={() => {
          setError("");
        }}
      />
    );
  }

  return (
    <div>
      {screen === "login" && (
        <div>
          <button onClick={handleLogin}>Logga in</button>
        </div>
      )}
      {screen == "signup" && (
        <div>
          <p>
            Ditt konto verka inte vara inlagt i personalsystemet...
            <br />
            Klicka på &#34;Lägg till konto&#34; för att lägga till din mail i systemet. Meddela
            därefter någon av de webbansvariga att du vill ha behörighet till personalrummet.
          </p>
          <button onClick={handleSignup}>Lägg till konto</button>
        </div>
      )}
    </div>
  );
}
