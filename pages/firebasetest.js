import React, { useState } from "react";
import { saveMessagingDeviceToken } from "../firebase/messaging";
import { sendNotification } from "../utils/server";

import { useAuth } from "../context/AuthContext";

export default function Firebase() {
  const [result, setResult] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  const { userData } = useAuth();

  const handleSubscribe = async (topic) => {
    const res = await saveMessagingDeviceToken(topic);
    if (res.message) {
      setResult("Något gick fel");
    } else {
      setResult("Du prenumererar nu på " + topic);
    }
  };

  const handleSendNotification = () => {
    sendNotification(userData.uid, notificationMessage);
  };

  return (
    <div id="contentbody">
      <h1>Firebase</h1>
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
          }}>
          Notiser för news
        </button>
      </div>
      <div>
        <p>{result}</p>
      </div>

      <div>
        <h3>Skicka notis</h3>
        <input
          type="textarea"
          name=""
          id=""
          value={notificationMessage}
          onChange={(e) => {
            setNotificationMessage(e.target.value);
          }}
        />
        <button onClick={handleSendNotification}>Skicka notis</button>
      </div>
    </div>
  );
}
