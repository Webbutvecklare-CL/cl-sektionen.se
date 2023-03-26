import React, { createContext, useContext, useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/clientApp";
import { validateAccountCheck } from "../utils/authUtils";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({}); // Sparar google user uppgifter
  const [userData, setUserData] = useState(); // Sparar data som finns på firebase under /user/{uid}
  const [userAccessToken, setUserAccessToken] = useState(); // Användarens access token för google api
  const [signingIn, setSigningIn] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // Kollar om google kontot har tillgång till personalrummet
        // Om så spara dess uppgifter - nämnd osv
        validateAccountCheck(user).then((data) => {
          if (data) {
            data.uid = user.uid;
            // Kontot finns inlagt i systemet
            console.log("Auto Inloggad");
            setUserData(data);
          } else {
            // Kontot är inte inlagt i systemet
            console.log("Din mailadress är inte inlagd i systemet eller så saknar du behörighet!");
            logOut();
          }
        });
      } else {
        setUser();
        setUserData();
      }
    });
    setSigningIn(false);

    return () => unsubscribe();
  }, []);

  const logOut = async () => {
    setUser();
    setUserData();
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signingIn,
        userData,
        setUserData,
        logOut,
        userAccessToken,
        setUserAccessToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
