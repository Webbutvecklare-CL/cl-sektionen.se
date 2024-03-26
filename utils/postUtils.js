import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase/clientApp";
const firestore = getFirestore(app);

function createId(data, type = "") {
  if (type === "SM") {
    // Kommer funka i lite mindre än 2000 år
    return `sm-${data.number}-${new Date().getFullYear() - 2000}`;
  }

  if (type === "StyM") {
    // Kommer funka i lite mindre än 2000 år
    return `stym-${data.number}-${new Date().getFullYear() - 2000}`;
  }

  data += ""; // Ser till att det är en sträng

  data = data.toLowerCase();
  data = data.replace(/[åä]/g, "a");
  data = data.replace(/ö/g, "o");
  data = data.replace(/([\W_]+){1,}/g, "-"); // Tar bort alla konstiga tecken
  data = data.replace(/[ ]{1,}/g, "-"); // Byter ut alla mellanslag till -
  data = data.replace(/-*$/, ""); // Tar bort alla bindestreck i slutet

  return data;
}

async function validateLink(data, type) {
  const exist = true;
  const unique_link = createId(data, type);

  return new Promise(async (resolve, reject) => {
    // Kolla om det finns ett dokument med den länken
    try {
      const docRef = doc(firestore, "posts", unique_link);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // Länken finns redan
        resolve(false);
      } else {
        // Länken finns inte
        resolve(unique_link);
      }
    } catch (error) {
      reject(error);
    }
  });

  // Loopar tills användaren angett en unik adress
  // while (exist) {
  //   console.log("getDoc - Validera länken");
  //   try {
  //     const docSnap = await getDoc(doc(firestore, "posts", unique_link));
  //     if (docSnap.exists()) {
  //       unique_link = prompt("Ange en unik adress:", "unik-adress");
  //       if (unique_link == null || unique_link == "") {
  //         //Användaren avbröt
  //         return false;
  //       } else {
  //         //Gör något test så länken faktiskt fungerar
  //         unique_link = create_id(unique_link);
  //       }
  //     } else {
  //       // Adressen var unik -> fortsätt försöka skicka data
  //       exist = false;
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  // return unique_link;
}

// Ändrar värdet så att det är en korrekt länk
const getTypedLink = (txt) => {
  if (txt.endsWith(" ")) {
    // Låter användaren skriva mellan slag som om de lägger till fler tecken blir ett -
    return createId(txt) + " ";
  } else if (txt.endsWith("-")) {
    // Låter användaren skriva in - som försvinner om inga fler tecken läggs till
    return createId(txt) + "-";
  } else {
    return createId(txt);
  }
};

export { validateLink, createId, getTypedLink };
