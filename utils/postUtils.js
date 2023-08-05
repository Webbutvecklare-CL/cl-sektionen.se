import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase/clientApp";
const firestore = getFirestore(app);

function create_id(data, type = "") {
  if (type === "SM") {
    // Kommer funka i lite mindre än 2000 år
    return `sm-${data.number}-${new Date().getFullYear() - 2000}`;
  }

  if (type === "StyM") {
    // Kommer funka i lite mindre än 2000 år
    return `stym-${data.number}-${new Date().getFullYear() - 2000}`;
  }

  data = data.toLowerCase();
  data = data.replace(/[åä]/g, "a");
  data = data.replace(/ö/g, "o");
  data = data.replace(/([\W_]+){1,}/g, "-"); // Tar bort alla konstiga tecken
  data = data.replace(/[ ]{1,}/g, "-"); // Byter ut alla mellanslag till -
  data = data.replace(/-*$/, ""); // Tar bort alla bindestreck i slutet

  return data;
}

async function validateLink(data, type) {
  let exist = true;
  let unique_link = create_id(data, type);
  while (exist) {
    console.log("getDoc - Validera länken");
    try {
      const docSnap = await getDoc(doc(firestore, "posts", unique_link));
      if (docSnap.exists()) {
        unique_link = prompt("Ange en unik adress:", "unik-adress");
        if (unique_link == null || unique_link == "") {
          //Användaren avbröt
          return false;
        } else {
          //Gör något test så länken faktiskt fungerar
          unique_link = create_id(title);
        }
      } else {
        // Adressen var unik -> fortsätt försöka skicka data
        exist = false;
      }
    } catch (error) {
      throw error;
    }
  }
  return unique_link;
}

export { validateLink, create_id };
