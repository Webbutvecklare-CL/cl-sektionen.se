import React, { useState } from "react";
import { saveMessagingDeviceToken } from "../firebase/messaging";

export default function Firebase() {
  const [result, setResult] = useState("");
  const [notifMessage, setNotifMessage] = useState("");

  const handleSubscribe = async (topic) => {
    const res = await saveMessagingDeviceToken(topic);
    if (res.message) {
      setResult("Något gick fel");
    } else {
      setResult("Du prenumererar nu på " + topic);
    }
  };

  const handleSendNotification = () => {
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "hej-armin",
        type: "event",
        title: notifMessage,
        committee: "Näringslivsnämnden",
        image: "",
      }),
    };
    fetch(`/api/notifications`, options).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          console.log(data);
        });
      }
    });
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
            handleSubscribe("news");
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
          value={notifMessage}
          onChange={(e) => {
            setNotifMessage(e.target.value);
          }}
        />
        <button onClick={handleSendNotification}>Skicka notis</button>
      </div>
    </div>
  );
}
