import React, { useState } from "react";
import { saveMessagingDeviceToken } from "../firebase/messaging";

export default function Firebase() {
  const [result, setResult] = useState("");

  const handleSubscribe = async (topic) => {
    const res = await saveMessagingDeviceToken(topic);
    if (res.message) {
      setResult("Något gick fel");
    } else {
      setResult("Du prenumererar nu på " + topic);
    }
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
    </div>
  );
}
