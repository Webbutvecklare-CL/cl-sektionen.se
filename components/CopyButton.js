import { useState } from "react";
import Card from "./Card";
export default function CopyButton({ text, children }) {
  const [result, setResult] = useState("");
  const [showing, setShowing] = useState(false);
  const handle_click = async () => {
    setShowing(true);
    if (!navigator.clipboard) {
      setResult("Kunde inte kopiera");
      console.log("navigator.clipboard är undefined");
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setResult("Kopierat");
      } catch (err) {
        console.error("Det gick inte att kopiera kalender id: ", err);
        setResult("Kunde inte kopiera");
      }
    }

    // Gör att tooltipen försvinner efter 3 sekunder
    setTimeout(function () {
      setShowing(false);
    }, 3000);
  };
  return (
    <div className="copy-button">
      <span className={`tooltiptext ${showing ? "showing" : ""}`}>{result}</span>
      <Card action={handle_click}>{children}</Card>
    </div>
  );
}
