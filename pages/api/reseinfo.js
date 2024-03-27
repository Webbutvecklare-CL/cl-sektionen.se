export default async function handler(req, res) {
  // För att kunna använda detta apiet behöver anroparen ange en nyckel
  if (req.query.key !== process.env.CL_API_KEY) {
    console.log("Invalid access");
    return res
      .status(403)
      .json("Du måste ange en api nyckel för att använda api:et. Kontakta webbansvariga.");
  }

  // Hämtar data från SL:s api. https://www.trafiklab.se/api/trafiklab-apis/sl/departures-4/
  // Params funkar typ inte men aa
  await fetch(
    `https://api.sl.se/api2/realtimedeparturesV4.json?key=${process.env.SL_API_KEY}&siteid=9204&timewindow=60`,
    {
      method: "GET",
      params: JSON.stringify({
        metros: false,
        ship: false,
        train: false,
        EnablePrediction: true,
      }),
    }
  )
    .then(async (result) => {
      // result är resultatet från SL:s api
      // Försöker få ut all json data och skickar tillbaka till anroparen
      await result.json().then((data) => {
        if (result.ok) {
          if (data.StatusCode === 0) {
            // Typ lite oklart vad dessa headers gör
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", true);
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Cache-Control", "max-age=30");

            // Skickar tillbaka data om alla färdmedel
            res.status(200).json(data.ResponseData);
          } else {
            /* Skickar 200 eftersom det inte går att ta emot data om vi skickar
             *  500 vet inte varför men något med next/react antagligen.
             *  För koder under 5000 är det fel från vår sida typ att vi gjort för många anrop
             */
            if (data.StatusCode > 5000) {
              res.status(200).send({ error: data.Message });
            } else {
              res.status(200).send({ error: "Kontakta webbansvariga" });
            }
          }
        } else {
          throw result;
        }
      });
    })
    .catch((err) => {
      // I fall typ sl:s api är helt nere.
      console.error(err);
      res.status(500).json({ err });
    });
}
