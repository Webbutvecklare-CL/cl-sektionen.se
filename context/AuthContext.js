import React, { createContext, useContext, useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/clientApp";
import { validateAccountCheck, initGapi } from "../utils/authUtils";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [userData, setUserData] = useState();
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
            console.log("Inloggad");
            setUserData(data);

            // Initierar google api för kalender
            initGapi(user);
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
    <AuthContext.Provider value={{ user, userData, logOut, setUserData, signingIn }}>
      {children}
    </AuthContext.Provider>
  );
};
