import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { getStorage, ref, deleteObject } from "firebase/storage";
import {
  collection,
  getFirestore,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { app } from "@/firebase/clientApp";
const storage = getStorage(app);
const firestore = getFirestore(app);

import { useAuth } from "@/context/AuthContext";

import BackButton from "@/components/BackButton";
import Label from "@/components/personalrummet/form components/Label";

import styles from "@/styles/personalrummet/tv.module.css";

export default function Tv() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const { userData } = useAuth();

  const router = useRouter();

  const [oldImages, setOldImages] = useState([]);
  const [visibleImages, setVisibleImages] = useState([]);
  const [error, setError] = useState("");

  // Hämtar alla bilder när userData hämtats
  useEffect(() => {
    const getImages = async () => {
      // Hämtar bilderna när sidan laddas in
      const imageDocsRef = await getDocs(collection(firestore, "tv"));
      let visibleImageDocs = [];
      let oldImageDocs = [];
      imageDocsRef.forEach((doc) => {
        const docId = doc.id;
        const data = doc.data();

        // Kollar om bilden visas
        const endDate = data.endDate.toDate();
        const startDate = data.startDate.toDate().setHours(0, 0, 0, 0);
        if (startDate <= startOfToday && endDate >= startOfToday) {
          visibleImageDocs.push({ id: docId, ...data });
        } else {
          oldImageDocs.push({ id: docId, ...data });
        }
      });
      setVisibleImages(visibleImageDocs);
      setOldImages(oldImageDocs);
    };

    if (userData) {
      getImages();
    }
    // Ta inte med startOfToday i beroendet, blir knas annars
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const handleDelete = async (image) => {
    // Ta bort bild dokumentet
    try {
      await deleteDoc(doc(firestore, "tv", image.id));
    } catch (error) {
      console.error(error);
      throw { type: "image-doc-deletion-failed", error };
    }

    // Ta bort bilden
    try {
      const imageRef = ref(storage, image.url);
      await deleteObject(imageRef);
    } catch (error) {
      console.error(error);
      throw { type: "image-deletion-failed", error };
    }

    console.log("Bild dokumentet och bilden är borttagen!");
  };

  const handleEdit = async (image, newStartDate, newEndDate) => {
    // Uppdatera bild dokumentet
    try {
      let updatedDates = {};

      // Gör om datumen till firebase timestamps
      const newFbStartDate = Timestamp.fromDate(new Date(newStartDate));
      const newFbEndDate = Timestamp.fromDate(new Date(newEndDate));

      // Kollar om datumet ändrats
      if (newFbStartDate.seconds != image.startDate.seconds) {
        updatedDates.startDate = newFbStartDate;
      }

      if (newFbEndDate.seconds != image.endDate.seconds) {
        updatedDates.endDate = newFbEndDate;
      }

      await updateDoc(doc(firestore, "tv", image.id), updatedDates);
      console.log("Datumen är uppdaterade!", updatedDates);
    } catch (error) {
      console.error(error);
      throw { type: "image-doc-update-failed", error };
    }
  };

  const ImageHolder = ({ image }) => {
    // Gör om alla konstiga tecken till vanliga tecken
    const fileName = decodeURIComponent(image.url.split("%2F")[1].split("?")[0]);

    const startDateComponents = image.startDate.toDate().toLocaleDateString("sv-SE").split("-");
    const endDateComponents = image.endDate.toDate().toLocaleDateString("sv-SE").split("-");

    // Gör om till formatet DD/MM
    const startDateText = `${startDateComponents[2]}/${startDateComponents[1]}`;
    const endDateText = `${endDateComponents[2]}/${endDateComponents[1]}`;

    const [status, setStatus] = useState("");
    const [response, setResponse] = useState("");

    const [edit, setEdit] = useState(false);

    const removeHandler = async () => {
      setStatus("Laddar...");

      // Tar bor bilden
      try {
        await handleDelete(image);
        setResponse("Bilden är borttagen!");
        setStatus("Borttagen");
      } catch (error) {
        if (error.type === "image-doc-deletion-failed") {
          setResponse("Det gick inte att ta bort bild dokumentet!");
          setStatus("Prova igen");
          return;
        } else if (error.type === "image-deletion-failed") {
          setResponse(
            "Dokumentet är borttaget men inte bilden! Bilden visas inte längre på TV:n. Kontakta webbansvariga för att ta bort bilden."
          );
          setStatus("Prova igen");
          return;
        } else {
          console.error(error);
          setResponse("Det gick inte att ta bort bilden!");
          setStatus("Prova igen");
        }
      }
    };

    const Options = () => {
      return (
        <>
          <button
            disabled={status === "Laddar..." || status === "Borttagen"}
            onClick={removeHandler}>
            {status && <>{status}</>}
            {!status && <>Ta bort</>}
          </button>
          <button
            disabled={status === "Laddar..." || status === "Borttagen"}
            onClick={() => setEdit(true)}>
            Ändra
          </button>
        </>
      );
    };

    // Meny för att ändra datum
    const EditMenu = () => {
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      const [newEndDate, setNewEndDate] = useState(
        image.endDate.toDate().toISOString().split("T")[0]
      );
      const [newStartDate, setNewStartDate] = useState(
        image.startDate.toDate().toISOString().split("T")[0]
      );
      const minStartDate = new Date(startOfToday).toISOString().split("T")[0];

      const [error, setError] = useState("");

      const validateDate = () => {
        if (newStartDate === "") {
          return "Du måste ange ett startdatum";
        }
        if (newEndDate === "") {
          return "Du måste ange ett slutdatum";
        }
        if (newStartDate > newEndDate) {
          return "Slutdatumet måste vara efter startdatumet";
        }
        if (new Date(newEndDate).getTime() - new Date(newStartDate).getTime() > sevenDays) {
          return "Bilden får visas i max 7 dagar";
        }

        return true;
      };

      const editHandler = async () => {
        const validation = validateDate();
        if (validation !== true) {
          setError(validation);
          return;
        }
        try {
          await handleEdit(image, newStartDate, newEndDate);
          setEdit(false);
          setResponse("Datumen är uppdaterade!");
        } catch (error) {
          console.error(error.error);
          setResponse("Det gick inte att ändra datumen! " + error.error.message);
        }
        setEdit(false);
      };

      return (
        <div className={styles.editMenu}>
          <div>
            <div className={styles.inputContainer}>
              <Label>Visas fom:</Label>
              <input
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                min={minStartDate}
              />
            </div>
            <div className={styles.inputContainer}>
              <Label>Visas tom:</Label>
              <input
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                min={new Date(new Date(newStartDate).getTime()).toISOString().split("T")[0]}
                max={
                  new Date(new Date(newStartDate).getTime() + sevenDays).toISOString().split("T")[0]
                }
              />
            </div>
          </div>
          <div>
            <button className="small" onClick={editHandler}>
              Uppdatera
            </button>
            <button className="small hollow" onClick={() => setEdit(false)}>
              Avbryt
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      );
    };

    return (
      <div className={styles.imageContainer}>
        <div className={styles.imageMeta}>
          <p>
            Synlig mellan {startDateText} och {endDateText}
          </p>
        </div>

        <div className={styles.imageOptions}>
          {(userData.uid === image.creator || userData.permission === "admin") && <Options />}
          {!(userData.uid === image.creator || userData.permission === "admin") && (
            <p>Du kan inte ta bort eller ändra denna bild</p>
          )}
        </div>
        <div className={styles.imageHolder}>
          {response && !edit && <p>{response}</p>}
          {!response && !edit && <Image src={image.url} alt={fileName} width={160} height={100} />}
          {edit && <EditMenu />}
        </div>
      </div>
    );
  };

  return (
    <div id="contentbody">
      <BackButton page="personalrummet">Personalrummet</BackButton>
      <h1>Personalrummet - Hantera bilder på TV:n</h1>
      <p>
        Nedan kan du se vilka bilder som visas på TV:n och vilka samt vilka som har eller kommer att
        visas.
        <br />
        Du kan även ta bort och ändra bilder du själv laddat upp. När du uppdaterat behöver du ladda
        om sidan för att se uppdateringen. Bilderna sluta visas automatiskt, du behöver alltså inte
        ta bort bilden manuellt.
      </p>
      <button onClick={() => router.push("/personalrummet/tv/ladda-upp")}>Ladda upp bild</button>
      {error && <p>{error}</p>}
      {userData && (
        <>
          <h2>Bilder som visas på TV:n</h2>
          <div className={styles.imageList}>
            {visibleImages.map((image, idx) => (
              <ImageHolder image={image} key={idx} />
            ))}
          </div>
          <h2>Bilder som inte visas</h2>
          <div className={styles.imageList}>
            {oldImages.map((image, idx) => (
              <ImageHolder image={image} key={idx} />
            ))}
          </div>
        </>
      )}
      {!userData && (
        <div>
          <p>Du måste vara inloggad för att hantera och se bilder på TVn.</p>
        </div>
      )}
    </div>
  );
}
