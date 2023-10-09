import definitions from "@/content/data/ordbok.json";

import styles from "@/styles/definition.module.css";
import { useEffect, useRef } from "react";

export default function Definition({ term, text, children }) {
  const tooltipRef = useRef(null);

  useEffect(() => {
    function handleResize() {
      // Vänstra respektive högra kantens koordinater
      let { left, right } = tooltipRef.current.getBoundingClientRect();

      let oldValue = tooltipRef.current.style.getPropertyValue("--offset");
      let offset = parseInt(oldValue.substring(0, oldValue.length - 2)) || 0;

      // Om utanför så beräknas offseten plus extra marginal
      let newOffset = 0;
      const margin = 30;
      if (left + offset < margin) {
        newOffset = left + offset - margin;
      } else if (right + offset > window.innerWidth - margin * 2) {
        newOffset = right + offset - window.innerWidth + margin * 2;
      } else {
        return;
      }
      tooltipRef.current.style.setProperty("--offset", `${newOffset}px`);
    }
    handleResize();
    window.addEventListener("resize", handleResize, false);
  }, []);

  const handleClick = (e) => {};

  // Hittar ordet i ordlistan
  const definition = definitions.filter((word) => word.begrepp === term)[0];

  // Plockar ut betydelsen
  const description = definition?.betydelse || "Förklaring saknas, kolla i ordboken.";
  return (
    <span className={styles.container} onClick={handleClick}>
      {text || children}
      <span ref={tooltipRef} className={styles.tooltip}>
        {description}
      </span>
    </span>
  );
}
