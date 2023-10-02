import { useState } from "react";
import Image from "next/image";

import { getStorage, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { app } from "@/firebase/clientApp";
const storage = getStorage(app);

import { useAuth } from "@/context/AuthContext";

import BackButton from "@/components/BackButton";

import styles from "@/styles/personalrummet/tv.module.css";

import PersonalrummetLayout from "@/layouts/PersonalrummetLayout";

export default function Tv() {
  const { userData } = useAuth();

  const [image, setImage] = useState(null);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const uploadImage = async () => {
    const storageRef = ref(storage, `tv/${date.replace("/", "-")}---${image.name}`);
    try {
      await uploadBytes(storageRef, image);
    } catch (error) {
      console.log(error);
      setError("Något gick fel när bilden skulle laddas upp");
      return;
    }
    const url = await getDownloadURL(storageRef);
    console.log(url);
    setError("Bilden är uppladdad!");
  };

  const handleUpload = () => {
    let imgRes = validateImage();
    let dateRes = validateDate();

    if (imgRes !== true) {
      setError(imgRes);
      return;
    }
    if (dateRes !== true) {
      setError(dateRes);
      return;
    }
    uploadImage();
    setError("Bilden laddas upp!");
  };

  const validateImage = () => {
    if (!image) {
      return "Du måste välja en bild";
    }
    if (image.size > 0.8 * 1024 * 1024) {
      return "Filstorleken på bilden får inte vara större än 0.8 MB";
    }
    const available_formats = ["jpeg", "webp", "png"];
    if (!available_formats.includes(image.name.split(".")[1].toLowerCase())) {
      return "Filformatet på bilden måste vara något av följande: " + available_formats.join(" ");
    }

    return true;
  };

  const validateDate = () => {
    if (!date) {
      return "Du måste ange ett datum";
    }
    // 2 siffror / 2 siffror
    if (!date.match(/^\d{2}\/\d{2}$/)) {
      return "Datumet måste vara i formatet DD/MM";
    }
    return true;
  };

  return (
      <div id="contentbody">
        <BackButton page="personalrummet">Personalrummet</BackButton>
        <h1>Personalrummet - Lägg upp på TV</h1>
        {userData && (
          <div>
            <p>Här kan du ladda upp en bild som visas på TVn.</p>
            <p>
              När du laddar upp en bild tänk på att göra texten stor. Bakgrunden på TVn som inte
              täcks av bilden bestäms av den mest dominanta färgen i bilden.
            </p>
            <p>
              Du ska ange ett datum för till och med dagen bilden ska tas ner, inte mer än 7 dagar.
              Bilderna tas bort manuellt vilket kan innebär att de är kvar någon dag längre än
              datumet du angett. Om det är extra viktigt bilden tas ner exakt ett datum ska du
              kontakta{" "}
              <a href="mailto:webbunderhållare@cl-sektionen.se">webbunderhållare@cl-sektionen.se</a>
              .
            </p>
            <div className={styles.uploadPanel}>
              <div className={styles.uploadMenu}>
                <div>
                  <p>Bild</p>
                  <input
                    type="file"
                    name="image"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                    }}
                  />
                </div>
                <div>
                  <p>Datum</p>
                  <input
                    type="text"
                    name="date"
                    placeholder="DD/MM"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                    }}
                  />
                </div>
              </div>
              {image && (
                <Image
                  src={URL.createObjectURL(image)}
                  width={640}
                  height={360}
                  alt="Bild som ska laddas upp"
                />
              )}
              {!image && (
                <div className={styles.imagePlaceholder}>
                  <p>Du har inte valt en bild.</p>
                  <p>
                    Bilden ska vara av formatet jpg, jpeg, png eller webp och inte större än 0.8 MB.
                  </p>
                </div>
              )}
              <p>{error}</p>
              <button onClick={handleUpload} className="small" disabled={!image || !date}>
                Ladda upp
              </button>
            </div>
          </div>
        )}
        {!userData && (
          <div>
            <p> Du måste vara inloggad för att kunna lägga upp på TVn.</p>
          </div>
        )}
      </div>
  );
}
