import { useState } from "react";
import Card from "./Card";

import {
  copyButton as copyButtonStyles,
  toolTipText as toolTipTextStyles,
  showing as showingStyles,
} from "../styles/components.module.css";

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
    setTimeout(() => {
      setShowing(false);
    }, 3000);
  };
  return (
    <div className={copyButtonStyles}>
      <span className={`${toolTipTextStyles} ${showing ? showingStyles : ""}`}>{result}</span>
      <Card action={handle_click}>{children}</Card>
    </div>
  );
}
