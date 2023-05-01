import { sendNotification } from "../../utils/server";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  // Verifiera användaren
  

  // Typ lite oklart vad dessa headers gör
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Content-Type", "application/json");

  // Skickar tillbaka data om alla färdmedel
  //   const body = JSON.parse(req.body);
  console.log("Received notification request with message:", req.body);
  res.status(200).json({ data: "Notis skickad med meddelandet: " + req.query.message });

  // Skickar notis till alla som följer eventuella taggar
  sendNotification(req.body);
  return;

  // För att kunna använda detta apiet behöver anroparen ange en nyckel
  if (req.query.key !== process.env.CL_API_KEY) {
    console.log("Invalid access");
    return res
      .status(403)
      .json("Du måste ange en api nyckel för att använda api:et. Kontakta webbansvariga.");
  }
}
