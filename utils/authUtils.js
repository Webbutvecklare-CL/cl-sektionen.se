import { app } from "../firebase/clientApp";
import { getFirestore, getDoc, setDoc, doc, updateDoc } from "firebase/firestore";

async function googleLogin() {
  const { GoogleAuthProvider } = await import("firebase/auth");
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/calendar");

  provider.setCustomParameters({
    hd: "cl-sektionen.se",
    login_hint: "post@cl-sektionen.se",
  });

  const { getAuth } = await import("firebase/auth");
  const auth = getAuth();

  const { signInWithPopup } = await import("firebase/auth");
  return signInWithPopup(auth, provider);
}

async function validateAccountCheck(user) {
  console.log("getDoc - Get user validate");
  // Försöker hämta användaren
  const firestore = getFirestore(app);
  const userRef = doc(firestore, "users", user.uid);
  const docSnap = await getDoc(userRef);
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
  const profileInfo = {
    displayName: user.displayName,
    email: user.email,
    committee: "",
    permission: "",
  };
  const firestore = getFirestore(app);
  const userRef = doc(firestore, "users", user.uid);
  return setDoc(userRef, profileInfo);
}

function updateUser(user) {
  console.log("updateDoc - Update user");
  const profileInfo = {
    displayName: user.displayName,
    email: user.email,
  };
  const firestore = getFirestore(app);
  const userRef = doc(firestore, "users", user.uid);

  return updateDoc(userRef, profileInfo);
}

export { googleLogin, validateAccountCheck, createUser, updateUser };
