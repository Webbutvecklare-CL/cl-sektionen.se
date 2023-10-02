import { useEffect, useState } from "react";
import Image from "next/image";

import { getStorage, getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { app } from "@/firebase/clientApp";
const storage = getStorage(app);

import { useAuth } from "@/context/AuthContext";
import { getAllImages } from "@/utils/tv";

import BackButton from "@/components/BackButton";

import styles from "@/styles/personalrummet/tv.module.css";

export default function Tv() {
  const { userData } = useAuth();

  const [imageList, setImageList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userData && userData.permission === "admin") {
      getImages();
    }
  }, [userData]);

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

  const handleDelete = async (fileName) => {
    // Tar bort bilden från storage
    const imageRef = ref(storage, `tv/${fileName}`);
    try {
      const res = await deleteObject(imageRef);
      return true;
    } catch (error) {
      console.error(error);
      setError("Något gick fel när bilden skulle tas bort");
      return false;
    }
  };

  const getImages = () => {
    // Hämtar bilderna när sidan laddas in
    getAllImages().then((list) => {
      setImageList(list);
    });
  };

  const ImageHolder = ({ image }) => {
    // Gör om alla konstiga tecken till vanliga tecken
    const fileName = decodeURIComponent(image.split("%2F")[1].split("?")[0]);
    const date = fileName.split("---")[0];
    const name = fileName.split("---")[1];

    const [status, setStatus] = useState("");
    const [response, setResponse] = useState("");

    return (
      <div className={styles.imageContainer}>
        <div className={styles.imageMeta}>
          <p>Synlig tills: {date}</p>
          <p>{name}</p>
        </div>
        <div className={styles.imageHolder}>
          {response && <p>{response}</p>}
          {!response && <Image src={image} alt={name} width={160} height={100} />}
        </div>
        <div className={styles.imageOptions}>
          <button
            disabled={status === "Laddar..." || status === "Borttagen"}
            onClick={async () => {
              setStatus("Laddar...");

              // Tar bor bilden
              let res = await handleDelete(fileName);
              if (res) {
                setResponse("Bilden är borttagen!");
                setStatus("Borttagen");
              } else {
                setResponse("Det gick inte att ta bort bilden!");
                setStatus("Prova igen");
              }
            }}>
            {status && <>{status}</>}
            {!status && <>Ta bort</>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div id="contentbody">
      <BackButton page="personalrummet">Personalrummet</BackButton>
      <h1>Personalrummet - Hantera bilder på TV</h1>
      <p>Här kan se vilka bilder som visas på TV:n och och ta bort bilder dem.</p>
      {error && <p>{error}</p>}
      {userData && userData.permission === "admin" && (
        <div className={styles.imageList}>
          {imageList.map((image, idx) => (
            <ImageHolder image={image} key={idx} />
          ))}
        </div>
      )}
      {!userData && (
        <div>
          <p>Du måste vara inloggad för att hantera bilder på TVn.</p>
        </div>
      )}

      {userData && userData.permission !== "admin" && (
        <div>
          <p>Du måste ha admin behörighet för att hantera bilderna på TVn.</p>
        </div>
      )}
    </div>
  );
}
