import React, { useState } from "react";
import { saveMessagingDeviceToken } from "../firebase/messaging"; // Filen
import { isSupported } from "firebase/messaging"; // Biblioteket
import { sendNotification } from "../utils/server";

import { useAuth } from "../context/AuthContext";

import styles from "../styles/firebasetest.module.css";

export default function Firebasetest() {
  const [result, setResult] = useState("");
  const [debugText, setDebugText] = useState("");

  const [type, setType] = useState("post");
  const [postId, setPostId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { userData, user } = useAuth();

  const handleSubscribe = async (topic) => {
    const res = await saveMessagingDeviceToken(topic);
    if (res.message) {
      alert(
        "Det gick inte att prenumerera på notiser.\n\nDu nekade tillåtelse eller så stödjs inte notiser på din enhet eller webbläsare."
      );
      setResult("Något gick fel");
      setDebugText(res.message);
    } else {
      setResult("Du prenumererar nu på " + topic);
      setDebugText("Token: " + res);
    }
  };

  const handleSendNotification = () => {
    let notificationMessage;
    if (type == "post") {
      notificationMessage = {
        type: "post",
        postId,
      };
    } else if (type == "custom") {
      notificationMessage = {
        type: "custom",
        title,
        body,
      };
    }

    sendNotification(user, notificationMessage);
  };

  const testSupport = () => {
    isSupported().then((yes) => {
      setDebugText(yes ? "Notiser stödjs" : "Notiser stödjs inte");
    });
  };

  return (
    <div id="contentbody">
      <article>
        <h1>Notis testar centrum</h1>
        <p>
          Här testar vi notiser. Om du vill vara med och testa kan du välja vilken kategori du vill
          få notiser ifrån, du kan välja båda. Om du är osäker på om din enhet stödjer notiser tryck
          på &quot;Kolla support&quot;.
        </p>
        <div>
          <button
            onClick={() => {
              handleSubscribe("event");
            }}>
            Notiser för event
          </button>
          <button
            onClick={() => {
              handleSubscribe("information");
            }}
            style={{ marginLeft: "20px" }}>
            Notiser för information
          </button>

          <button style={{ marginLeft: "20px" }} onClick={testSupport}>
            Kolla support
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
                  onClick={() => {
                    setType("post");
                  }}>
                  Inlägg
                </button>
                <button
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

              <button onClick={handleSendNotification}>Skicka notis</button>
            </div>
          </>
        )}
      </article>
    </div>
  );
}
