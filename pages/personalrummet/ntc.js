import React, { useState } from "react";
import { getFCMToken } from "../../firebase/messaging"; // Filen
import { isSupported } from "firebase/messaging"; // Biblioteket
import { sendNotification } from "../../utils/server";

import { useAuth } from "../../context/AuthContext";

import NotificationModal from "../../components/NotificationModal";

import styles from "../../styles/ntc.module.css";

export default function NTC() {
  const [result, setResult] = useState("");
  const [debugText, setDebugText] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [type, setType] = useState("post");
  const [postId, setPostId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dryRun, setDryRun] = useState(false);

  const { userData, user } = useAuth();

  const handleSendNotification = async () => {
    let notificationMessage;
    if (type === "post") {
      notificationMessage = {
        type: "post",
        postId,
        dryRun,
      };
    } else if (type === "custom") {
      notificationMessage = {
        type: "custom",
        title,
        body,
        dryRun,
      };
    }

    try {
      await sendNotification(user, notificationMessage);
    } catch (error) {
      console.error(error);
    }
  };

  const testSupport = () => {
    isSupported().then((yes) => {
      setDebugText(yes ? "Notiser stödjs" : "Notiser stödjs inte");
    });
  };

  const testToken = async () => {
    isSupported().then(async (yes) => {
      if (!yes) {
        setDebugText("Notiser stödjs inte");
        return;
      }
      try {
        const token = await getFCMToken();
        console.log(token);
        setDebugText(`${token.substring(0, 20)}...`);
      } catch (error) {
        console.error(error);
        setDebugText("Ingen token fanns, ny behöver skapas");
      }
    });
  };

  return (
    <div id="contentbody">
      <article>
        <h1>NotisTestarCentrum</h1>
        <p>
          Här testar vi notiser. Om du vill vara med och testa kan du välja vilken kategori du vill
          få notiser ifrån, du kan välja båda. Om du är osäker på om din enhet stödjer notiser tryck
          på &quot;Kolla support&quot;.
          <i className={`fa ${styles.faAppleShare}`} />
        </p>
        <div className={styles.subscriptionMenu}>
          <button
            type="button"
            onClick={() => {
              setSettingsOpen(true);
            }}>
            Öppna notis inställningar
          </button>

          <button type="button" onClick={testSupport}>Kolla support</button>
          <button type="button" onClick={testToken}>Kolla Token</button>
          <button type="button"
            onClick={() => {
              isSupported().then(async (yes) => {
                if (!yes) {
                  setDebugText("Notiser stödjs inte");
                  return;
                }
                if (Notification) {
                  setDebugText(Notification.permission);
                } else {
                  setDebugText("Notification finns inte");
                }
              });
            }}>
            Kolla Permission
          </button>
          <button
          type="button"
            onClick={() => {
              setDebugText(navigator.userAgent);
            }}>
            Kolla device
          </button>
        </div>
        <div style={{ marginTop: "20px" }}>
          <p>{result}</p>
          <p>Debug: {debugText}</p>
        </div>

        {/* Skicka notis kan användas av inloggade */}
        {userData && (
          <>
            <h3>Skicka notis</h3>
            <div className={styles.sendPanel}>
              <p>Vilken typ av notis vill du skicka?</p>
              <div className={styles.typeSelect}>
                <button
                  type="button"
                  onClick={() => {
                    setType("post");
                  }}>
                  Inlägg
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType("custom");
                  }}>
                  Anpassad
                </button>
              </div>
              {type === "post" && (
                <div>
                  <p>Vilket inlägg vill du skicka notis om?</p>
                  <input
                    type="text"
                    value={postId}
                    onChange={(e) => {
                      setPostId(e.target.value);
                    }}
                  />
                </div>
              )}
              {type === "custom" && (
                <div className={styles.message}>
                  <p>Skriv in titel</p>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />

                  <p>Skriv in notistexten</p>
                  <textarea
                    type="textarea"
                    rows="3"
                    cols="30"
                    value={body}
                    onChange={(e) => {
                      setBody(e.target.value);
                    }}
                  />
                </div>
              )}
              <label>
                <input
                  type="checkbox"
                  value={dryRun}
                  onChange={() => {
                    setDryRun(!dryRun);
                  }}
                />
                Dry run
              </label>
              <button type="button" onClick={handleSendNotification}>Skicka notis</button>
            </div>
          </>
        )}
      </article>
      <NotificationModal
        show={settingsOpen}
        handleClose={() => {
          setSettingsOpen(false);
        }}
      />
    </div>
  );
}
