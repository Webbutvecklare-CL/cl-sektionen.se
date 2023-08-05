import React, { useState } from "react";

import { googleLogin } from "../../utils/authUtils";
import { useAuth } from "../../context/AuthContext";

import ErrorPage from "../ErrorPage";

export default function Login() {
  const [screen, setScreen] = useState("login");
  const [error, setError] = useState("");

  const { user, setUserAccessToken, signUp, getUserData } = useAuth();

  const handleLogin = async () => {
    // Om det inte finns ett konto inloggat få användaren logga in med sitt google konto
    if (!user) {
      console.log("Manuellt inloggad!");
      try {
        const res = await googleLogin();

        // Provar att spara accessToken

        const { GoogleAuthProvider } = await import("firebase/auth");
        const credential = GoogleAuthProvider.credentialFromResult(res);
        if (credential) {
          console.log("Token sparad");
          const token = credential.accessToken;
          setUserAccessToken(token);
        }
      } catch (err) {
        // Fel med manuella inloggningen
        console.error(err);
        if (err.code == "auth/popup-closed-by-user") {
          setError("Inloggningsfönstret stängdes!");
        } else {
          setError("Fel vid inloggningen till google!");
        }
      }
    } else {
      // Det finns en användare inloggad men den har inte blivit registrerad i databasen eller fått sin behörighet
      console.log("Hämtar user data");
      try {
        const res = await getUserData(user);
        console.log(res);
        if (res === "no permission") {
          setScreen("no permission");
        } else if (res === "no uid") {
          setScreen("signup");
        }
      } catch (err) {
        setError(err.toString());
      }
    }
  };

  const handleSignup = () => {
    signUp()
      .then(() => {
        console.log("Uppgifter sparade");
        setScreen("login");
      })
      .catch((err) => {
        console.error("Fel vid inloggningen: ", err.err);
        if (err.message) {
        } else {
          setError("Det gick inte att lägga till kontot. Kolla i konsolen efter felmeddelande.");
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
      {screen === "signup" && (
        <div>
          <h3>Ditt konto verka inte vara inlagt i personalsystemet...</h3>
          <p>
            (1) Klicka på &#34;Lägg till konto&#34; och logga in igen för att lägga till din mail i
            systemet.
            <br />
            (2) Meddela därefter någon av de webbansvariga att du vill ha behörighet till
            personalrummet.
          </p>
          <button onClick={handleSignup}>Lägg till konto</button>
        </div>
      )}
      {screen === "no permission" && (
        <div>
          <h3>Du är registrerad men du saknar behörighet till personalrummet.</h3>
          <p>Be eller invänta att webbansvariga uppdatera din behörighet.</p>
          <p>
            När du har fått bekräftat att du är inlagd och fått rätt behörighet kan du testa att
            logga in igen.
          </p>
          <button onClick={handleLogin}>Logga in</button>
        </div>
      )}
    </div>
  );
}
