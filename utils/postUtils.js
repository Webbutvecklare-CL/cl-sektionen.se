import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";

function create_id(title) {
  title = title.toLowerCase();
  title = title.replace(/[åä]/g, "a");
  title = title.replace(/ö/g, "o");
  title = title.replace(/([\W_]+){1,}/g, "-"); // Tar bort alla konstiga tecken
  title = title.replace(/[ ]{1,}/g, "-"); // Byter ut alla mellanslag till -
  title = title.replace(/-*$/, ""); // Tar bort alla bindestreck i slutet

  return title;
}

async function validateLink(title) {
  let exist = true;
  let unique_link = create_id(title);
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
