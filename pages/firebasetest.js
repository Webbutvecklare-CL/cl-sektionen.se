import React, { useState } from "react";
import { saveMessagingDeviceToken } from "../firebase/messaging"; // Filen
import { isSupported } from "firebase/messaging"; // Biblioteket
import { sendNotification } from "../utils/server";

import { useAuth } from "../context/AuthContext";

export default function Firebase() {
  const [result, setResult] = useState("");
  const [debugText, setDebugText] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  const { userData } = useAuth();

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
    sendNotification(userData?.uid, notificationMessage);
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
          <div>
            <h3>Skicka notis</h3>
            <textarea
              type="textarea"
              rows="1"
              cols="30"
              value={notificationMessage}
              onChange={(e) => {
                setNotificationMessage(e.target.value);
              }}
            />
            <button onClick={handleSendNotification}>Skicka notis</button>
          </div>
        )}
      </article>
    </div>
  );
}
