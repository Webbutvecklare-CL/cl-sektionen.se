import { app } from "../firebase/clientApp";
import { getFirestore, getDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
const firestore = getFirestore(app);

function googleLogin() {
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/calendar");

  provider.setCustomParameters({
    hd: "cl-sektionen.se",
    login_hint: "post@cl-sektionen.se",
  });

  const auth = getAuth();
  return signInWithPopup(auth, provider);
}

async function validateAccountCheck(user) {
  console.log("getDoc - Get user validate");
  // Försöker hämta användaren
  const userRef = doc(firestore, "users", user.uid);
  let docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    if (!docSnap.data().committee || !docSnap.data().permission) {
      return { ok: false, message: "no permission" };
    }
    return { ok: true, data: docSnap.data() };
  } else {
    // doc.data() will be undefined in this case
    return { ok: false, message: "no uid" };
  }
}

function createUser(user) {
  console.log("setDoc - Skapar användare");
  let profileInfo = {
    displayName: user.displayName,
    email: user.email,
    committee: "",
    permission: "",
  };

  const userRef = doc(firestore, "users", user.uid);
  return setDoc(userRef, profileInfo);
}

function updateUser(user) {
  console.log("updateDoc - Update user");
  let profileInfo = {
    displayName: user.displayName,
    email: user.email,
  };

  const userRef = doc(firestore, "users", user.uid);

  return updateDoc(userRef, profileInfo);
}

async function reauthenticate() {
  return new Promise((resolve, reject) => {
    googleLogin()
      .then(async (result) => {
        console.log("Omautentiserad!");
        // Användaren har loggat in med sin förtroendevalds-mail
        // Förutsätter att användaren loggat in tidigare dvs att userData finns
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        resolve(token);
      })
      .catch((err) => {
        console.error(err);
        if (err.code == "auth/popup-closed-by-user") {
          setError("Inloggningsfönstret stängdes!");
        } else {
          setError("Fel vid inloggningen till google!");
        }
        reject();
      });
  });
}

export { googleLogin, validateAccountCheck, createUser, updateUser, reauthenticate };
