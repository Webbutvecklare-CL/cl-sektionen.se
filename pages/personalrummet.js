import { useState } from "react";

import { googleLogin, validateAccountCheck, createUser } from "../utils/authUtils";
import { signOut } from "firebase/auth";

import UserMenu from "../components/personalrummet/UserMenu";

export default function Personalrummet() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState();
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = () => {
    googleLogin()
      .then((result) => {
        // Användaren har loggat in med sin förtroendevalds-mail
        // Validera kontot om det finns i databasen och har permission samt nämndtillhörighet
        validateAccountCheck(result.user)
          .then((data) => {
            if (data) {
              data.uid = result.user.uid;
              // Kontot finns inlagt i systemet
              console.log("Inloggad");
              setUser(data);

              setScreen("menu");
            } else {
              // Kontot är inte inlagt i systemet
              console.log(
                "Din mailadress är inte inlagd i systemet eller så saknar du behörighet!"
              );
              setErrorMsg(
                "Din mailadress är inte inlagd i systemet eller så saknar du behörighet! Kontakta webbansvariga."
              );
              setScreen("signup");
            }
          })
          .catch((error) => {
            // Om något gått snett vid valideringen eller inladdningen av posts
            // ska användaren loggas ut
            console.log(error);
            setScreen("login");
            setErrorMsg("Något gick fel vid valideringen!");
            signOut();
          });
      })
      .catch((error) => {
        console.log(error);
        setError("Fel vid inloggningen till google!");
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
          signOut();
          setErrorMsg("Det gick inte att lägga till kontot. Kolla i konsolen efter felmeddelande.");
        }
      })
      .catch((error) => {
        // Något har gått fel vid inloggningen
        console.log(error);
        setErrorMsg("Fel vid inloggningen till google!");
      });
  };

  return (
    <div id="contentbody">
      <h1>Personalrummet</h1>

      {user && <UserMenu user={user} />}

      {!user && screen === "login" && (
        <div>
          <p>
            Här kan du hitta nämndens tidigare inlägg, lägga upp nya och göra andra kul grejjor!
            <br /> För att använda alla finesser i personalrummet måste du logga in!
          </p>
          <button onClick={handleLogin}>Logga in</button>
        </div>
      )}
      {!user && screen === "signup" && (
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

      {screen == "error" && (
        <div>
          <p>{errorMsg}</p>
          <p>Vänligen kontakta webbansvariga!</p>
        </div>
      )}

      {errorMsg && <p>{errorMsg}</p>}
    </div>
  );
}
