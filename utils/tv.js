import { app } from "../firebase/clientApp";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
const storage = getStorage(app);

async function getAllImages() {
  // returnerar ett promise så att vi kan invänta resultatet
  return new Promise(async (resolve, reject) => {
    // Referens till mappen med alla bilder för TV:n
    const tvImagesRef = ref(storage, "tv/");

    // Hämtar alla referenser till bilderna
    listAll(tvImagesRef)
      .then(async (res) => {
        // Hämtar varje url från varje bildreferens/item
        const { items } = res;
        const urls = await Promise.all(items.map((imageRef) => getDownloadURL(imageRef)));
        resolve(urls);
      })
      .catch((err) => {
        console.error(err);
        reject([]);
      });
  });
}

function getIsNight() {
  // Kollar om klockan är mellan 17-08
  let now = new Date().getHours();
  if (now > 17 || now < 8) {
    return true;
  } else {
    return false;
  }
}

function getGr8anOpen() {
  // Kollar om klockan är mellan 03-06 (Gråttans öppettider)
  let now = new Date().getHours();
  if (now > 3 && now < 6) {
    return false;
  } else {
    return true;
  }
}

/** assumes array elements are primitive types
 * check whether 2 arrays are equal sets.
 * @param  {} a1 is an array
 * @param  {} a2 is an array
 * by https://stackoverflow.com/a/55614659
 */
function areArraysEqualSets(a1, a2) {
  const superSet = {};
  for (const i of a1) {
    const e = i + typeof i;
    superSet[e] = 1;
  }

  for (const i of a2) {
    const e = i + typeof i;
    if (!superSet[e]) {
      return false;
    }
    superSet[e] = 2;
  }

  for (let e in superSet) {
    if (superSet[e] === 1) {
      return false;
    }
  }

  return true;
}

export { getAllImages, getIsNight, areArraysEqualSets, getGr8anOpen };
