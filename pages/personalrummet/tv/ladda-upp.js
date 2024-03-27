import { useMemo, useState } from "react";
import Image from "next/image";

import { getStorage, getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { addDoc, collection, getFirestore, Timestamp } from "firebase/firestore";
import { app } from "@/firebase/clientApp";
const storage = getStorage(app);
const firestore = getFirestore(app);

import { useAuth } from "@/context/AuthContext";

import BackButton from "@/components/BackButton";
import Label from "@/components/personalrummet/form components/Label";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import styles from "@/styles/personalrummet/tv.module.css";
import { useRef } from "react";
import { FastAverageColor } from "fast-average-color";
import { useEffect } from "react";

export default function Tv() {
  const { userData } = useAuth();

  const [image, setImage] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);

  const imageRef = useRef(null);

  const fac = new FastAverageColor();

  // För att bli av med massa flicker (om-renderas när någon state ändras)
  useMemo(() => {
    if (image) {
      setImageObj(URL.createObjectURL(image));
    }
  }, [image]);

  useEffect(() => {
    if (!imageRef.current) {
      return;
    }
    try {
      fac
        .getColorAsync(imageRef.current, { algorithm: "dominant" })
        .then((color) => {
          imageRef.current.style.backgroundColor = color.rgba;
          // Kanske kan användas på reseinfo för att minska kontrasten eller öka idk
          // container.style.color = color.isDark ? "#fff" : "#000";
        })
        .catch((e) => {
          console.log(e.message);
          imageRef.current.style.backgroundColor = "";
        });
    } catch (error) {
      console.error(error);

      imageRef.current.style.backgroundColor = "";
    }
  }, [fac]);

  const uploadImage = async (imageRef) => {
    try {
      await uploadBytes(imageRef, image);
      return getDownloadURL(imageRef);
    } catch (error) {
      console.log(error);
      setError("Något gick fel när bilden skulle laddas upp");
      setStatus("");
      throw error;
    }
  };

  const uploadImageDoc = async (imageData, imageRef) => {
    try {
      await addDoc(collection(firestore, "tv"), imageData);
    } catch (error) {
      console.log(error);
      setError("Det gick inte skapa ett dokument för bilden!");
      setStatus("Försöker radera bilden");

      try {
        await deleteObject(imageRef);
        console.log("Bilden raderades");
        setStatus("");
      } catch (error) {
        console.log(error);
        setError("Något gick fel när bilden skulle raderas");
        setStatus("");
        throw error;
      }
      throw error;
    }
  };

  const handleUpload = async () => {
    setStatus("Validerar");
    setError("");
    setSuccess(false);
    const imgRes = validateImage();
    if (imgRes !== true) {
      setError(imgRes);
      setStatus("");
      return;
    }

    const dateValidation = validateDate();
    if (dateValidation !== true) {
      setError(dateValidation);
      setStatus("");
      return;
    }

    setStatus("Laddar upp bilden");
    const imageRef = ref(storage, `tv/${image.name}`);
    let downloadUrl = "";
    try {
      downloadUrl = await uploadImage(imageRef);
    } catch (error) {
      console.log(error);
      setError("Något gick fel när länken till bilden skulle hämtas");
      setStatus("");
      return;
    }

    const imageData = {
      creator: userData.uid,
      startDate: Timestamp.fromDate(new Date(startDate)),
      endDate: Timestamp.fromDate(new Date(endDate)),
      url: downloadUrl,
    };

    setStatus("Laddar upp bilddokumentet");
    try {
      await uploadImageDoc(imageData, imageRef);
    } catch (error) {
      console.log(error);
      return;
    }

    setStatus("Bilden är uppladdad!");
    setSuccess(true);
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
      return `Filformatet på bilden måste vara något av följande: ${available_formats.join(" ")}`;
    }

    return true;
  };

  const validateDate = () => {
    if (startDate === "") {
      return "Du måste ange ett startdatum";
    }
    if (endDate === "") {
      return "Du måste ange ett slutdatum";
    }
    if (startDate > endDate) {
      return "Slutdatumet måste vara efter startdatumet";
    }
    if (new Date(endDate).getTime() - new Date(startDate).getTime() > 7 * 24 * 60 * 60 * 1000) {
      return "Bilden får visas i max 7 dagar";
    }

    return true;
  };

  return (
    <div id="contentbody">
      <BackButton page="personalrummet/tv">Hantera bilder på TV:n</BackButton>
      <h1>Personalrummet - Ladda upp på TV</h1>
      {userData && (
        <div>
          <p>Här kan du ladda upp en bild som visas på TVn.</p>
          <p>
            När du laddar upp en bild tänk på att göra texten stor. Bakgrunden på TVn som inte täcks
            av bilden bestäms av den mest dominanta färgen i bilden. Du kan se detta i
            förhandsvisningen.
          </p>
          <p>
            Bilden kommer att visas på TVn från och med det datum du anger. Bilden kommer att sluta
            visas automatiskt efter slutdatumet du angivit. Du kan ändra datumen senare på hantera
            sidan.
          </p>
          <div className={styles.uploadPanel}>
            <div className={styles.uploadMenu}>
              <div>
                <Label>Bild:</Label>
                <input
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                  }}
                />
              </div>
              <div className={styles.dateInputs}>
                <div>
                  <Label required>Visas f.o.m.:</Label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <Label required>Visas t.o.m.:</Label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    max={
                      new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0]
                    }
                  />
                </div>
              </div>
            </div>
            {image && (
              <div className={styles.imageWrapper}>
                <Image
                  src={imageObj}
                  width={640}
                  height={360}
                  ref={imageRef}
                  alt="Bild som ska laddas upp"
                />
                <div className={styles.imageOverlay} data-visible={success}>
                  {/* Fontawsome green check */}
                  <FontAwesomeIcon icon={faCircleCheck} />
                </div>
              </div>
            )}
            {!image && (
              <div className={styles.imagePlaceholder}>
                <p>Du har inte valt en bild.</p>
                <p>
                  Bilden ska vara av formatet jpg, jpeg, png eller webp och inte större än 0.8 MB.
                </p>
              </div>
            )}
            {error && <p className={styles.error}>{error}</p>}
            {status && <p className={styles.status}>{status}</p>}
            <button type="button" onClick={handleUpload} className="small" disabled={!image}>
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
