import React, { useEffect, useState } from "react";

import Departures from "./Departures";
import { getGr8anOpen } from "../../utils/tv";

export default function ReseInfo({ api_key }) {
  const [buses, setBuses] = useState([]);
  const [metros, setMetros] = useState([]);
  const [trams, setTrams] = useState([]);

  const [lastUpdate, setLastUpdate] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    // Sätter ett interval när komponenten laddas in
    const id = setInterval(() => {
      // Uppdatera bara om Gråttan är öppen
      if (getGr8anOpen) {
        fetch(`/api/reseinfo?key=${api_key}`)
          .then((res) => {
            // Om responsen från api:et är ok försöker vi ta ut all data
            if (res.ok) {
              res
                .json()
                .then((data) => {
                  // Om det är något fel med SL:s api skickas ett error
                  if (data.error) {
                    setError(data.error);
                    setLoading(true);
                    return;
                  }
                  // Tar ut de 6 närmast kommande avgångarna
                  setBuses(data.Buses.slice(0, 6).sort());
                  setMetros(data.Metros.slice(0, 6).sort());
                  setTrams(data.Trams.slice(0, 6).sort());

                  // Kolla vilken tid informationen gäller för
                  setLastUpdate(data.LatestUpdate.split("T")[1]);
                  setLoading(false);
                  setError("");
                })
                .catch((err) => {
                  console.error(err);
                  setError("Kunde inte ladda reseinfo! :(");
                  setLoading(true);
                });
            } else {
              console.log(res);
              setError("Kunde inte ladda reseinfo! :(");
              setLoading(true);
            }
          })
          .catch((err) => {
            console.log("Dunder error");
            console.error(err);
            setError("Kunde inte ladda reseinfo! :(");
            setLoading(true);
          });
      }
    }, 1000 * 25);
    return () => clearInterval(id); // ta bort interval när komponenten laddas ut
  }, [api_key]);

  return (
    <div className="reseinfo">
      <div id={"buses"}>
        <h2>Bussar</h2>
        <Departures data={buses} />
      </div>
      <div id={"metros"}>
        <h2>Tunnelbana</h2>
        <Departures data={metros} />
      </div>
      <div id={"trams"}>
        <h2>Roslagsbanan</h2>
        <Departures data={trams} />
      </div>
      <br />
      <p>Uppdaterat: {lastUpdate}</p>
      {loading && <p>Hämtar reseinfo...</p>}
      {error && <p>Fel: {error}</p>}
    </div>
  );
}
